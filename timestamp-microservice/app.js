require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const {URL, checkURL, genShort, formatURL} = require('./models/url.js');

const port = process.env.PORT || 3000;

// Connect DB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res){
  let body = req.body;
  if(body.url == undefined || body.url == '') {
    return res.json({
      "error": "Send a URL with body."
    });
  }
  checkURL(body.url).then((result) => {
    URL.findOne({url: body.url}, (err, docs) => {
      if(docs){
        return res.json({
          original_url: docs.url,
          short_url: docs.short
        });
      } else {
        const short = genShort();
        let url = new URL({
          url: formatURL(body.url),
          short: short
        });
        url.save((err, data) => {
          if(err) return res.json({
            error: "Error saving URL to db."
          });
        });
        return res.json({
          orignal_url: body.url,
          short_url: short
        });
      }
    })
  }).catch((err) => res.json({"error": "invalid url"}));
});

app.get('/api/shorturl/:short_url', (req, res) => {
  URL.findOne({short: req.params.short_url}, (err, data) => {
    console.log(data);
    if(err || data == null) return res.json({error: "invalid url"});
    else res.redirect(formatURL(data.url));
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
