<template>
    <div id="users-list" v-if="this.usersList" >
        <div class="title">
            <router-link :to="link">{{ title }}</router-link>
            <label class="subscr-count">{{ usersList.length }}</label>
        </div>
        <div class="user" v-for='user in usersList.slice(0,3)' v-bind:key="user.id">
            <img class="user-photo"
            v-if="user.photo"
            v-bind:src= "'/photos/'+ user.photo"
            width="50"
            height="50"
            >
            <img class="user-photo"
            v-else
            src= "../assets/profile-photo.png" 
            width="50" 
            height="50"
            >
            <div class="user-info">
                <router-link :to="user.login">{{ user.name }} {{ user.surname }}</router-link>
                <label>@{{user.login}}</label>
            </div>            
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                count: 0,
                newUsersList: [],
            }            
        },
        props:{
            usersList: [],
            title: String,
            link: String
        }
    }
    
</script>

<style scoped>
#users-list{
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
    font-family: Georgia, serif;
    font-size: 11pt;
    padding: 10px 10px;
    margin-bottom: 10px;
}

.title{
    align-self: self-start;
}

.user{
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 20px;
    padding: 6px 15px;
}
.user-info{
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: flex-start;
    margin-left: 15px;
}
.user-photo{
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50%;
}

a{
    text-decoration: none;
    color: black;
    margin-left: 5px;
    align-self: start;
}

a:hover {
  color: #D276FD;
}

.subscr-count{
    margin-left: 10px;
}
</style>