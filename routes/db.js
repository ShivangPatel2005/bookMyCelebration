var mysql = require('mysql');
var mysql2 = require('mysql2');
var nodemailer = require('nodemailer');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookmycelebration',
    port: '3308'
}).promise();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //lavamwbdgvqvemup
        user: 'smart20072020@gmail.com',
        pass: 'lavamwbdgvqvemup'
    }
});

async function isFound(emailCA) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    const [result] = await connection.query(`select * from master where email="${emailCA}"`);
    if (result.length != 0) {
        num = 0;
    }
    return num;
}

function sendEMail(mailAddress, subject, arghtml) {
    var mailOptions = {
        from: 'smart20072020@gmail.com',
        to: `${mailAddress}`,
        subject: `${subject}`,
        html: `${arghtml}`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) throw error;
        return;
    });
}

async function update({ firstNamePF, lastNamePF, emailPF, addressPF, phnoPF, passwordPF }, emailUpdate) {
    await connection.query(`update master SET firstname = "${firstNamePF}", lastname = "${lastNamePF}", email = "${emailPF}", Address = "${addressPF}", contactno = "${phnoPF}", password = "${passwordPF}" WHERE  email = "${emailUpdate}"`);
    const data = {
        emailLogin: emailPF,
        passwordLogin: passwordPF
    }
    const [result] = await isLogin(data);
    return result;
}

function CreateAccount({ firstNameCA, lastNameCA, phNumberCA, emailCA, passwordCA }) {
    connection.query(`insert into master (firstname, lastname, contactno, email, password, utype) values("${firstNameCA}", "${lastNameCA}", "${phNumberCA}", "${emailCA}", "${passwordCA}", "0")`);
    return;
}

async function isLogin({ emailLogin, passwordLogin }) {
    const [result] = await connection.query(`select * from master where email="${emailLogin}" AND password="${passwordLogin}"`)
    return result;
}

function OTPMessage(firstname, number) {
    const message = `
    <head>
        <link rel="stylesheet" href="CSS/stylemail.css">
    </head>
    <table id="m_8636265828324098607udemy-email" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9fa;padding:24px">
        <tbody><tr>
            <td>&nbsp;</td>
            <td width="600">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff">
                        <tbody><tr>
                            <td style="border-bottom:1px solid #cccccc;padding:24px">
                                <h2>bookMyCelebration</h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 15px 24px 0 24px">
                                <p><a style="text-decoration:none;color:#1c1d1f">
                                    Hi ${firstname}
                                </a></p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f"><b></b></a><b><a style="text-decoration:none;color:#1c1d1f">Creating a new account</a></b>
                                </p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f">Your 4-Digit verification code is <b style="font-size: 16px; margin-top: 4px; margin-left: 4px;">${number}</b></a>
                                </p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f">This code was sent to you to verify your new account. </a>
                                </p>
                                <p style="margin-bottom:0">
                                    <a style="text-decoration:none;color:#1c1d1f">If you didn't request a code then ignore it.</a>
                                </p>   
                            </td>
                        </tr>
                    <tr>
                        <td style="padding:24px 0 0 0"></td>
                    </tr>
                </tbody></table>
            </td>
            <td>&nbsp;</td>
        </tr>
    </tbody></table>`;
    return message;
}

function addCollabrators({ emailCollab, priceCollab, locationCollab, contactCollab, serviceInfoCollab }, serviceType) {
    connection.query(`insert into collabrator(emailid, serviceprice, location, contactno, serviceinfo, servicetype) values("${emailCollab}", "${priceCollab}", "${locationCollab}", "${contactCollab}", "${serviceInfoCollab}", "${serviceType}")`)
    return;
}

function addVenue({ venueEmail, venueName, venueLocation, venueContact, venueServiceInfo }) {
    connection.query(`insert into venue(userId, venueEmail, venueName, venueLocation, venueContact, venueService) values("9", "${venueEmail}", "${venueName}", "${venueLocation}", "${venueContact}", "${venueServiceInfo}")`);
    return;
}

async function loadVenueData() {
    venueList = await connection.query(`select * from venue`);
    return venueList;
}

function addEvents({ email, name, venue, fromDate, toDate }, etype, userid) {
    connection.query(`insert into events(userId, email, fullname, venueId, fromDate, toDate, eventType) VALUES("${userid}", "${email}", "${name}", "${venue}", "${fromDate}", "${toDate}", "${etype}")`);
    return;
}

async function loadUpcomingEventData() {
    result = await connection.query(`select * from events`);
    return result;
}

module.exports = { isFound, CreateAccount, isLogin, sendEMail, update, OTPMessage, addCollabrators, addVenue, loadVenueData, addEvents, loadUpcomingEventData };