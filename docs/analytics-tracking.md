# GA4, Meta Pixel, and Conversions API

This app implements GA4, Meta Pixel, and Meta Conversions API as paired
browser/server tracking.

## Environment

Set these variables in production:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GA_DISABLED=false

NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_GRAPH_API_VERSION=v25.0
META_TEST_EVENT_CODE=
NEXT_PUBLIC_META_TRACKING_DISABLED=false
META_TRACKING_DISABLED=false
NEXT_PUBLIC_APP_URL=https://www.ibm-immobiliere.tn
```

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` enables GA4.
- `NEXT_PUBLIC_GA_DISABLED=true` disables GA4 without removing the ID.
- `NEXT_PUBLIC_META_PIXEL_ID` enables browser Pixel.
- `META_PIXEL_ID` is an optional server-side Pixel ID override.
- `META_ACCESS_TOKEN` enables server CAPI.
- `META_GRAPH_API_VERSION` defaults to `v25.0`.
- `META_TEST_EVENT_CODE` sends server events into Meta Events Manager Test Events.
- `NEXT_PUBLIC_META_TRACKING_DISABLED` disables browser Meta tracking.
- `META_TRACKING_DISABLED` disables server CAPI.
- `NEXT_PUBLIC_APP_URL` validates `event_source_url`.

## Event Mapping

- Public route changes: Meta `PageView` through Pixel plus CAPI.
- Property, project, and blog detail pages: GA4 `view_item`; Meta `ViewContent` through Pixel plus CAPI.
- Property searches: GA4 `search`; Meta `Search` through Pixel plus CAPI.
- Property lead form success: GA4 `generate_lead` and `property_lead_submit`; Meta `Lead` through CAPI and Pixel with the same `event_id`.
- General contact form success: GA4 `contact_form_submit`; Meta `Contact` through CAPI and Pixel with the same `event_id`.
- WhatsApp, phone, and email clicks: GA4 `whatsapp_click`, `phone_click`, `email_click`; Meta `Contact` through Pixel plus CAPI.

For form submissions, a browser-generated `event_id` is submitted with the form,
used by the server CAPI request, returned to the browser, then reused by the
Pixel event. This lets Meta deduplicate the browser and server copies.

## GA4 Key Events

Mark these GA4 events as key events in Admin > Data display > Events:

- `generate_lead`
- `property_lead_submit`
- `contact_form_submit`
- `whatsapp_click`
- `phone_click`
- `email_click`
- `search`
- `view_item`

For campaign optimization, prioritize `generate_lead`, `property_lead_submit`,
`contact_form_submit`, and `whatsapp_click`.

## Diagnostics

The admin page at `/admin/meta` shows:

- GA4, Pixel, CAPI, Graph API, and Test Events configuration status.
- Kill-switch status.
- Recent high-value CAPI attempts for `Lead` and `Contact`.

Only `Lead` and `Contact` attempts are persisted. Page views, content views, and
search events are relayed but not stored as diagnostics.

## References

- Next.js third-party libraries: https://nextjs.org/docs/app/guides/third-party-libraries
- GA4 key events: https://support.google.com/analytics/answer/9267568
- GA4 recommended events: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- Meta Node SDK: https://github.com/facebook/facebook-nodejs-business-sdk
