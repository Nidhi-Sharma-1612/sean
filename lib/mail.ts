import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

let cachedTransport: Transporter | null = null;

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  cabin?: string;
  dates?: string;
  guests?: string;
  message: string;
}

export function isMailConfigured() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD);
}

function getTransport() {
  if (cachedTransport) return cachedTransport;

  const port = Number(process.env.SMTP_PORT);
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return cachedTransport;
}

export async function sendContactMessage(message: ContactMessage) {
  const rows: [string, string | undefined][] = [
    ["Name", message.name],
    ["Email", message.email],
    ["Phone", message.phone],
    ["Cabin", message.cabin],
    ["Dates", message.dates],
    ["Guests", message.guests],
  ];
  const filled = rows.filter(([, value]) => value);

  await getTransport().sendMail({
    from: { name: `${site.name} Website`, address: process.env.SMTP_USER ?? "" },
    to: process.env.CONTACT_TO_EMAIL || site.email,
    replyTo: { name: message.name, address: message.email },
    subject: `${message.dates ? "Booking request" : "New message"} from ${message.name}${message.cabin ? ` - ${message.cabin}` : ""}`,
    text: [...filled.map(([label, value]) => `${label}: ${value}`), "", message.message].join("\n"),
  });
}

/** No mailing-list service yet, so each sign-up is emailed to the owners to add by hand. */
export async function sendNewsletterSignup(email: string) {
  await getTransport().sendMail({
    from: { name: `${site.name} Website`, address: process.env.SMTP_USER ?? "" },
    to: process.env.CONTACT_TO_EMAIL || site.email,
    replyTo: email,
    subject: `New newsletter sign-up: ${email}`,
    text: `${email} signed up for the ${site.name} newsletter from the website footer.`,
  });
}
