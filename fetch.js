const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const volleyball = require("volleyball");

app.use(cors());
app.use(express.json());

require('dotenv').config()
const accessToken = process.env.TOKEN;

const url = `https://graph.facebook.com/v6.0/2844484592301102/photos?pretty=0&fields=source&limit=50&after=Mjg0NDY4ODM1ODk0NzM5MgZDZD&access_token=${accessToken}`
const testurl = `https://graph.facebook.com/v6.0/2844484592301102/photos?fields=source,name&limit=100&access_token=${accessToken}`

app.get('/', (req, res) => {
  res.send('API is Working ✔')
  // console.log(json)
});

app.get('/fb', async (req, res, next) => {
  const data = await fetch(testurl)
  // console.log(data);
  
  if (data.status === 200) {
    const json = await data.json();
    console.log(json.data)
    const sources = json.data
    // console.log(sources)
    res.json(sources);
    res.status(200);
  } else {
    next();
  }

});

app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})