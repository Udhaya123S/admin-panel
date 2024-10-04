const express = require("express");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const cookieParser = require("cookie-parser");
const model = require('./models/index');
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const sequelize = require("./config/db.config");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

app.use(express.static(path.join(__dirname, "..", "public")));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// parse cookies
app.use(cookieParser());


const corsOptions = {
  origin: '*', 
   methods: ['GET', 'POST'], 
 allowedHeaders: ['Content-Type', 'Authorization'], 
};

// Use CORS middleware
app.use(cors(corsOptions));

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use((req, res, next) => {
  const langCode = req.acceptsLanguages("en", "ar");
  req.languageCode = langCode ? langCode : "en";
  next();
});

// jwt authentication

app.use(passport.initialize());

passport.use("jwt", jwtStrategy);


if (config.env === "production") {

  //app.use('/v1/auth', authLimiter);
}

app.use((req, res, next) => {
  res.set(
    "Content-Security-Policy",
    "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
  );
  next();
});

//  v1 api routes

app.use("/v1", routes);

// send back a 404 error for any unknown api request

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed

app.use(errorConverter);

// handle error

app.use(errorHandler);

module.exports = app;
