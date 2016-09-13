'use strict';

const express = require('express');
const router = express.Router();

const _ = require('lodash');
const qs = require('qs');

class RootController {
    constructor() {}

    index(req, res) {
        let isPartial = req.query['isPartial'];

        return res.render('root/index', { title: 'Welcome', layout: !isPartial ? 'shared/_layout' : false });
    }

    about(req, res) {
        return res.render('root/about', { layout: false });
    }
}



// routes
const root = new RootController();
router.get('/', root.index);
router.get('/about', root.about);


module.exports = router;
