// server.js
// Where the app starts, brain of the project

// init project
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

// CORS enabled for testing
const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: Number,
});

let Url = mongoose.model("Url", urlSchema);

// styling
app.use(express.static("public"));

/////////////////////////////// ROUTES //////////////////////////////////
// homepage route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

// challenge 1

app.get("/api/timestamp", (req, res) => {
  let now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString(),
  });
});

app.get("/api/timestamp/:date_string", (req, res) => {
  let date_string = req.params.date_string;
  let passedInValue = new Date(date_string);

  if (parseInt(date_string) > 10000) {
    let unixTime = new Date(parseInt(date_string));
    res.json({
      unix: unixTime.getTime(),
      utc: unixTime.toUTCString(),
    });
  } else if (passedInValue == "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: passedInValue.valueOf(),
      utc: passedInValue.toUTCString(),
    });
  }
});

// challenge 2

app.get("/api/whoami", (req, res) => {
  res.json({
    ipaddress: req.connection.remoteAddress,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// challenge 3
var responseObject = {};
app.post(
  "/api/shorturl/new",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    let inputUrl = req.body.url;
    let urlRegex = new RegExp(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    );

    if (!inputUrl.match(urlRegex)) {
      res.json({ error: "Invalid URL" });
      return;
    }

    responseObject["original_url"] = inputUrl;
    let inputShort = 1;

    Url.findOne({})
      .sort({ short: "desc" })
      .exec((err, result) => {
        if (!err && result != undefined) {
          inputShort = result.short + 1;
        }
        if (!err) {
          Url.findOneAndUpdate(
            { original: inputUrl },
            { original: inputUrl, short: inputShort },
            { new: true, upsert: true },
            (err, savedUrl) => {
              if (!err) {
                responseObject["short_url"] = savedUrl.short;
              }
            }
          );
        }
      });
    res.json(responseObject);
  }
);

app.get("/api/shorturl/:input", (req, res) => {
  let input = req.params.input;

  Url.findOne({ short: input }, (err, result) => {
    if (!err && result != undefined) {
      res.redirect(result.original);
    } else {
      res.json("URL not found");
    }
  });
});
// challenge 4
// challenge 5

/////////////////////////////// ////////////// //////////////////////////////////

const listener = app.listen(port, () => {
  console.log(`Your app is listening on Port ${port}`);
});
