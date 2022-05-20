import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <div>Landing Page. Hello, {currentUser?.email}!</div>;
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