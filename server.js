const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/db");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments")

// pick config/.env as environment config
require("dotenv").config({ path: "./config.env" });

// configure Passport
require("./config/passport");

// connect the database
connectDB();

// use EJS as view engine
app.set("view engine", "ejs");

// setup body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup Morgan
app.use(logger("dev"));

// Use forms for put/delete requests
app.use(methodOverride("_method"));

// use Sessions stored in MongoDB
app.use(
  session({
    secret: "radical pug",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Use passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express flash for error messages
app.use(flash());

// Setup routes usage
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("comment", commentRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server runnning on port: ${process.env.PORT}.`);
});
