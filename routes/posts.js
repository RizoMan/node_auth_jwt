const router = require('express').Router();
const verify = require('./verify-token');
const User = require('../models/User');

router.get('/', verify, async (req, res) => {
    // res.json({
    //     posts: {
    //         title: 'my first post',
    //         description: `random data what you shouldn't access`
    //     }
    // })
    const user = await User.findById(req.user._id);
    res.json({user});
});

module.exports = router;