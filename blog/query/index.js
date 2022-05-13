const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: [],
    }
  }

  if (type === 'CommentCreated') {
    const { id, content, status, postId } = data;
    posts[postId].comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;
    const comment = posts[postId].comments.find(comment => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

const PORT = 4002;
app.listen(PORT, async () => {
  console.log(`Query listening on ${PORT}`);

  const res = await axios.get('http://event-bus-srv:4005/events');
  res.data.forEach(e => handleEvent(e.type, e.data));
});