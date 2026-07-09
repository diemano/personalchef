'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function MarketingScripts() {
  const [ids, setIds] = useState<{
    pixelId?: string;
    gtmId?: string;
    ga4Id?: string;
  }>({});

  useEffect(() => {
    fetch('/api/chefdesk/options')
      .then((res) => res.json())
      .then((data) => {
        const option = Array.isArray(data) ? data[0] : data;
        if (option) {
          setIds({
            pixelId: option.facebookPixelId,
            gtmId: option.googleTagManagerId,
            ga4Id: option.googleAnalyticsId,
          });
        }
      })
      .catch((err) => console.error('Failed to load marketing scripts:', err));
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      {ids.ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ids.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ids.ga4Id}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {ids.gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm/js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${ids.gtmId}');
          `}
        </Script>
      )}

      {/* Facebook Pixel */}
      {ids.pixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${ids.pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
