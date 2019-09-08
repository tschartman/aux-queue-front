import axios from "axios";



axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.data.error.status === 401) {
    localStorage.removeItem('token');

    const authToken = window.btoa('420e781f275641c39c09ee6ca9f94275:e8b5abd005a44331a049e3473d12f4ef')
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const auth = {headers: { Authorization: 'Basic ' + authToken }};

    const proxy = 'https://cors-anywhere.herokuapp.com/';

    axios
    .post( proxy + 'https://accounts.spotify.com/api/token', params, auth)
    .then(function (response) {
        localStorage.setItem('token', response.data.access_token)
    })
}
  return Promise.reject(error)
})


axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`;
    }

    return config;
  }, 

  (error) => {
    return Promise.reject(error);
  }
);

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
};
