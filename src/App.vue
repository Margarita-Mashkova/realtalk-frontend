<template>
  <router-view/>
</template>

<script>

  export default {
  name: 'App',
  components: {
  },
  methods:{
    foo(path){
      let e = 0
      for (var i = 1; i < path.length; i++) {
        if(path[i]==='/'){
          e=i
        }
      }
      console.log(path)
      console.log(path.substring(0,e))
      return path.substring(0, e)
    }

  }
}
</script>

<style>
#app {
  font-family: Georgia, serif;
  text-align: center;
  color: black;
  font-size: 22pt;
}
body{
  background-image: url('assets/background.jpg');
  background-size: cover; 
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
h4{    
  -webkit-text-stroke-width: 0.5px;
  -webkit-text-stroke-color: #D276FD;
  margin: 40px 0px 30px 0px;
}
a{
    text-decoration: none;
    color: black;
    align-self: start;
}

a:hover {
  color: #D276FD;
}
</style>
