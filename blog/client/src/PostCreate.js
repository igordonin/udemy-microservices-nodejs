import * as React from 'react';
import axios from 'axios';

const Alert = () => {
  return <div className='alert alert-success'>Post created</div>;
};

const PostCreate = () => {

  const [title, setTitle] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://posts.com/posts', {
      title
    });

    setTitle('');
    setSubmitSuccess(true);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className='btn btn-primary'>Submit</button>
        </div>
      </form>

      {submitSuccess && <Alert />}
    </div>
  );
};

export { PostCreate };