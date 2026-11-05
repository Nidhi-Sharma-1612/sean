import { isMailConfigured, sendNewsletterSignup } from "@/lib/mail";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  // The hidden "website" field is only ever filled in by bots.
  if (typeof body?.website === "string" && body.website) return Response.json({ ok: true });

  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!isMailConfigured()) {
    console.error("Newsletter form used before SMTP settings were added.");
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  try {
    await sendNewsletterSignup(email);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "not-sent" }, { status: 502 });
  }
}
