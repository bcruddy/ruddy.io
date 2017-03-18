const express = require('express'),
    router = express.Router(),
    fs = require('fs');

class BlogController {
    constructor () {}

    index (req, res) {
        return res.render('blog/index');
    }

    article (req, res, next) {
        let blog;

        if (!req.params.blogTitle) {
            next();
        }

        return res.render(`blog/${req.params.blogTitle}`);
    }
}

const blog = new BlogController();

router.get('/', blog.index);
router.get('/:blogTitle', blog.article);

module.exports = router;
