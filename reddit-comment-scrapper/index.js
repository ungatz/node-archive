const puppeteer = require('puppeteer');
const url = 'https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/';
const Sheet = require('./sheet');
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);
  const sheet = new Sheet;
  await sheet.load();
  //create sheet by title
  const title = await page.$eval('.title a',el=>el.textContent);
  await sheet.addSheet(title.slice(0,99));

  //expand all comments
  let expandButtons = await page.$$('.morecomments');
  while(expandButtons.length){
  for(let button of expandButtons){
      await button.click();
      await page.waitFor(150);
  }
  await page.waitFor(500);
  expandButtons = await page.$$('.morecomments');
}
  //select comments and scrape text and points
  const comments = await page.$$('.entry');
  const formatterComments = [];
  for (let comment of comments){
    //scrape points
    const points = await comment.$eval('.score', el => el.textContent).catch(err => console.error('no score'));
    //scrape text
    const rawtext = await comment.$eval('.usertext-body',el => el.textContent).catch(err => console.error('no text'));
    if(points && rawtext){
      const text = rawtext.replace(/\n/g , '');
      formatterComments.push({points,text});
    }
  }
  
  //sort by points
  formatterComments.sort((a,b)=>{
    const pointA = Number(a.points.split(' ')[0]);
    const pointB = Number(b.points.split(' ')[0]);
    return pointB - pointA;
  })
  console.log({formatterComments});
  //put in spread-sheet
  sheet.addRows(formatterComments , sheetIndex);
  await browser.close();
})(); 