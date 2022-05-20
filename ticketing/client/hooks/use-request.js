import * as React from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body }) => {

  const [errors, setErrors] = React.useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <ul className='my-0'>
            {err.response.data.errors.map(err => {
              return <li key={err.message}>{err.message}</li>
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;