"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { usePrivacyConsent } from "@/lib/privacy-consent";

export default function MetaPixelBootstrapClient({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const consent = usePrivacyConsent();
  if (consent !== "accepted" || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Script id="meta-pixel-bootstrap" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq.disablePushState = true;
fbq('set', 'autoConfig', false, ${JSON.stringify(pixelId)});
fbq('init', ${JSON.stringify(pixelId)});
        `}
      </Script>
    </>
  );
}
