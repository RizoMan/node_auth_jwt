const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    registerValidation,
    loginValidation
} = require('../validation');

//Routes
router.post('/register', async (req, res) => {
    //body parameters
    const {
        name,
        email,
        password
    } = req.body;

    const {
        error
    } = registerValidation(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    //validate data before save user
    await registerValidation(req.body, res);

    //Check if the user is in the database
    const emailExist = await User.findOne({
        email
    });

    if (emailExist) return res.status(400).json({
        message: 'Email already used!'
    });

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashPassword
    });

    //Create a new User
    const savedUser = await user.save()
        .then(response => res.json({
            user: response._id
        }))
        .catch(error => res.status(400).json({
            error
        }));
});

router.post('/login', async (req, res) => {
    // Body parameters
    const {
        email,
        password
    } = req.body;

    //Login Validation
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    //Check if the email exists
    const user = await User.findOne({
        email
    });

    if (!user) return res.status(400).json({ message: 'Email is not found' })

    //check the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.res.status(400).json({ message: 'Invalid Password' })

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json(token);
    // res.json({message: `Loged In, Welcome ${user.name}`});
});

module.exports = router;