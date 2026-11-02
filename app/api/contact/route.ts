import { isMailConfigured, sendContactMessage, type ContactMessage } from "@/lib/mail";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  // The hidden "website" field is only ever filled in by bots.
  if (text(body?.website, 200)) return Response.json({ ok: true });

  const message: ContactMessage = {
    name: text(body?.name, 120),
    email: text(body?.email, 200),
    phone: text(body?.phone, 40),
    cabin: text(body?.cabin, 120),
    dates: text(body?.dates, 120),
    guests: text(body?.guests, 20),
    message: text(body?.message, 5000),
  };

  if (!message.name || !EMAIL_PATTERN.test(message.email) || !message.message) {
    return Response.json({ error: "Please add your name, a valid email and a message." }, { status: 400 });
  }

  if (!isMailConfigured()) {
    console.error("Contact form used before SMTP settings were added.");
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  try {
    await sendContactMessage(message);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "not-sent" }, { status: 502 });
  }
}
