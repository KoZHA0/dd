const { Router } = require('express')
const pool = require("../db/index");
const { checkAuthenticated, checkNotAuthenticated } = require('./authmiddlewere');


const view = Router();


view.get("/", checkAuthenticated, async (req, res) => {

    try {
        const moviesResult = await pool.query(
            'SELECT * FROM movies WHERE status = $1',
            ['Now Showing']
        );

        res.render('index', {
            val: req.isAuthenticated() ? 'Profile' : 'Login',
            movies: moviesResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }


});

view.get('/home', checkNotAuthenticated, async (req, res) => {

    try {

        const moviesResult = await pool.query(
            'SELECT * FROM movies WHERE status = $1',
            ['Now Showing']
        );

        res.render('index', {
            val: req.isAuthenticated() ? 'Profile' : 'Login',
            movies: moviesResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }



})

view.get("/signup", checkAuthenticated, (req, res) => {
    res.render("signup");
});

view.get("/login", checkAuthenticated, (req, res) => {

    res.render("login.ejs");
});

view.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success_msg", "You Logged Out.");
        res.redirect('/login');
    });
});



view.get('/profile', checkNotAuthenticated, (req, res) => {

    res.render('profile', {
        user: req.user
        , upcomingBookings: [
            {
                movie: "Dune: Part Two",
                date: "2025-04-06",
                time: "7:30 PM",
                seats: "A1, A2"
            }
        ],
        bookingHistory: [
            {
                movie: "Oppenheimer",
                date: "2024-12-20",
                status: "Completed"
            }
        ]
    });
})

view.get('/edit_profile', (req, res) => {

    res.render('editProfile', { current_name: req.user.name });

})


view.get('/email', checkAuthenticated, (req, res) => {

    res.render('email');
})

view.get('/forgot/:userID', (req, res) => {

    res.render('forgot', { userID: req.params.userID });
});


view.get('/showtime', async (req, res) => {
    try {
        const moviesResult = await pool.query(
            'SELECT * FROM movies WHERE status = $1',
            ['Now Showing']
        );

        res.render('showtime', {
            val: req.isAuthenticated() ? 'Profile' : 'Login',
            movies: moviesResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

view.get('/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const movieResult = await pool.query(
            `SELECT * FROM movies WHERE id = $1`,
            [movieId]
        );

        if (movieResult.rows.length === 0) {
            return res.status(404).send("Movie not found");
        }

        res.render('movies', {
            val: req.isAuthenticated() ? 'Profile' : 'Login',
            movie: movieResult.rows[0] // Pass the movie object to EJS
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

view.get('/home/admin', (req, res) => {

    res.render('admin')

})

view.get('/admin/add-movie', (req, res) => {

    res.render('add-movie');


})

view.get('/admin/delete-movie', (req, res) => {

    res.render('delete-movie');


})


view.get('/admin', (req, res) => {

    res.render('adminpage')


})

view.get('/payment', (req, res) => {

    res.render('payment')

})

module.exports = view;