var express = require('express');
var crypto = require('crypto');
var session = require('express-session');
var router = express.Router();
const models = require("../models");
const Swal = require('sweetalert2');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!req.session.name)
        return res.redirect('users/login');
    else
        res.redirect('users/homepage');
    // res.send('welcome partition!');
});
// ?šŒ?›ê°??… GET
router.get('/register', function(req, res, next) {
    res.render('register', { bool: true });
});
// ?šŒ?›ê°??… POST
router.post('/register', async function(req, res, next) {
    let body = req.body;

    if (body.password !== body.confirm_password)
        res.render('register', { bool: false });

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
// db¿¡ ÀúÀå 
    let result = models.users.create({
            name: body.username,
            email: body.email,
            password: hashPassword,
            salt: salt
        })
        .then(result => {
            console.log(result);
            res.redirect('login');
        })
        .catch(err => {
            res.send()
            console.log(err)
        });
        // db
});
// ë¡œê·¸?¸ GET
router.get('/login', function(req, res, next) {
    if (!req.session.name)
        res.render('login', { bool: true });
    else
        res.redirect('homepage');
});
// ë¡œê·¸?¸ POST
router.post('/login', async function(req, res, next) {
    let body = req.body;

    let result = await models.users.findOne({
        where: { name: body.username }
    })
    // db
    if (result == null) {
        return res.render("login", { bool_username: false })
    }
    let dbPassword = result.dataValues.password;
    let inputPassword = body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if (dbPassword === hashPassword) {
        console.log("login succeeded");
        // session
        req.session.name = body.username;
        req.session.save(function() {
            return res.redirect('welcome');
        });
    } else {
        console.log("login failed");
        return res.render("login", { bool: false })
    }
    // db
});
// welcome
router.get('/welcome', function(req, res, next) {
    if (!req.session.name)
        res.redirect('login');
    else
        res.render('homepage', { name: req.session.name });
});
// GET ë°©ì‹?œ¼ë¡? / ê²½ë¡œ?— ? ‘?†?•˜ë©? ?‹¤?–‰ ?¨
router.get('/', function(req, res) {
    fs.readFile('index.html', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            // html?ŒŒ?¼?´?¼?Š” ê²ƒì„ ?•Œ? ¤?•¼?•˜ê¸? ?•Œë¬¸ì— ?—¤?”?— ?•´?‹¹ ?‚´?š©?„ ?‘?„±?•´?„œ ë³´ë‚´ì¤?
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            // ?—¤?”ë¥? ?‘?„±?–ˆ?œ¼ë©? ?´? œ html ?°?´?„°ë¥? ë³´ë‚´ì¤?
            res.write(data);

            // ëª¨ë‘ ë³´ëƒˆ?œ¼ë©? ?™„ë£Œë?Œ?„ ?•Œë¦?
            // ë°˜ë“œ?‹œ ?•´ì¤˜ì•¼?•¨
            res.end(data);
        }
    });
});

//  ë¡œê·¸?•„?›ƒ
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('welcome');
    });
});
router.get('/home', function(req, res, next) {
    res.render("home", { name: req.session.name })
})
module.exports = router;