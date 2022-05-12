import * as React from 'react';
import axios from 'axios';

const Comment = ({ comment }) => {
  return (
    <li>
      {comment.content}
    </li>
  );
};

const CommentList = ({ comments }) => {
  return (
    <div>
      <i>{comments.length} comment(s)</i>
      <ul>
        {comments.map(comment => <Comment comment={comment} />)}
      </ul>
    </div>
  );
};

export { CommentList };