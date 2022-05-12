const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res) => {
  const { type } = req.body;



});

const PORT = 4003;

app.listen(PORT, () => {
  console.log(`Moderation listening on ${PORT}`);
});