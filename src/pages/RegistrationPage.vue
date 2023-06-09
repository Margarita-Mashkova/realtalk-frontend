<template>
    <router-view :key="1" :user="user" @updateUser="onUpdateUser" @registerUser="onRegister"/>
</template>
  
  <script>
  import UserService from "@/services/UserService";
  
  export default {
    name: "RegisterPage",
    data() {
      return {
        user: {
          name: '',
          surname: '',
          file: null,
          password: '',
          login: '',
          borthdate: '',
          city: ''
        },
    }
  },
    methods: {
      onUpdateUser(data) {
        console.log(data)
        if(data.name!=null)this.user.name=data.name
        if(data.surname!=null)this.user.surname=data.surname
        if(data.login!=null)this.user.login=data.login
        if(data.password!=null)this.user.password=data.password
        if(data.file!=null)this.user.file=data.file
        if(data.city!=null)this.user.city=data.city
        if(data.borthdate!=null)this.user.borthdate=data.borthdate
      },
      onRegister(){
        UserService.register(this.user).then((response)=> {
          if(response.status == 200) this.$router.push('/auth')
        });
      }
    }
  }
  </script>
  
  <style scoped>
  </style>