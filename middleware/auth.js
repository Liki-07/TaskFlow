module.exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
        return next();
    }
    res.redirect('/auth/login');
};

