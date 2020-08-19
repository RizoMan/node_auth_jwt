const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require('morgan');
const dotenv = require('dotenv');

//Middlewares
dotenv.config();
app.use(express.json());
app.use(morgan('combined'));

//DB Connection
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).
    then(console.log("Database Connected"));

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);

//404 page
app.use((req, res, next) => {
    res.status(404).send(`<h1>Sorry, we do our best but, we cant find that!</h1>`);
});

app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`)
});