import * as React from 'react';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/sign-up', {
        email, password
      });

      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
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

      {errors.length > 0 && (
        <div className='alert alert-danger'>
          <ul className='my-0'>
            {errors.map(err => {
              return <li key={err.message}>{err.message}</li>
            })}
          </ul>
        </div>
      )}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
};

export default SignUp;