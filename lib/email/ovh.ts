import "server-only";
import nodemailer from "nodemailer";

type LeadMail = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyRef?: string;
  sourceUrl?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export async function sendLeadNotification(input: LeadMail): Promise<boolean> {
  const user = process.env.OVH_SMTP_USER?.trim();
  const pass = process.env.OVH_SMTP_PASSWORD;
  const to = process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  if (!user || !pass || !to) return false;

  const port = Number(process.env.OVH_SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.OVH_SMTP_HOST?.trim() || "ssl0.ovh.net",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });

  const subject = input.propertyRef
    ? `Nouvelle demande — ${input.propertyRef}`
    : `Nouveau contact — ${input.subject || input.name}`;

  await transporter.sendMail({
    from: process.env.OVH_SMTP_FROM?.trim() || user,
    to,
    replyTo: input.email,
    subject,
    text: [
      `Nom: ${input.name}`,
      `Email: ${input.email}`,
      `Téléphone: ${input.phone || "Non renseigné"}`,
      `Sujet: ${input.subject || "Demande générale"}`,
      input.propertyRef ? `Référence: ${input.propertyRef}` : "",
      input.sourceUrl ? `Page: ${input.sourceUrl}` : "",
      "",
      input.message,
    ].filter(Boolean).join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0b1733;line-height:1.6">
        <h1 style="font-size:22px">Nouvelle demande depuis le site</h1>
        <p><strong>Nom :</strong> ${escapeHtml(input.name)}<br>
        <strong>Email :</strong> ${escapeHtml(input.email)}<br>
        <strong>Téléphone :</strong> ${escapeHtml(input.phone || "Non renseigné")}<br>
        <strong>Sujet :</strong> ${escapeHtml(input.subject || "Demande générale")}</p>
        ${input.propertyRef ? `<p><strong>Référence :</strong> ${escapeHtml(input.propertyRef)}</p>` : ""}
        <div style="padding:16px;background:#f7f5ef;border-left:3px solid #c8a560">${escapeHtml(input.message).replace(/\n/g, "<br>")}</div>
        ${input.sourceUrl ? `<p style="font-size:12px;color:#666">Page : ${escapeHtml(input.sourceUrl)}</p>` : ""}
      </div>`,
  });

  return true;
}
