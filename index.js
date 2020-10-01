const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./utils/bcrypt");
const db = require("./utils/db.js");
// const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const conf = require("./config.json");
const server = require("http").Server(app); //returns a native node object server, because socket io requires a native node server to handle the "handshake", cant use an express app
const io = require("socket.io")(server, { origins: "localhost:8080" }); //this is an interface to socket io on the interface, we pass the native node server to the function, "origins": space seperated list of hosts or "origins" that we can accept websocket connections from. so the socket req will have a header of this origin, if it doesnt match it, socket io will refuse it. Prevents csrf attacks. to deploy, you will have to add the url of your site on herokuapp.com:*  and :* to accept all ports

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//////END MULTER BOILERPLATE /////////

//////////////////////////// MIDDLEWARE ////////////////////////////
app.use(express.static("./public"));
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: `secret`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);

//this lets us access the sockets connnections id thru the session cookie
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// app.use(csurf());

// app.use(function(req, res, next) {
//     res.cookie("zorglub", req.csrfToken());
//     next();
// });

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

/////////////////////////////////////////////////////////////////////////// LOGED IN ROUTES ///////////////////////////////////////////////////////////////////////////

//get to homepage
app.get("/first", async (req, res) => {
    const email = req.session.user.email;
    console.log("req.session", req.session);
    try {
        const userData = await db.getUser(email);
        res.json(userData.rows[0]);
    } catch (e) {
        console.log("err in get /");
    }
});

//post logout
app.get("/logout", async (req, res) => {
    try {
        req.session = null;
        console.log("req.session", req.session);
        res.redirect("/welcome#");
    } catch (e) {
        console.log("err in get /");
    }
});

/////////////////////////////////////// SELF PROFILE ////////////////////////////////////////

//post a new profile pic
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let imageUrl = conf.s3Url + req.file.filename;
    let email = req.session.user.email;
    let userId = req.session.user.userId;

    db.recordImage(imageUrl, userId)
        .then((result) => {})
        .catch((err) => {
            console.log("err in set image", err);
            res.sendStatus(500);
        });

    db.setImage(imageUrl, email)
        .then((result) => {
            res.json({ url: result.rows[0].url, success: true });
        })
        .catch((err) => {
            console.log("err in set image", err);
            res.sendStatus(500);
        });
});

//check if a bio is saved in db
app.get("/bio", async (req, res) => {
    const email = req.session.user.email;

    try {
        const result = await db.getUser(email);
        res.json([result.rows[0].bio, { success: true }]);
    } catch (e) {
        res.json({ success: false });
        console.log("err in get /");
    }
});

//post a new bio
app.post("/bio", async (req, res) => {
    let bio = req.body.currentBio;
    let email = req.session.user.email;

    try {
        const result = await db.saveBio(email, bio);
        res.json([result.rows[0].bio, { success: true }]);
    } catch (e) {
        console.log("err in post /bio");
    }
});

//////////////////////////////////// OTHERS PROFILES //////////////////////////////////////

//get others and not see myself as others see me :)
app.get("/user/:id.json", async (req, res) => {
    const logedInUserId = req.session.user.userId;

    try {
        if (req.params.id != logedInUserId) {
            const other = await db.getUserById(req.params.id);
            const friends = await db.getFriends(logedInUserId);
            res.json([other.rows[0], friends]);

            console.log("other.rows[0]", other.rows[0]);
            console.log("friends", friends);
        } else {
            res.json({ redirect: true });
        }
    } catch (e) {
        res.sendStatus(500);
        console.log("err in get /user/:id");
    }
});

//Find newbies
app.get("/users/new", async (req, res) => {
    try {
        const result = await db.getNewbies();
        res.json(result.rows);
    } catch (e) {
        res.sendStatus(500);
        console.log("err in get /users/new");
    }
});

//Search for users in search field
app.get("/users/query/", async (req, res) => {
    console.log("req.query in users/query", req.query.q);

    try {
        const result = await db.searchUsers(req.query.q);
        res.json(result.rows);
        console.log("resultin get users by search", result.rows);
    } catch (e) {
        res.sendStatus(500);
        console.log("err in get /users/name");
    }
});

////// FRIEND BUTTON //////

//check friendship status for friendButton
app.get("/friendship/status/:otherId.json", async (req, res) => {
    const myId = req.session.user.userId;
    const otherId = req.params.otherId;

    try {
        const result = await db.checkFriendship(myId, otherId);
        res.status(200).json(result.rows);
        console.log("result", result);
    } catch (e) {
        res.json({ success: false });
        console.log("no friendship :(");
    }
});

//make friendship request
app.post("/friendship/request/:otherId.json", async (req, res) => {
    const myId = req.session.user.userId;
    const otherId = req.params.otherId;
    try {
        const result = await db.makeFriendsRequest(myId, otherId);
        res.status(200).json(result.rows);
    } catch (e) {
        res.json({ success: false });
        console.log("no friendship :(");
    }
});

//cancel friendship request

app.post("/friendship/cancel/:otherId.json", async (req, res) => {
    const myId = req.session.user.userId;
    console.log("myId", myId);

    const otherId = req.params.otherId;
    console.log("otherId", otherId);
    try {
        const result = await db.cancelFriendsRequest(myId, otherId);
        res.status(200).json(result.rows);
    } catch (e) {
        res.json({ success: false });
        console.log("no friendship :(");
    }
});

//accept friendship request
app.post("/friendship/accept/:otherId.json", async (req, res) => {
    const myId = req.session.user.userId;
    console.log("myId in accept", myId);

    const otherId = req.params.otherId;
    console.log("otherId in accept", otherId);
    try {
        const result = await db.acceptFriendsRequest(myId, otherId);
        res.status(200).json(result.rows);
    } catch (e) {
        res.json({ success: false });
        console.log("no friendship :(");
    }
});

////////////////////////////////// FRIENDS //////////////////////////////////
app.get("/friends.json", async (req, res) => {
    const myId = req.session.user.userId;
    console.log("myId", myId);

    try {
        const result = await db.getFriends(myId);
        res.json(result.rows);
        console.log("result of friends", result);
    } catch (e) {
        console.log(e, "err in get friends index :(");
    }
});

/////////////////////////////////////////////////////////// LOGED OUT USER ROUTES //////////////////////////////////////////////////////////////////////////////////

app.get("/welcome", function (req, res) {
    // console.log("csrfSecret: ", req.session.csrfSecret);
    if (!req.session.user) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//post to register
app.post("/register", function (req, res) {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;
    console.log("req.body", req.body);

    hash(password)
        .then((hashedPw) => {
            //saving users data to users table in petition db
            db.addUser(first, last, email, hashedPw)
                .then((data) => {
                    req.session.user = {};
                    req.session.user.email = data.rows[0].email;
                    req.session.user.userId = data.rows[0].id; // AUFPASSEN I changed to camel case here!!!
                    req.session.user.first = data.rows[0].first;
                    req.session.user.last = data.rows[0].last;
                    res.json({ success: true });
                })
                .catch((e) => {
                    //catch on db.addUser
                    console.log("error in Post register in addUser", e);
                    res.json({ success: false });
                });
        })
        .catch((e) => {
            //catch on hash
            console.log("error in Post register in hash", e);
            res.json({ success: false });
        });
});

//post to login
app.post("/login", (req, res) => {
    console.log("made it into login route");

    //comparing hashed PW from database to input and saving user's id into the session
    db.getUser(req.body.email).then((data) => {
        compare(req.body.password, data.rows[0].password)
            .then((boolean) => {
                if (boolean) {
                    req.session.user = {};
                    req.session.user.email = req.body.email;
                    req.session.user.userId = data.rows[0].id;
                    console.log(req.session.user.userId);
                    res.json({ success: true });
                } else {
                    console.log("this is not a match");
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("err in login", err);
            });
    });
});

////// PASSWORD RESET ///////

//post to the first state of password cpnt: check on email, create, store and send code
app.post("/password/reset/start", (req, res) => {
    const email = req.body.email;
    //verify user
    db.getUser(email)
        .then((data) => {
            // create the code
            const secretCode = cryptoRandomString({
                length: 6,
            });

            //store it
            db.storeCode(secretCode, email)
                .then((data) => {})
                .catch((err) => {
                    console.log("err in reset/start", err);
                });

            //send it in an email
            ses.sendEmail(
                "lea.colson@gmail.com",
                "Social damm media here!",
                secretCode
            )
                .then(() => {
                    // everything worked!
                })

                .catch((err) => {
                    // something went wrong
                    console.log("secret code went wrong,", err);
                });

            //sending success response to browser
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("err in reset/start", err);
        });
});

//post to the first state of password cpnt: check on email, create, store and send code
app.post("/password/reset/reset", (req, res) => {
    const email = req.body.email;
    const code = req.body.code;
    const newPw = req.body.newPw;

    //verify user's code
    db.findCode(code, email)
        .then((data) => {
            if (code == data.rows[0].code) {
                //if the input code is the same as the code in db, hash pw and replace it in db
                hash(newPw)
                    .then((hashednewPw) => {
                        db.replacePw(hashednewPw, email)
                            .then((data) => {})
                            .catch((err) => {
                                console.log("err in replace pw", err);
                            });
                    })
                    .catch((err) => {
                        console.log("err in hash New pw", err);
                    });
            }
        })
        .catch((err) => {
            console.log("err in find code", err);
        });

    res.json({ success: true });
});

// post to delete to reset session cookie and redirect user
app.post("/delete", async (req, res) => {
    try {
        req.session = null;
        console.log("req.session in post delete", req.session);
        res.json({ sucess: true });
    } catch (e) {
        console.log("err in delete", e);
    }
});

//now the native node http server is handling the socket handshakes, which express cant do
server.listen(8080, function () {
    //server will send all the non-websocket requests to app
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.user) {
        return socket.disconnect(true);
    }

    db.getTenMessages()
        .then((data) => {
            socket.emit("receiveMessages", data.rows);
        })
        .catch((e) => {
            console.log("err in get 10 messages", e);
        });

    const userId = socket.request.session.user.userId;

    socket.on("postedMsg", async (newMsg) => {
        //db query to store new message in table
        try {
            const data = await db.postMessage(newMsg, userId);
            const result = await db.getMessage(userId);
            await io.emit("addMsg", result.rows);
        } catch (e) {
            console.log("err in post message", e);
        }
    });

    //WALL

    db.getTenWallMessages()
        .then((data) => {
            socket.emit("receiveWallMessages", data.rows);
        })
        .catch((e) => {
            console.log("err in get 10 messages", e);
        });

    //posting a message on a friends wall or own wall

    socket.on("postedWallMsg", async (newMsg) => {
        //db query to store new message in table
        try {
            const data = await db.postWallMessage(newMsg, userId);
            const result = await db.getWallMessage(userId);
            await io.emit("addWallMsg", result.rows);
        } catch (e) {
            console.log("err in post wall message", e);
        }
    });

    socket.on("deleteAccount", async (id) => {
        //db query to store new message in table
        try {
            const deletedFriendships = await db.deleteUserFriendships(id);
            const deletedMessages = await db.deleteUserMessages(id);
            const deletedUser = await db.deleteUserData(id);

            const pictures = await db.getPicturesById(id);
            const pixArray = pictures.rows;

            for (let i = 0; i < pixArray.length; i++) {
                let item = pixArray[i].url;
                s3.delete(item.split("/").pop());
            }

            // delete urls from the profile pics table
            const deletedUrls = await db.deleteImages(id);
            console.log(deletedUrls);
        } catch (e) {
            console.log("err in delete account", e);
        }
    }); //closes deletaaccount
}); //closes io.on
