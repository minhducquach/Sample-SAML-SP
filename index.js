const express = require('express')
const bodyParser = require("body-parser");
const auth = require("./saml-config/passport")
const config = require("./saml-config/config")
const session = require('express-session')
var saml = require('saml20');

const app = express()
const port = 3000

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
let redirect = ''

app.get('/login', auth.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('/homepage');
})

app.post('/login/success', auth.authenticate('saml', config.saml.options), (req, res, next) => {

    var options = {
        publicKey: `MIIDqDCCApCgAwIBAgIGAYrr7ImhMA0GCSqGSIb3DQEBCwUAMIGUMQswCQYDVQQGEwJVUzETMBEG
        A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
        MBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi0yMzU1MzkxODEcMBoGCSqGSIb3DQEJ
        ARYNaW5mb0Bva3RhLmNvbTAeFw0yMzEwMDExNTQ2NDJaFw0zMzEwMDExNTQ3NDFaMIGUMQswCQYD
        VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsG
        A1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi0yMzU1MzkxODEc
        MBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
        ggEBAIkkLlGWkz/3nFccF9NwMXvMMtvlxn31r3Rt/Npnrt9zyn7W1qj3tXC98//roIctzgnpCz1Y
        bnCNwjGJTUuuSKRDiNohDZ0mR82RTAIOZR71yDUb84ej0RNWV3M1ydshVLH1yJYCQAO1v6jSHI59
        jewAE6DWumI5XC9JgnB2fdRJtflSG+ZnhaxXA1YlB+0hUdpb6nDPWOB0t9MXMcJh2g0KrDp/Qg1A
        Olwy0Zk4SkYyBB3pMyPzEmqDqI9iMBBSClmY4zZ1SYdX36hVTuhw8VPXQh9tAKc4ONEc5ycoSFzU
        CMwaplSrsMDtMiGbJuhLD/Wr9c5m0VzTdk6v9CGP8BcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEA
        Z9SunooQknoRuSCBZJb8lvGQlzMTztx5uwJjq7Ihj7D088lMsf/0ElB8Q/OhS+wa8kkwRlnNTyo6
        Jx+d/24ns3bHf+o1ydjQJJ6Jqyk5fECauzdWsgqzxkkHusN2m1eud0i4KHJOtMUTnOkgMUiWPoi+
        ESB3H2cU6Ohw4SkkJ7RzpEjRcnAn0XgBzXmN5uuRuZjrnkiyltYMMbr3apk8J4OYF+CAa04Q6kD7
        +XKoHSzCisJYV8H6YOmCietU9saMXwgA4/vaTvkjo9dNwHQqSMQNGr9E31cVDXfFjldOpc4W7N8z
        XPLTk5AMIt/NRRZWxtL6BGQD9/vhdjyQHnGfcw==`,
        audience: 'http://localhost:3000'
    }
    
    const rawAssertion = req.user.getAssertionXml()
    saml.validate(rawAssertion, options, function(err, profile) {
        // err
        if(profile){

            return res.redirect('/homepage');
        }
        // var claims = profile.claims; // Array of user attributes;
        // var issuer = profile.issuer; // String Issuer name.
    });

    
})

app.get('/homepage', auth.protected, (req, res) => {
    const data = req.user.nameID
    res.cookie('email',data)
    res.cookie('isAuthen','TRUE')
    return res.redirect(`${redirect}`);
});

app.get('/', (req, res) => {
    const {redirectURL} = req.query
    redirect  =  redirectURL 
    if (req.isAuthenticated()) {
        res.redirect('/homepage')
    }
    else res.redirect(`/login`)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})