"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { submitContactForm, type ContactState } from "@/lib/actions/contact";
import {
  createMetaEventId,
  getMetaClientContext,
  type MetaClientContext,
} from "@/lib/meta-client-events";
import { trackGaEvent, trackGaGenerateLead } from "@/lib/google-analytics";
import { trackMetaContact, trackMetaLead } from "@/lib/meta-pixel";
import { usePrivacyConsent } from "@/lib/privacy-consent";

const initial: ContactState = {};

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, initial);
  const eventIdRef = useRef<string>("");
  const firedEventIdRef = useRef<string | null>(null);
  const [metaContext, setMetaContext] = useState<MetaClientContext>({ eventSourceUrl: "" });
  const privacyConsent = usePrivacyConsent();

  if (!eventIdRef.current) {
    eventIdRef.current = createMetaEventId("contact_form");
  }

  useEffect(() => {
    setMetaContext(getMetaClientContext());
  }, []);

  useEffect(() => {
    const event = state.trackingEvent;
    if (!state.success || !event) return;
    if (firedEventIdRef.current === event.eventId) return;
    firedEventIdRef.current = event.eventId;

    const payload = {
      eventId: event.eventId,
      contentId: event.contentId,
      contentName: event.contentName,
      contentCategory: event.contentCategory,
      value: event.value,
      currency: event.currency,
      customData: {
        lead_source: event.leadSource,
      },
    };

    if (event.eventName === "Lead") {
      trackMetaLead(payload);
      trackGaGenerateLead({
        value: event.value,
        currency: event.currency,
        leadSource: event.leadSource,
        content_id: event.contentId,
        content_name: event.contentName,
      });
      trackGaEvent("property_lead_submit", {
        value: event.value,
        currency: event.currency,
        content_id: event.contentId,
        content_name: event.contentName,
      });
      return;
    }

    trackMetaContact(payload);
    trackGaEvent("contact_form_submit", {
      value: event.value,
      currency: event.currency,
      content_id: event.contentId,
      content_name: event.contentName,
    });
  }, [state.success, state.trackingEvent]);

  if (state.success) {
    return (
      <div
        className="rounded-xl bg-[var(--color-gold-50)] border border-[var(--color-gold-200)] px-5 py-6 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-8 w-8 text-[var(--color-gold-700)] mx-auto" aria-hidden />
        <p className="mt-3 font-display text-xl text-[var(--color-navy-900)]">Message envoyé</p>
        <p className="mt-1 text-sm text-[var(--color-stone-700)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={() => setMetaContext(getMetaClientContext())}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />
      <input type="hidden" name="metaEventId" value={eventIdRef.current} />
      <input type="hidden" name="metaEventSourceUrl" value={metaContext.eventSourceUrl} />
      <input type="hidden" name="metaFbp" value={metaContext.fbp ?? ""} />
      <input type="hidden" name="metaFbc" value={metaContext.fbc ?? ""} />
      <input type="hidden" name="analyticsConsent" value={privacyConsent ?? ""} />
      <Field
        name="name"
        label="Nom complet *"
        required
        autoComplete="name"
        error={state.fieldErrors?.name}
      />
      <Field
        name="email"
        type="email"
        label="Email *"
        required
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <Field
        name="phone"
        type="tel"
        label="Téléphone"
        autoComplete="tel"
        error={state.fieldErrors?.phone}
      />
      <Field
        name="subject"
        label="Sujet"
        as="select"
        options={[
          "Demande d'information",
          "Demande d'informations",
          "Visite d'un bien",
          "Autre",
        ]}
        error={state.fieldErrors?.subject}
      />

      <div className="sm:col-span-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-[var(--color-navy-900)] mb-1.5"
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          placeholder="Parlez-nous de votre projet…"
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined}
          className="w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-3 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
        />
        {state.fieldErrors?.message ? (
          <p id="contact-message-error" className="mt-1 text-xs text-red-700" role="alert">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      {state.error && !state.fieldErrors ? (
        <p className="sm:col-span-2 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary disabled:opacity-60"
          aria-busy={pending}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {pending ? "Envoi…" : "Envoyer le message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  error,
  as,
  options,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  as?: "input" | "select";
  options?: string[];
}) {
  const cls =
    "w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30";
  const errId = error ? `${name}-error` : undefined;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-navy-900)] mb-1.5">
        {label}
      </label>
      {as === "select" ? (
        <select
          id={name}
          name={name}
          className={cls}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
        >
          {options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
        />
      )}
      {error ? (
        <p id={errId} className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
