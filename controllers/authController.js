const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', { error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('auth/login', { error: 'Invalid email or password' });
        }

        req.session.user = { _id: user._id, name: user.name };
        req.session.save(err => {
            if (err) console.error(err);
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error(err);
        res.render('auth/login', { error: 'Something went wrong' });
    }
};

exports.getSignup = (req, res) => {
    res.render('auth/signup');
};
exports.postSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('auth/signup', { error: 'Please provide a valid email address.' });
        }

        if (password.length < 6) {
            return res.render('auth/signup', { error: 'Password must be at least 6 characters long.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });

        await user.save();

        req.session.user = { 
            _id: user._id, 
            name: user.name 
        };

        req.session.save(err => {
            if (err) console.error(err);
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error(err);
        res.render('auth/signup', { error: 'Email already exists or invalid data' });
    }
};
exports.logout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/auth/login');
    });
};
