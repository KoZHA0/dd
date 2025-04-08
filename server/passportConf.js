const LocalStrategy = require("passport-local").Strategy;
const pool = require("../db/index");
const bcrypt = require("bcrypt");

function initialize(passport) {
    console.log("Initialized");

    const authenticateUser = async (email, password, done) => {
        try {
            const results = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (results.rows.length === 0) {
                return done(null, false, { message: "No user with that email address" });
            }

            const user = results.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password is incorrect" });
            }
        } catch (err) {
            return done(err);
        }
    };

    passport.use(
        new LocalStrategy(
            { usernameField: "email", passwordField: "password" },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const results = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

            if (results.rows.length === 0) {
                return done(null, false);
            }

            return done(null, results.rows[0]);
        } catch (err) {
            return done(err);
        }
    });
}

module.exports = initialize;
