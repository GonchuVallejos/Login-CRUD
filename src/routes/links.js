const express = require('express');
const router = express.Router();

const pool = require('../database'); // Hace referencia a la base de datos
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => { //Si quiero usar await se tiene que poner async si o si
    const { Title, Url, Description } = req.body;
    const newLink = {
        Title,
        Url,
        Description,
        User_ID: req.user.UserID

    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('Success', 'Link agregado correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE User_ID = ?', [req.user.UserID]);
    console.log(req.user.User_ID)
    res.render('links/list', { links });
});

router.get('/delete/:LinkID', isLoggedIn, async (req, res) => {
    const {LinkID} = req.params;
    await pool.query('DELETE FROM links WHERE LinkID = ?', [LinkID]);
    req.flash('Success', 'Link eliminado correctamente');
    res.redirect('/links');
});

router.get('/edit/:LinkID', isLoggedIn, async (req, res) => {
    const {LinkID} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE LinkID = ?', [LinkID])
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:LinkID', isLoggedIn, async (req, res) => {
    const {LinkID} = req.params;
    const {Title, Url, Description} = req.body;
    const newLink = {
        Title,
        Url,
        Description
    };
    await pool.query('UPDATE links SET ? WHERE LinkID = ?', [newLink, LinkID]);
    req.flash('Success', 'Link modificado correctamente');
    res.redirect('/links');
});

module.exports = router;