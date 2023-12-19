require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const dns = require("dns");
const url = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// nake the date presistent is it possible or i need a db?
// why  the mao not array? and how to use it?
// [] = => what is this equal or assign or destructure ??

let urlsMap = {};

let shortUrlId = 1;
console.log(urlsMap);

// GET
app.get("/api/shorturl/:shorturl", (req, res) => {
  const id = req.params.shorturl;

  const url = urlsMap[id];

  if (url) {
    res.redirect(url);
  } else {
    res.sendStatus(404);
  }

  res.json({ original_url: "https://freeCodeCamp.org", short_url: 1 });
});

//POST
app.post("/api/shorturl", (req, res) => {
  // res.json({ original_url: "https://freeCodeCamp.org", short_url: 1 });

  const originalURL = req.body.url;

  const parsedUrl = new URL(originalURL);
  const host = parsedUrl.hostname;

  dns.lookup(host, (err, address, family) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const shortUrl = shortUrlId;

      urlsMap[shortUrl] = originalURL;

      shortUrlId++;

      res.json({ original_url: originalURL, short_url: shortUrl });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
