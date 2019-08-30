const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

//#region INGRESAR USER
passport.use('local.signin', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Username, Password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE Username = ?', [Username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(Password, user.Password);
        if(validPassword){
            done(null, user, req.flash('Success','BIENVENIDO '+ user.FullName));
        } else {
            done(null, false, req.flash('Message', 'Password incorrecta'));
        }
    } else {
        return done(null, false, req.flash('Message','User Name invalido'))
    }
}));
//#endregion

//#region REGISTRAR USER
passport.use('local.signup', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Username, Password, done) => {
    const {FullName, Email, Provincia, Localidad, Domicilio} = req.body;
    const NewUser = {
        Username,
        Password,
        FullName,
        Email,
        Provincia,
        Localidad,
        Domicilio
    };
    NewUser.Password = await helpers.encryptPassword(Password) 
    const result = await pool.query('INSERT INTO users SET ?', [NewUser]);
    NewUser.UserID = result.insertId;
    return done(null, NewUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.UserID);
});

passport.deserializeUser(async (UserID, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE UserID = ?', [UserID]);
    done(null, rows[0]);
});
//#endregion