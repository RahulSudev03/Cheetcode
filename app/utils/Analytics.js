import Script from "next/script";

const Analytics = () => {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  if (!googleAnalyticsId) {
    console.error('Google Analytics ID is missing. Please add NEXT_PUBLIC_GOOGLE_ANALYTICS to your environment variables.');
    return null; 
  }

  return (
    <>
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleAnalyticsId}');
        `}
      </Script>
    </>
  );
};

export default Analytics;
