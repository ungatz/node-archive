// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.send("Timestamping Microsevice");
});


// your first API endpoint...
app.get("/api/:date?", function (req, res) {
  let dateString = req.params.date;
  let dateObj = new Date();
  console.log(dateString);
  if(dateString == undefined){
    res.json({
      "unix": dateObj.valueOf(),
      "utc": dateObj.toUTCString()
    });
  }
  if(/\d{5,}/.test(dateString)){
    res.json({
      unix: parseInt(dateString),
      utc: new Date(parseInt(dateString)).toUTCString()
    });
  } else {
    let dateObject = new Date(dateString);
    if(dateObject.toString() == "Invalid Date"){
      res.json({
        error: "Invalid Date"
      });
    } else {
    res.json({
      unix: parseInt(dateObject.valueOf()),
      utc: dateObject.toUTCString()
    });
    }
  }
});



// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
