import * as React from 'react';
import axios from 'axios';

const Comment = ({ comment }) => {
  return (
    <li>
      {comment.content}
    </li>
  );
};

const CommentList = ({ postId }) => {

  const [comments, setComments] = React.useState([]);

  const fetchComments = async (postId) => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    setComments(res.data);
  };

  React.useEffect(() => {
    fetchComments(postId);
  }, []);

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