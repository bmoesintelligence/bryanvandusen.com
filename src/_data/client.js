module.exports = {
    name: "Bryan Van Dusen",
    // TODO: placeholder — swap in the real address before launch
    email: "vandusenbryan@gmail.com",
    socials: {
        instagram: "https://www.instagram.com/bryanvandusenauthor/",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    //! TODO: update once the custom domain is pointed at Netlify (this drives the
    //! canonical tag, og:url and the sitemap URL in robots.txt)
    domain: "https://www.bryanvandusen.com",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
