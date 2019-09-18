<template>
    <p>hey</p>
</template>
<script>
import Vue from "vue";

Vue.component('Auth')


export default {
  name: "Auth",

  data () {
    return {

    }
  },

  methods: {


  },

  mounted(){
      if (this.$route.query.code !== undefined){
        this.$axios
            .post('https://rocky-mesa-97178.herokuapp.com/auth', 
                {
                 'code': this.$route.query.code,
                 })
            .then(res =>{
                 localStorage.setItem('token', res.data) 
                 this.$router.push('/')
            })            
      }
  }
}
</script>