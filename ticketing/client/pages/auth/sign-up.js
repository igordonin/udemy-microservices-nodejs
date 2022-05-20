import * as React from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';

const SignUp = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/sign-up',
    method: 'post',
    body: {
      email, password
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Signup</h1>

      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="passsword"
          className="form-control"
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
};

export default SignUp;