import * as React from 'react';

const Comment = ({ comment }) => {
  const { status, content } = comment;

  const contentMap = {
    approved: content,
    rejected: 'Comment has been rejected',
    pending: 'Comment is awaiting moderation',
  }

  return (
    <li>
      {contentMap[status]}
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