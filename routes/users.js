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
        res.redirect('users/welcome');
    // res.send('welcome partition!');
});
// ?��?���??�� GET
router.get('/register', function(req, res, next) {
    res.render('register', { bool: 0 });
});
// ?��?���??�� POST
router.post('/register', async function(req, res, next) {
    let body = req.body;
    let result1 = await models.users.findOne({
        where: {
            name: body.username
        }
    })
    let result2 = await models.users.findOne({
            where: {
                name: body.email
            }
        })
        // invalid id & email 
    if (result1 != null && result2 != null) {
        res.render('register', {
            bool: 1
        });
    } else if (result1 == null && result2 != null) { //// invalid  email 
        res.render('register', {
            bool: 2
        });
    } else if (result1 != null && result2 == null) { //// invalid  id 
        res.render('register', {
            bool: 3
        });
    } else if (body.password != body.confirm_password) { //// does not match
        res.render('register', {
            bool: 4
        });
    } else {
        let inputPassword = body.password;
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        // db�� ���� 
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
                res.render('register', {
                    bool : 5
                })
                console.log(err)
            });
    }
    // db
});
// 로그?�� GET
router.get('/login', function(req, res, next) {
    if (!req.session.name)
        res.render('login', { bool: 0 });
    else
        res.redirect('welcome');
});
// 로그?�� POST
router.post('/login', async function(req, res, next) {
    let body = req.body;

    let result = await models.users.findOne({
            where: {
                name: body.username
            }
        })
        // db
    if (result == null) {
        return res.render("login", {
            bool: 2
        })
    } else {
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
            return res.render("login", {
                bool: 1
            })
        }
    }

    // db
});

// welcome
router.get('/welcome', function(req, res, next) {
    if (!req.session.name)
        res.redirect('login');
    else
        res.render('homepage', {
            name: req.session.name
        });
});


//  로그?��?��
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('welcome');
    });
});
module.exports = router;