// server.js
// Where the app starts, brain of the project

// init project
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;

// CORS enabled for testing
const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

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
// challenge 4
// challenge 5

/////////////////////////////// ////////////// //////////////////////////////////

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
