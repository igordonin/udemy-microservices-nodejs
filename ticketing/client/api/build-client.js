import axios from 'axios';

const isScopeServerSide = () => typeof window === 'undefined';

const buildServerSideAxiosInstance = (req) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  })
};

const buildClientSideAxiosInstance = () => {
  return axios.create({
    baseURL: '/'
  });
};

const buildClient = ({ req }) => {
  if (isScopeServerSide(req)) {
    return buildServerSideAxiosInstance(req);
  }

  return buildClientSideAxiosInstance();
}


export default buildClient;