// Google Gmail APIs
const google = require('googleapis');
const googleAuth = require('google-auth-library');

// Other essential modules
const bodyParser = require('body-parser');
const mailMessage = require('./mailMessage');
const express = require('express');
const fs = require('fs');
const readline = require('readline');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Adding Scopes
const SCOPES = ['https://mail.google.com/'];

// Declaring constants.
const TOKEN_DIR = `${process.env.HOME}/.credentials/`;
const TOKEN_PATH = `${TOKEN_DIR}gmail-nodejs-quickstart.json`;
const PORT = 8000;

// Create an OAuth2 client with the given credentials, and then execute the
// given callback function.
function authorize(credentials, callback, request, response) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback, request, response);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, request, response);
    }
  });
}
// Get and store new token after prompting for user authorization, and then
// execute the given callback with the authorized OAuth2 client.
function getNewToken(oauth2Client, callback, request, response) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, request, response);
    });
  });
}

// Store the token.
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code !== "Token already exists.") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
}

// Send mail by send a POST request to /message with a JSON file
// consisting of feild to, sender, subject, message.
function sendMail(auth, req, res) {
  const encodedMessage = mailMessage.getEncodedMessage(
    req.body.to, req.body.from, req.body.subject, req.body.message);

  const gmail = google.gmail('v1');
  gmail.users.messages.send({
    auth,
    userId: 'me',
    resource: {
      raw: encodedMessage,
    },
  }, (err, response) => {
    if (err) {
      console.log(`The API returned an error: ${err}`);
      return;
    }
    res.status(200).send(message);
  });
}

app.post('/message', (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      console.log(`Error loading client secret file: ${err}`);
      return;
    }
    authorize(JSON.parse(content), sendMail, req, res);
  });
});

// Start node server.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
