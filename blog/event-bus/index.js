const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://localhost:4000/events', event).catch(err => console.log('4000', err.message));
  axios.post('http://localhost:4001/events', event).catch(err => console.log('4001', err.message));
  axios.post('http://localhost:4002/events', event).catch(err => console.log('4002', err.message));
  axios.post('http://localhost:4003/events', event).catch(err => console.log('4003', err.message));

  res.send({ status: 'OK' })
});

const PORT = 4005;

app.listen(PORT, () => {
  console.log(`Event Bus listening on ${PORT}`);
});