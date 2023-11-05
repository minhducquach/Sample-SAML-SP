const config = {
    saml: {
        cert: './saml-config/saml.pem',
        entryPoint: 'https://dev-23553918.okta.com/app/dev-23553918_demosaml2_1/exkd41vtequWECwBC5d7/sso/saml',
        issuer: 'http://localhost:3001',
        options: {
            failureRedirect: '/home',
            failureFlash: true
        }
    },
    server: {
        port: 3001
    },
    session: {
        resave: false,
        secret: 'computerandnetworksecurityassignment',
        saveUninitialized: true
    }
};

module.exports = config;