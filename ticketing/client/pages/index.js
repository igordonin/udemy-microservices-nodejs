import axios from 'axios';

const isScopeServerSide = () => typeof window === 'undefined';

const LandingPage = ({ currentUser }) => {
  return <div>Landing Page. Hello, {currentUser?.email}!</div>;
}

LandingPage.getInitialProps = async () => {
  const resource = '/api/users/current-user';

  const urlDomain = isScopeServerSide() ?
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local' : '';

  const options = isScopeServerSide() ? {
    headers: { Host: 'ticketing.dev' }
  } : {}

  const response = await axios.get(`${urlDomain}${resource}`, options)
    .catch(err => {
      console.log(err);
      return {};
    });

  return response.data;
};

export default LandingPage;