const express = require('express'),
    router = express.Router(),
    fs = require('fs');

class RootController {
    constructor () {}

    index (req, res) {
        let {isPartial} = req.query,
            layout = !isPartial ? 'shared/_layout' : false;

        return res.render('root/index', {title: 'Welcome', layout});
    }

    about (req, res) {
        return res.render('root/about', {layout: false});
    }
}

const root = new RootController();

router.get('/', root.index);
router.get('/about', root.about);

module.exports = router;
