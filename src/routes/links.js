const express = require('express');
const router = express.Router();

const pool = require('../database'); // Hace referencia a la base de datos

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => { //Si quiero usar await se tiene que poner async si o si
    const { Title, Url, Description } = req.body;
    const newLink = {
        Title,
        Url,
        Description
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('Success', 'Link agregado correctamente');
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', { links });
});

router.get('/delete/:LinkID', async (req, res) => {
    const {LinkID} = req.params;
    await pool.query('DELETE FROM links WHERE LinkID = ?', [LinkID]);
    req.flash('Success', 'Link eliminado correctamente');
    res.redirect('/links');
});

router.get('/edit/:LinkID', async (req, res) => {
    const {LinkID} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE LinkID = ?', [LinkID])
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:LinkID', async (req, res) => {
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