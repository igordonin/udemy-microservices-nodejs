import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/current-user')
    .catch(err => {
      console.log(err);
      return {};
    });

  return data;
};

export default LandingPage;