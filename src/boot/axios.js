import axios from "axios";



axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.data.error.status === 401) {
    localStorage.removeItem('token');
    window.location = 'https://accounts.spotify.com/authorize?client_id=420e781f275641c39c09ee6ca9f94275&response_type=code&redirect_uri=' + encodeURIComponent('https://spa.tschartman.now.sh') + '&scope=playlist-modify-public'
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
