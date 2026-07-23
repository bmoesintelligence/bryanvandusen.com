module.exports = {
    name: "Bryan Van Dusen",
    // Shown on the Contact section and in the Person schema. Needs a mailbox or
    // forwarder on the domain once DNS is pointed, or contact mail bounces.
    email: "hello@bryanvandusen.com",
    socials: {
        instagram: "https://www.instagram.com/bryanvandusen",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    //! TODO: update once the custom domain is pointed at Netlify (this drives the
    //! canonical tag, og:url and the sitemap URL in robots.txt)
    domain: "https://www.bryanvandusen.com",
    // Google Search Console "HTML tag" verification token (the content="..." value
    // Google shows you). Renders a <meta name="google-site-verification"> in the head
    // only when set; leave empty to omit the tag entirely.
    googleSiteVerification: "K8natDxJkGOI77BhBmAQm2RLCmeM4lBs0AHgXs5jvho",
    // Google Analytics 4 Measurement ID (e.g. "G-XXXXXXXXXX"). Loads the gtag.js
    // snippet in the head, but ONLY in production builds and ONLY when set — so local
    // `npm start` dev traffic is never counted. Leave empty to omit analytics entirely.
    googleAnalyticsId: "G-H8HVK38TYQ",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
