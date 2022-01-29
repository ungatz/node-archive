const Twitter = require('twitter');
const Sheet = require('./sheet');

(async function (){
//connect to twitter via api
const client = new Twitter({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token_key: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
  });
  //pull tweet from ss
  const sheet = new Sheet
  await sheet.load();
  const quotes = await sheet.getRows();
  const status = quotes[0].quote;

  //send tweets
  client.post('statuses/update', {status},  function(error, tweet, response) {
    if(error) throw error;
    console.log(tweet);  // Tweet body.
  });
  //remove tweeted quote from ss
  await quotes[0].delete();
})()
