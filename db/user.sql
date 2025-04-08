CREATE TABLE users (

id serial PRIMARY KEY,
name CHARACTER VARYING(50) NOT NULL,
email CHARACTER VARYING(150)NOT NULL,
password CHARACTER VARYING(150) NOT NULL


);


CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    genre VARCHAR(100),
    duration INTEGER,
    image_url VARCHAR(255),
    language VARCHAR(255),
    trailer_url VARCHAR(255),
    director VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Now Showing'
);




CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    screen_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies(id)
        ON DELETE CASCADE
);



CREATE TABLE admin (

id serial PRIMARY KEY,
name CHARACTER VARYING(50) NOT NULL,
email CHARACTER VARYING(150)NOT NULL,
password CHARACTER VARYING(150) NOT NULL


);



insert INTO admin(name , email , password) VALUES('admin1' , 'admin@admin.admin' ,'admin');