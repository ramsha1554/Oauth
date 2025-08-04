require("dotenv").config();
const connectDB = require('./config/db');
const express =require("express" )
const app = express()
const session = require('express-session');
const passport = require("passport");


require('./auth/google');
connectDB()
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,

}));


const path = require('path'); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index'); 
});

app.use (passport.initialize())
app.use (passport.session())




app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('profile', { user: req.user })
 
});

app.get('/logout', (req, res) => {
  req.logout((err) => {res.redirect('/');});
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }))

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' , successRedirect: '/profile' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})