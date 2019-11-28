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
// ??κ°?? GET
router.get('/register', function(req, res, next) {
    res.render('register', { bool: true });
});
// ??κ°?? POST
router.post('/register', async function(req, res, next) {
    let body = req.body;

    if (body.password !== body.confirm_password)
        res.render('register', { bool: false });

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
// dbΏ‘ ΐϊΐε 
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
// λ‘κ·Έ?Έ GET
router.get('/login', function(req, res, next) {
    if (!req.session.name)
        res.render('login', { bool: true });
    else
        res.redirect('homepage');
});
// λ‘κ·Έ?Έ POST
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
// GET λ°©μ?Όλ‘? / κ²½λ‘? ? ??λ©? ?€? ?¨
router.get('/', function(req, res) {
    fs.readFile('index.html', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            // html??Ό?΄?Ό? κ²μ ?? €?Ό?κΈ? ?λ¬Έμ ?€?? ?΄?Ή ?΄?©? ??±?΄? λ³΄λ΄μ€?
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            // ?€?λ₯? ??±??Όλ©? ?΄?  html ?°?΄?°λ₯? λ³΄λ΄μ€?
            res.write(data);

            // λͺ¨λ λ³΄λ?Όλ©? ?λ£λ?? ?λ¦?
            // λ°λ? ?΄μ€μΌ?¨
            res.end(data);
        }
    });
});

//  λ‘κ·Έ??
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('welcome');
    });
});
router.get('/home', function(req, res, next) {
    res.render("home", { name: req.session.name })
})
module.exports = router;