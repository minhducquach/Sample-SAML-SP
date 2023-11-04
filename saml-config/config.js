const config = {
    saml: {
        cert: './saml-config/saml.pem',
        entryPoint: 'https://dev-23553918.okta.com/app/dev-23553918_demosaml_1/exkbnup3osMjYeXZu5d7/sso/saml',
        issuer: 'http://localhost:3000',
        options: {
            failureRedirect: '/home',
            failureFlash: true
        }
    },
    server: {
        port: 3000
    },
    session: {
        resave: false,
        secret: 'computerandnetworksecurityassignment',
        saveUninitialized: true
    }
};

module.exports = config;