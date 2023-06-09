<template>
    <div id="navbar">        
        <ul class="navbar-list">
            <li>
                <router-link :to="'/feed'">
                    <img src="../assets/realtalk.png" width="60" height="45" >
                </router-link>
            </li>
            <li>
                <img src="../assets/news.png" width="20" height="20">
                <router-link :to="'/feed'">Новости</router-link>
            </li>
            <li>
                <img src="../assets/profile.png" width="20" height="20">
                <router-link :to="'/'+this.login">Мой профиль</router-link>
            </li>
            <li>
                <img src="../assets/message.png" width="20" height="20">
                <router-link :to="'/chats'">Сообщения</router-link>
            </li>
            <li>
                <img src="../assets/subscriptions.png" width="20" height="20">
                <router-link :to="'/subscriptions'">Подписки</router-link>
            </li>
            <li>
                <img src="../assets/search.png" width="20" height="20">
                <router-link :to="'/search'">Поиск</router-link>
            </li>
            <div class="navbar-item-last">
                <li>
                    <img src="../assets/exit.png" width="20" height="20">
                    <router-link :to="'/auth'" @click="logout()">Выйти</router-link>
                </li>
            </div>
        </ul>
    </div>
</template>

<script>
import UserService from "@/services/UserService";
export default {
    data(){
        return{
            login:{}
        }
    },
    methods:{
        logout(){            
            localStorage.setItem('jwt', null)
            console.log(localStorage.getItem('jwt'))
            this.$router.push('/auth')
        },
        getUserLogin(){
            return '/'+this.login
        }
    },
    mounted(){
        UserService.me().then((response)=> {
          if(response.status == 200) {            
            this.login = response.data.login 
          }          
        })       
    }
  
}
</script>

<style scoped>
/* .sticky {
  width: 100%;
} */

#navbar{
    position: fixed;
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: white;
    border: 1px solid;
    border-color: #D276FD;
    font-family: Georgia, serif;
    font-size: 12pt;
    z-index: 1;
}
.navbar-list{
    display: flex;
    flex-direction: row;
    margin: 10px;
    margin-left: 30px;
}
li{
    display: flex;
    list-style-type: none;
    margin-right: 20px;
    align-self: center;  
}
a{
    text-decoration: none;
    color: black;
    margin-left: 5px;
    align-self: center;
}
.navbar-item-last{
    display: flex;
    align-self: center;
    position: absolute;
    right: 20px;
}
li a:hover {
  color: #D276FD;
}
</style>