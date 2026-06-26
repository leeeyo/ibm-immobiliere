"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
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

export default function PropertyLeadForm({
  propertyId,
  propertyRef,
}: {
  propertyId: string;
  propertyRef: string;
}) {
  const [state, action, pending] = useActionState(submitContactForm, initial);
  const eventIdRef = useRef<string>("");
  const firedEventIdRef = useRef<string | null>(null);
  const [metaContext, setMetaContext] = useState<MetaClientContext>({ eventSourceUrl: "" });
  const privacyConsent = usePrivacyConsent();

  if (!eventIdRef.current) {
    eventIdRef.current = createMetaEventId("property_lead");
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
      <div className="rounded-md bg-[var(--color-gold-500)]/15 border border-[var(--color-gold-500)]/30 px-4 py-4 text-sm text-[var(--color-gold-100)]">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} onSubmit={() => setMetaContext(getMetaClientContext())} className="space-y-3">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="propertyRef" value={propertyRef} />
      <input type="hidden" name="metaEventId" value={eventIdRef.current} />
      <input type="hidden" name="metaEventSourceUrl" value={metaContext.eventSourceUrl} />
      <input type="hidden" name="metaFbp" value={metaContext.fbp ?? ""} />
      <input type="hidden" name="metaFbc" value={metaContext.fbc ?? ""} />
      <input type="hidden" name="analyticsConsent" value={privacyConsent ?? ""} />
      <input
        type="hidden"
        name="subject"
        value={`Demande d'offre — ${propertyRef}`}
      />

      <Field
        name="name"
        placeholder="Nom complet"
        autoComplete="name"
        required
        error={state.fieldErrors?.name}
      />
      <Field
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />
      <Field
        name="phone"
        type="tel"
        placeholder="Téléphone (facultatif)"
        autoComplete="tel"
        error={state.fieldErrors?.phone}
      />
      <textarea
        name="message"
        rows={3}
        required
        placeholder="Votre message ou questions sur ce bien…"
        defaultValue={`Bonjour, je suis intéressé(e) par le bien "${propertyRef}". Pourriez-vous m'envoyer une offre de prix et plus d'informations ?`}
        className="w-full rounded-md border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
      />
      {state.fieldErrors?.message ? (
        <p className="text-xs text-red-300">{state.fieldErrors.message}</p>
      ) : null}

      {state.error && !state.fieldErrors ? (
        <p className="text-xs text-red-300">{state.error}</p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-gold w-full disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Envoi…" : "Demander une offre de prix"}
      </button>
    </form>
  );
}

function Field({
  name,
  placeholder,
  type = "text",
  autoComplete,
  required,
  error,
}: {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-gold-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
      />
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
