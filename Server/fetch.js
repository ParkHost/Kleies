const express = require('express');
//const volleyball = require('volleyball');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const path = require('path');
const sgMail = require('@sendgrid/mail');

require('dotenv').config()

const accessToken = process.env.TOKEN;
sgMail.setApiKey(process.env.API_KEY);

const {
  AsyncNedb
} = require('nedb-async')

const database = new AsyncNedb({
  filename: path.join(__dirname, './data.db'),
  autoload: true,
})

database.loadDatabase();

app.use(cors());
app.use(express.json());
//app.use(volleyball);
app.disable('x-powered-by');

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const testurl = `https://graph.facebook.com/v6.0/2844484592301102/photos?fields=source,name&limit=100&access_token=${accessToken}`
const imageURL = `https://graph.facebook.com/v6.0/`

const secondpartofimageURL = `?fields=source&access_token=${accessToken}`

app.get('/', (req, res) => {
  res.send('API is Working ✔')
});

app.get('/test', (req, res) => {
  console.log(testurl);
  res.send("API Test is working!!");
});

app.get('/review', async (req, res) => {
  let fbid = req.query
  console.log(fbid);
  console.log(fbid.fbid)
  res.json(fbid)
  res.redirect(`/message.html`)
  const response = await fetch(`${imageURL}${fbid.fbid}${secondpartofimageURL}`);
  const data = await response.json()
  console.log(data);
  database.find({}, (err, data) => {
    if (err) {
      res.json(next);
    }
    res.json(data);
  })
});

app.get('/message', async (req, res, next) => {
  const query = req.query
  const fbid = query.id;
  
  const response = await fetch(`${imageURL}${fbid}${secondpartofimageURL}`);
  if (response.status === 200) {
    const json = await response.json();
    const entrys = await database.asyncFind({
      FBid: fbid
    }, [
      ['limit', 100]
    ]);
    console.log(json)
    res.json({
      json,
      entrys
    });
    res.status(200);
  } else {
    next();
  }
});

app.get('/fb', async (req, res, next) => {
  const data = await fetch(testurl)

  if (data.status === 200) {
    const json = await data.json();
    const sources = json.data
    res.json(sources);
    res.status(200);
  } else {
    next();
  }

});

app.post('/input', async (request, response, next) => {
  console.log('got an request on /input route!')
  const formData = request.body;

  let current_datetime = new Date()
  let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + " " + " " + ('0' + current_datetime.getHours()).slice(-2) + ":" + ('0' + current_datetime.getMinutes()).slice(-2);
  formData.timestamp = formatted_date;
  formData.message = formData.message.toString();
  formData.name = formData.name.toString();
  await database.asyncInsert(formData);
  const entrys = await database.asyncFind({
    FBid: formData.FBid
  }, [
    ['limit', 100]
  ]);
  response.status(200)
  response.json({
    messages: entrys,
    message: 'Success'
  });
})

app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message
  });
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})