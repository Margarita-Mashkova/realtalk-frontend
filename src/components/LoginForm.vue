<template>
    <form @submit.prevent>
        <h4>Вход</h4>
        <div class="error" v-if="this.wrongData">
          <label>Неверный логин и/или пароль</label>
        </div>
        <InputIcon
        v-model="user.login"
        :type = "'text'"
        :placeholder = "'Логин'"
        :src = "'email.png'"
        :width = "'18'"
        :height = "'14'"
        />
        <InputIcon
        v-model="user.password"
        :type = "'password'"
        :placeholder = "'Пароль'"
        :src = "'password.png'"
        :width = "'18'"
        :height = "'19'"
        />                
        <div class="btn-bar">
            <MyButton @click="login($event)">Войти</MyButton>
            <MyButton @click="goToRegistration($event)">Регистрация</MyButton>
        </div>     
    </form>
</template>

<script>

import UserService from "@/services/UserService";

import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';
export default {
    components:{
        MyButton,
        InputIcon
    },
    data(){
      return {
        user:{},
        wrongData: false
      }
    },
    methods: {
      login(e) {        
         UserService.login(this.user).then(response => {
              if(response.status == 200){
                console.log("токен "+response.data)
                localStorage.setItem('jwt', response.data)
              }              
              window.location.href = '/feed'
            }
        ).catch(() =>{
          this.wrongData = true
        })
        e.preventDefault()
      },
      goToRegistration(e){
        this.$router.push('/registration')
        e.preventDefault()
      }
    },
    watch:{
      'wrongData'(){
        
      }
    }
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    min-width: 30%;
    min-height: 60%;
    /* margin: auto;
    margin-top: 12%; */
    background-color: #ffffff96;
    border-radius: 30px; 
    border: 1px solid;
    border-color: #D276FD;
    justify-content: center;
}
.btn{
    padding: 10px;
    min-width: 170px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.btn-bar{
    display: flex;
    justify-content: space-evenly;
}

.error{
  padding: 10px;
    background-color: #ffb6b6;
    margin: 10px 50px;
    border: 1px solid;
    border-radius: 10px;
    border-color: #ed5656;
    display: flex;
}

label{
  font-size: 11.5pt;
  color: #b10000;
}
</style>

<!-- UserService.me().then((response)=> {
  if(response.status == 200) {            
      localStorage.setItem('me', response.data)
      console.log("me" + response.data)
  }          
})

this.$router.push('/feed') -->