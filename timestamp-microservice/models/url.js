const dns = require('dns');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const random = require('randomstring');

const URLSchema = new Schema({
  name: String,
  ip: String,
  short: String,
  url: String
});

let url = mongoose.model('url', URLSchema);

async function checkURL(url) {
  format(url, true);
  console.log(url);
  return new Promise((resolve, reject) => {
    dns.lookup(url.replace('https://', ''), (err, address, family) => {
      if(err) {
        console.error(err);
        reject(err);
      }

      resolve(address);
    });
  });
}

function genShort(){
  return random.generate(7);
}

function format(url, removePrefix = false) {
  let regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  if(!regex.test(url) && !removePrefix){
    return `https://${url}`;
  }
  if(regex.test(url) && removePrefix){
    return url.replace('https://','');
  }
  return url;
}

exports.URL = url;
exports.genShort = genShort;
exports.checkURL = checkURL;
exports.formatURL = format;
