import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@example.com';

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Cambridge AI — your study command center',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #050510; color: #F0EEFF; padding: 32px;">
        <h1 style="background: linear-gradient(135deg, #6C63FF, #00D4FF); -webkit-background-clip: text; color: transparent;">
          Welcome, ${name}!
        </h1>
        <p>You're all set to start studying smarter for your Cambridge O/A Levels.</p>
        <p>Head to your dashboard and pick your first past paper.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:white;border-radius:8px;text-decoration:none;">
          Open Dashboard
        </a>
      </div>
    `,
  });
}

export async function sendSubscriptionConfirmation(to: string, plan: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to ${plan} — Cambridge AI`,
    html: `<p>Your ${plan} subscription is now active. Enjoy unlimited access.</p>`,
  });
}