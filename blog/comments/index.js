const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;

  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comment = {
    id: commentId,
    content,
    status: 'pending',
  }

  const comments = commentsByPostId[postId] || [];
  comments.push(comment);

  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      ...comment,
      postId,
    },
  })

  res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const comments = commentsByPostId[data.postId];
    const comment = comments.find(comment => comment.id === data.id);
    comment.status = data.status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...comment,
        postId: data.postId,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Comments listening on 4001')
});