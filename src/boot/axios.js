import axios from "axios";

axios.interceptors.response.use(
  function(response) {
    return response;
  }
  // function(error) {
  //   if (error.response.data.error.status === 401) {
  // localStorage.removeItem('token');
  // if (localStorage.getItem('refresh')){
  //       axios
  //         .post('https://rocky-mesa-97178.herokuapp.com/auth',
  //             {
  //              'code': localStorage.getItem('refresh'),
  //              })
  //         .then(res =>{
  //             localStorage.setItem('token', res.data)
  //             location.reload()
  //         })
  // } else {
  // axios
  //   .get('https://rocky-mesa-97178.herokuapp.com/auth', )
  //   .then(res =>{
  //           localStorage.setItem('token', res.data.token)
  //           localStorage.setItem('refresh', res.data.refresh)
  //           location.reload()
  //   })
  // }

  //       let clientId = "420e781f275641c39c09ee6ca9f94275";
  //       axios
  //         .get(
  //           "https://accounts.spotify.com/authorize?client_id=" +
  //             clientId +
  //             "&response_type=code&redirect_uri=localhost%3A8080"
  //         )
  //         .then(res => {
  //           console.log(res);
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //     return Promise.reject(error);
  //   }
);

axios.interceptors.request.use(
  config => {
    // let token = localStorage.getItem('token');

    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${ token }`;
    // }

    return config;
  },

  error => {
    return Promise.reject(error);
  }
);

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios;
};
