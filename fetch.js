const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();



app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Removing "X-Powered-By"); in header
  // Pass to next layer of middleware
  next();
});

require('dotenv').config()
const accessToken = process.env.TOKEN;

const testurl = `https://graph.facebook.com/v6.0/2844484592301102/photos?fields=source,name&limit=100&access_token=${accessToken}`

app.get('/', (req, res) => {
  res.send('API is Working ✔')
});

app.get('/fb', async (req, res, next) => {
  const data = await fetch(testurl)
  
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