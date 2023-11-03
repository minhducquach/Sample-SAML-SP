const fs = require('fs');
const passport = require('passport');
const { Strategy } = require('passport-saml');
const config = require('./config');

const savedUsers = [];

passport.serializeUser((expressUser, done) => {
    done(null, expressUser);
});

passport.deserializeUser((expressUser, done) => {
    done(null, expressUser);
});

passport.use(
    new Strategy(
        {
            issuer: config.saml.issuer,
            protocol: 'http://',
            path: '/login/callback',
            entryPoint: config.saml.entryPoint,
            cert: fs.readFileSync(config.saml.cert, 'utf-8')
        },
        (expressUser, done) => {
            if (!savedUsers.includes(expressUser)) {
                savedUsers.push(expressUser);
            }

            return done(null, expressUser);
        }
    )
);

passport.protected = function protected(req, res, next) {
    console.log('Login Profile' + req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('Not Login' + req.isAuthenticated());
    res.redirect('/login');
};

module.exports = passport;