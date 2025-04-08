const { Router } = require('express');
const passport = require("passport");
const pool = require("../db/index");
const bcrypt = require("bcrypt");
const postReq = Router();


postReq.post('/editProfile', (req, res) => {

    const { name } = req.body;
    const id = req.user.id;

    pool.query('UPDATE users SET name=$1 WHERE id=$2', [name, id], (err, result) => {

        if (err) throw err;
        res.redirect('/profile')

    })


})




postReq.post("/signup", async (req, res) => {
    let { name, email, password, password2 } = req.body;

    let errors = [];

    console.log({
        name,
        email,
        password,
        password2
    });

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 3) {
        errors.push({ message: "Password must be a least 3 characters long" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("signup", { errors, name, email, password, password2 });
    } else {
        hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
        WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({ message: "Email already registered" });
                    res.render("signup", { errors, name, email, password, password2 });

                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
                        [name, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/login");
                        }
                    );
                }
            }
        );
    }
});

postReq.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true

    })
);

postReq.post('/email', (req, res) => {

    const { email } = req.body;
    pool.query('SELECT * FROM users WHERE email=$1', [email], (err, result) => {

        if (err) throw err;
        if (result.rows.length === 0) {
            return res.render("email", {
                messages: "Email does not exist"
            });
        }

        const userId = result.rows[0].id;

        res.redirect(`/forgot/${userId}`)


    })

})
postReq.post('/email', (req, res) => {
    const { email } = req.body;
    pool.query('SELECT * FROM users WHERE email=$1', [email], (err, result) => {
        if (err) throw err;
        if (result.rows.length === 0) {
            return res.render("email", {
                messages: "Email does not exist"
            });
        }

        const userId = result.rows[0].id;
        res.redirect(`/forgot/${userId}`);
    });
});
postReq.post('/forgot/:userID', async (req, res) => {
    const userId = req.params.userID;
    const { password, password2 } = req.body;

    if (password === password2) {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error updating password");
            }

            req.flash("success_msg", "Password updated successfully.");
            res.redirect("/login");
        });
    } else {
        return res.render('forgot', { userID: userId, message: "Passwords do not match" });
    }
});


postReq.post('/admin', (req, res) => {

    const { email, passwrod } = req.body;

    pool.query('SELECT * FROM admin WHERE email=$1 AND password=$2', [email, passwrod], (err, results) => {

        if (err) throw err;

        if (results.rows > 0) {

            res.redirect('/home/admin')



        } else {

            res.render('adminpage', { message: 'password or email is incoret' })

        }


    })




})

postReq.post('/admin/add-movie', async (req, res) => {
    const { title, genre, duration, language, image_url, description } = req.body;

    // Convert duration from "2h 30m" to minutes
    let durationMinutes = 0;
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    if (hoursMatch) durationMinutes += parseInt(hoursMatch[1]) * 60;
    if (minutesMatch) durationMinutes += parseInt(minutesMatch[1]);

    try {
        await pool.query(
            `INSERT INTO movies (title, description, genre, duration, language, image_url)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [title, description, genre, durationMinutes, language, image_url]
        );
        req.flash('success_msg', 'Movie added successfully!');
        res.redirect('/admin/add-movie');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to add movie.');
        res.redirect('/admin/add-movie');
    }
});

module.exports = postReq;