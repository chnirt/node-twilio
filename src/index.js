const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const cors = require("cors");
const TokenService = require("./services/tokenService");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const port = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST /token
app.post("/token", function (req, res) {
  var identity = req.body.username;

  var token = TokenService.generate(identity);

  res.send(
    JSON.stringify({
      identity: identity,
      token: token.toJwt()
    })
  );
});

// GET /token
app.get("/token", function (req, res) {
  var identity = req.query.identity;

  var token = TokenService.generate(identity);

  res.send(
    JSON.stringify({
      identity: identity,
      token: token.toJwt()
    })
  );
});

app.post("/api/messages", (req, res) => {
  res.header("Content-Type", "application/json");
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then((response) => {
      console.log(response);
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

//create a server object:
app.listen(port, () => console.log(`Listen on port: ${port}`)); //the server object listens on port 8080
