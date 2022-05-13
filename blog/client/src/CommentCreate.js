import * as React from 'react';
import axios from 'axios';

const Alert = () => {
  return <div className='alert alert-success'>Comment created</div>;
};

const CommentCreate = ({ postId }) => {

  const [content, setContent] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content
    });

    setContent('');
    setSubmitSuccess(true);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>New Comment</label>
          <input className='form-control'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className='btn btn-primary'>Submit</button>
        </div>
      </form>

      {submitSuccess && <Alert />}
    </div>
  );
};

export { CommentCreate };