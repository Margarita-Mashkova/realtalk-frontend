<template>    
        <form novalidate="true" @submit.prevent>
        <h4>Регистрация</h4>
        <InputIcon
        v-model="name"
        :type = "'text'"
        :placeholder = "'Имя'"
        :src = "'name.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <div class="error" v-if="wrongData.includes('name')">
            <label>Поле "Имя" должно быть заполнено</label>
        </div>        
        <InputIcon
        v-model="surname"
        :type = "'text'"
        :placeholder = "'Фамилия'"
        :src = "'name.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <div class="error" v-if="wrongData.includes('surname')">
            <label>Поле "Фамилия" должно быть заполнено</label>
        </div> 
        <InputIcon
        v-model="login"
        :type = "'text'"
        :placeholder = "'Логин'"
        :src = "'email.png'"
        :width = "'18'"
        :height = "'14'"
        />
        <div class="error" v-if="wrongData.includes('login')">
            <label>Поле "Логин" должно быть заполнено</label>
        </div>
        <div class="error" v-if="!userNotExist & userFind!=null">
            <label>Логин "{{login}}" уже занят</label>
        </div>
        <InputIcon
        v-model="password"
        :type = "'password'"
        :placeholder = "'Пароль'"
        :src = "'password.png'"
        :width = "'18'"
        :height = "'19'"
        />
        <div class="error" v-if="wrongData.includes('password')">
            <label>Поле "Пароль" должно быть заполнено</label>
        </div> 
        <InputIcon
        v-model="passwordR"
        :type = "'password'"
        :placeholder = "'Повторите пароль'"
        :src = "'password.png'"
        :width = "'18'"
        :height = "'19'"
        />
        <div class="error" v-if="password != passwordR">
            <label>Пароли не совпадают</label>
        </div> 

        <MyButton @click="goToStep2($event)">Зарегистрироваться</MyButton>
    </form>
</template>

<script>
import UserService from '@/services/UserService';

import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';

export default {
    components:{
        MyButton,
        InputIcon
    },
    props: ['user'],
    data() {
      return {
        errors:[],
        name: '',
        surname: '',
        login:'',
        password:'',
        passwordR:'',
        wrongData:[],
        userNotExist: false,
        userFind: null
      }
    },
    methods: {
        goToStep2(e) {
            //Имя
            if(this.name == '' || this.name.length < 2 || this.name.length > 30){
                this.wrongData.push('name')
            }else{
                if(this.wrongData.includes('name')) this.wrongData.splice(this.getIndex(this.wrongData, 'name'), 1)
            }
            //Фамилия
            if(this.surname == '' || this.surname.length < 2 || this.surname.length > 30){
                this.wrongData.push('surname')
            }else{
                if(this.wrongData.includes('surname')) this.wrongData.splice(this.getIndex(this.wrongData, 'surname'), 1)
            }
            //Логин
            if(this.login == '' || this.login.length < 3 || this.login.length > 30){
                this.wrongData.push('login')                
            }else{
                if(this.wrongData.includes('login')) this.wrongData.splice(this.getIndex(this.wrongData, 'login'), 1)
            }
            //Пароль
            if(this.password == '' || this.password.length < 3 || this.password.length > 30){
                this.wrongData.push('password')
            }else{
                if(this.wrongData.includes('password')) this.wrongData.splice(this.getIndex(this.wrongData, 'password'), 1)
            }

            if(this.wrongData.length == 0 && this.userNotExist){
                this.$emit('updateUser', {
                    name: this.name,
                    surname: this.surname,
                    login: this.login,
                    password: this.password
                })
                this.$router.push("/registration/step-2")
            }
            
            e.preventDefault()
        },
        getIndex(list, str) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === str) {
                    return i;
                }
            }
            return -1;
        },
        checkExistLogin(){
            UserService.findUserByLogin(this.login).then(response =>{
                if(response.status == 200 && response.data != ''){
                    this.userNotExist = false                     
                    this.userFind = response.data
                }
                else{
                    this.userNotExist = true
                    this.userFind = null
                }
            })
        }
    },
    created() {
        this.name = this.$props.user.name
        this.surname = this.$props.user.surname
        this.login = this.$props.user.login
        this.password = this.$props.user.password
        this.passwordR = this.$props.user.password
    },
    watch:{
        'login'(){
            this.checkExistLogin()
        }
    }
  
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    max-width: 30%;  
    margin: auto;
    /* margin-top: 7%; */
    margin-top: 60px;
    background-color: #ffffff50;
    border-radius: 30px; 
    border: 1px solid;
    border-color: #D276FD;
}
.btn{
    margin: 30px 50px;
    padding: 10px 70px;
}
.error{
    padding: 2px;
    background-color: #ffb6b6;
    margin: 0px 50px;
    
    border-radius: 2px;
    border-color: #ed5656;
    display: flex;
}

label{
  font-size: 11.5pt;
  color: #b10000;
}
</style>