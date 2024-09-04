import Script from "next/script";

const Analytics = () => {
    return (
        <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></script>
            <script>
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});`}
            </script>

        </>
    );
};

export default Analytics;