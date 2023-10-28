const bodyParser = require('body-parser');
const express = require('express');
const Window = require('window');
const DB = require(__dirname + "/routes/db.js");
port = 3000;

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views/CSS"));
app.use(express.static("views/templates"));

//global variables
let verificationNum = 0;
let createAccountData;
let logedInUserData;
let LoginData;
let venueList;
let upcomingEventList;
let flag = 0;

//Routes for rendaring the file
app.get('/', function(req, res) {
    res.render("templates/home");
});

app.get('/upcomingevent', async function(req, res) {
    upcomingEventList = await DB.loadUpcomingEventData();
    upcomingEventList = upcomingEventList[0];
    venueList = await DB.loadVenueData();
    venueList = venueList[0];
    try {
        res.render("templates/upcoming", { log: logedInUserData[0], eData: upcomingEventList, venues: venueList });
    } catch (error) {
        res.render("templates/Login", { flag: 0 });
    }
});

app.get('/addevent', async function(req, res) {
    venueList = await DB.loadVenueData();
    venueList = venueList[0];
    try {
        res.render("templates/addevent", { log: logedInUserData[0] });
    } catch (error) {
        res.render("templates/Login", { flag: 0 });
    }
});

app.get('/collab', function(req, res) {
    try {
        res.render("templates/collab", { log: logedInUserData[0] });
    } catch (error) {
        res.render("templates/Login", { flag: 0 });
    }
});

app.get('/home', function(req, res) {
    res.render("templates/home");
});

app.get('/Login', function(req, res) {
    res.render("templates/Login", { flag: 0 });
});

app.post('/Login', async function(req, res) {
    LoginData = req.body;
    logedInUserData = await DB.isLogin(LoginData);
    if (logedInUserData.length != 0) {
        if (logedInUserData[0].password == LoginData.passwordLogin)
            res.render("templates/logedinhome", { log: logedInUserData[0] });
        else
            res.render("templates/login", { flag: 2 });
    } else {
        res.render("templates/login", { flag: 2 });
    }
});

app.get('/Createaccount', function(req, res) {
    res.render('templates/createaccount', { flag: 0 });
});

app.post('/Createaccount', async function(req, res) {
    createAccountData = req.body;
    if (createAccountData.passwordCA == createAccountData.passwordCAVerify) {
        try {
            verificationNum = await DB.isFound(createAccountData.emailCA);
            console.log(verificationNum);
        } catch (error) {
            console.log(error);
            console.log("Error found in retriving the data from database");
        }
        if (verificationNum == 0) {
            res.render("templates/createaccount", { flag: 2 });
        } else {
            const message = DB.OTPMessage(createAccountData.firstNameCA, verificationNum);
            try {
                await DB.sendEMail(createAccountData.emailCA, "Verify your self on bookMyCelebration...", message);
            } catch (error) {
                console.log("Error got in sending an email");
            }
            res.render("templates/OTPVer", { mail: createAccountData.emailCA });
        }
    } else {
        res.render("templates/createaccount", { flag: 1 });
    }
});

app.get('/OTPVer', function(req, res) {
    res.render("templates/OTPVer", { mail: createAccountData.emailCA });
});

app.post('/OTPVer', function(req, res) {
    if (verificationNum == req.body.OTPVerification) {
        DB.CreateAccount(createAccountData);
        res.render("templates/login", { flag: 1 });
    }
});

app.get('/logedinhome', function(req, res) {
    try {
        res.render('templates/logedinhome', { log: logedInUserData[0] })
    } catch (error) {
        res.render("templates/login", { flag: 0 });
    }
});

app.get('/forgot', function(req, res) {
    res.render('templates/forgot', { flag: 0 });
});

app.post('/forgot', function(req, res) {

});

app.get('/Profile', function(req, res) {
    try {
        res.render('templates/profile', { log: logedInUserData[0], flag: 0 });
    } catch (error) {
        res.render('templates/Login', { flag: 0 });
    }
});

app.post('/Profile', async function(req, res) {
    const data = req.body;
    isupdate = 0;
    try {
        if (data.firstNamePF != logedInUserData[0].firstname || data.lastNamePF != logedInUserData[0].lastname || data.addressPF != logedInUserData[0].Address || data.phnoPF != logedInUserData[0].contactno || data.emailPF != logedInUserData[0].email || data.passwordPF != logedInUserData[0].password) {
            logedInUserData[0] = await DB.update(data, logedInUserData[0].email);
            isupdate = 1;
        }
        res.render('templates/profile', { log: logedInUserData[0], flag: isupdate });
    } catch (error) {
        console.log(error);
        res.render('templates/Login', { flag: 0 })
    }
});

app.get('/Gallery', function(req, res) {
    const arg = req.query.i;
    if (arg == 0) {
        res.render('templates/ResGallery', { access: 0 })
    } else {
        try {
            res.render('templates/ResGallery', { log: logedInUserData[0], access: 1 })
        } catch (error) {
            res.render("templates/ResGallery", { access: 0 });
        }
    }
});

app.get('/about', function(req, res) {
    const arg = req.query.i;
    if (arg == 0) {
        res.render('templates/aboutus', { access: 0 });
    } else {
        try {
            res.render('templates/aboutus', { log: logedInUserData[0], access: 1 });
        } catch (error) {
            res.render('templates/Login', { flag: 0 });
        }
    }
});

app.get('/birthday', async function(req, res) {
    try {
        res.render('templates/Birthday', { log: logedInUserData[0], venues: venueList })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});
app.get('/corporate', function(req, res) {
    try {
        res.render('templates/corporate', { log: logedInUserData[0], venues: venueList })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});
app.get('/educational', function(req, res) {
    try {
        res.render('templates/educational', { log: logedInUserData[0], venues: venueList })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});
app.get('/socialevent', function(req, res) {
    try {
        res.render('templates/socialevent', { log: logedInUserData[0], venues: venueList })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.get('/collabForms', function(req, res) {
    const formType = req.query.i;
    try {
        res.render('templates/collabForms', { log: logedInUserData[0], fType: formType, result: 0 })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.post('/collabForms', function(req, res) {
    const formType = req.query.i;
    const data = req.body;
    try {
        DB.addCollabrators(data, formType);
        res.render('templates/collabForms', { log: logedInUserData[0], fType: formType, result: 1 })
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.get('/addVenue', function(req, res) {
    try {
        res.render('templates/addVenue', { log: logedInUserData[0], result: 0 });
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.post('/addVenue', function(req, res) {
    try {
        DB.addVenue(req.body);
        res.render('templates/addVenue', { log: logedInUserData[0], result: 1 });
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.post('/addEvent', async function(req, res) {
    upcomingEventList = await DB.loadUpcomingEventData();
    upcomingEventList = upcomingEventList[0];
    venueList = await DB.loadVenueData();
    venueList = venueList[0];
    try {
        console.log(req.body.fromDate)
        DB.addEvents(req.body, req.query.etype, logedInUserData[0].userId)
        res.render("templates/upcoming", { log: logedInUserData[0], eData: upcomingEventList, venues: venueList });
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
});

app.get('/allvenues', async function(req, res) {
    venueList = await DB.loadVenueData();
    venueList = venueList[0];
    try {
        res.render('templates/allvenues', { log: logedInUserData[0], venues: venueList });
    } catch (error) {
        res.render('templates/Login', { flag: 0 })
    }
})

// let server = app.listen(0, () => {
//     //console.log(`Server is running at http://localhost:${port}/`);
//     console.log(`Server is running at http://localhost:${server.address().port}`)
// })

//Activate website on specific port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})