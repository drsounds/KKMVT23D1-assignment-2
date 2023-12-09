const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const cookieParser = require("cookie-parser");
var session = require('express-session')
const { login, registerUser, changePassword } = require('./users');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(
    session({
        genid: function(req) {
            return randomUUID() // use UUIDs for session IDs
        },
        secret: 'keyboard cat'
    })
)

app.get('/login', (req, res) => {
    const error = req.query.error
    res.render('login', { error })
})

app.post('/login', (req, res) => {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password
    try {
        const user = login(username, password)
        res.cookie("user", user)
        return res.redirect('/dashboard')
    } catch (e) {
        res.redirect('/login?error=invalid+username+or+password')
    }
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/dashboard/change-password', (req, res) => {
    const error = req.query.error
    console.log("error", error)

    if (!req.cookies["user"]) {
        return res.redirect("/login")
    }
    res.render('change-password', { error })
})

app.get('/dashboard/password-changed', (req, res) => {
    const error = req.query.error

    console.log("error", error)

    if (!req.cookies["user"]) {
        return res.redirect("/login")
    }
    return res.render("password-changed", { error })
})

app.get('/logout', (req, res) => {
    res.clearCookie("user")
    res.render("logged-out")
})

app.post('/dashboard/change-password', (req, res) => {
    const user = req.cookies["user"]
    if (!req.cookies["user"]) {
        return res.redirect("/login")
    }
    const username = user.username
    const password = req.body.password
    const newPassword = req.body.newPassword
    const repeatNewPassword = req.body.repeatNewPassword

    if (newPassword !== repeatNewPassword) {
        res.redirect("/register?error=Error:+passwords+doesn't+match")
        return
    }
    try {
        changePassword(
            username,
            password,
            newPassword
        )
        res.redirect("/dashboard/password-changed")
    } catch (e) {
        res.redirect("/dashboard/change-password?error=" + e.toString())
    }
})

app.get('/dashboard', (req, res) => {
    error = req.query.error
    if (!req.cookies["user"]) {
        return res.redirect("/login")
    }
    const user = req.cookies["user"]
    res.render("logged-in", { user, error })
})

app.post('/register', (req, res) => {
    const email = req.body.email 
    const username = req.body.username
    const password = req.body.password
    const repeatPassword = req.body.repeatPassword
    if (password !== repeatPassword) {
        return res.redirect("/register?error=Error:+Passwords+doesn't+match")
    }
    console.log("Registering user ", username)
    try {
        const user = registerUser(email, username, password)
        console.log("Registered user ", username)
        res.render("registered", { user, error: null })
    } catch (e) {
        res.redirect('/register?error=' + e.toString())
    }
})

app.get('/registered', (req, res) => {
    res.render('registered')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(8000);
