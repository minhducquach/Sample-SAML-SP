const express = require('express')
const bodyParser = require("body-parser");
const auth = require("./saml-config/passport")
const config = require("./saml-config/config")
const session = require('express-session')

const app = express()
const port = 2000

app.use(express.json());
app.use(session(config.session));
app.use(auth.initialize());
app.use(auth.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
});


app.get('/login', auth.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('/homepage');
})

app.post('/login/callback', auth.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('/homepage');
})

app.get('/homepage', auth.protected, (req, res) => {
    res.sendfile('index.html')
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/homepage')
    }
    else res.redirect('login')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})