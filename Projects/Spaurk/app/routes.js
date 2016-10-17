
var Users = require('../app/models/user');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { 
            message : req.flash('loginMessage'),
            isAuthenticated : req.isAuthenticated(),
            user : req.user
        }); 
    });

    app.get('/admin', function(req, res) {
        Users.find({}, function(err, allUsers) {
            if (!err){
                res.render('admin.ejs', { 
                message : req.flash('adminMessage'),
                isAuthenticated : req.isAuthenticated(),
                users : allUsers,
                user : req.user
                }); 
            } else { throw err; }
        });
    });

    app.get('/admin/:id/removeUser', function(req, res) {
        Users.findById(req.params.id, function (err, user) {
            if (err) { return next (err); }
            if (!user) { return res.send(404); }

            user.remove(function(err) {
                if (err) { return handleError(res, err); }
                res.redirect('/admin');
            });
        });
    });


    app.get('/register', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/profile');
        } else {
        res.render('register.ejs', {
            message : req.flash('signupMessage'),
        });
        }
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/register',
        failureFlash : true,
    }));

    app.get('/login', function(req, res) {
        res.redirect('/');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true,
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/profile', function(req, res) {
        res.render('profile.ejs', {
            isAuthenticated : req.isAuthenticated(),    
            user : req.user
        });
    });

    app.post('/profile/save', function(req, res) {
        var soundCloud = req.body.soundcloud,
            bandCamp = req.body.bandcamp,
            twitter = req.body.twitter,
            website = req.body.website

        if (req.isAuthenticated()) {
            Users.findOne({ _id : req.user._id }, function (err, user) {
                if (err) { console.log(err) }
                user.social[ 
                    { name : 'soundcloud', url : soundCloud }, 
                    { name : 'bandcamp', url : bandCamp },
                    { name : 'twitter', url : twitter },
                    { name : 'website', url : website } 
                ];
                user.save();
                res.redirect('/');
            });
        }
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next 
    }
    res.redirect('/');
}
