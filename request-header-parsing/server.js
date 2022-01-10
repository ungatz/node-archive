// server.js

// init project
var express = require('express');
var app = express();


// your first API endpoint...
app.get("/api/whoami", function (req, res) {
  res.json({
    "ipaddress": req.header('x-forwarded-for'),
    "language": req.header('Accept-Language'),
    "software": req.header('User-Agent')
  });
});



// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
