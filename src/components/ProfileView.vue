<template>
    <div class="profile-container">
        <div class="user-photo">
            <img class="img-photo"
            v-if="user.photo"
            v-bind:src= "'/photos/'+ user.photo"
            width="50" 
            height="50"
            >
            <img class="img-photo"
            v-else
            src= "../assets/profile-photo.png" 
            width="50" 
            height="50"
            >
        </div>
        <div class="user-info">
            <div class="name-surname">
                <label style="margin-right: 5px;">{{ user.name }}</label>
                <label>{{ user.surname }}</label>
            </div>
            <div class="nickname">
                <label>@{{ user.login }}</label>
            </div>            
            <div class="borthdate">
                <img class="icon" src="../assets/cake.png" width="20" height="20">
                <label>Дата рождения: {{ user.borthdate }}</label>
            </div>
            <div class="city">
                <img class="icon" src="../assets/city.png" width="20" height="20">
                <label>Город: {{ user.city }}</label>
            </div>
            <div class="post-count">
                <img class="icon" src="../assets/news.png" width="20" height="20">
                <label>Количество постов: {{ posts.length }}</label>
            </div>
            <div v-if="this.user.login==this.me.login">
                <MyButton  @click="goTo">Редактировать профиль</MyButton>
            </div>
            <div v-else>
                <MyButton v-if="isSubscription" @click="createChat($event)">Сообщение</MyButton> 
                <MyButton v-if="!isSubscription" @click="subscribe($event)">Подписаться</MyButton> 
                <MyButton v-if="isSubscription" @click="subscribe($event)">Отписаться</MyButton>                
            </div>
            
        </div>
    </div>
</template>

<script>
import UserService from "@/services/UserService";
import ChatService from "@/services/ChatService";

import MyButton from './MyButton.vue';
export default {
    components:{
        MyButton
    },
    data(){
        return{
            me:{},
            createdId: null,
            isSubscription: false,
            textButton: ""
        }
    },
    methods:{
        goTo(){
            this.$router.push("/edit-profile")
        },
        subscribe(e){
            UserService.subscribe(this.user.id).then((response)=>{
                if(response.status == 200){
                    if(response.data==true) {
                        this.isSubscription = true
                    }
                    else {
                        this.isSubscription = false
                    }
                }
            })
            e.preventDefault()
        },
        createChat(e){
            if(this.createdId!=null){
                this.$router.push('chat/'+this.createdId)
            }
            else{
                let chat = {name: '', isPrivate: true, userIds: [this.user.id]}
                ChatService.createChat(chat).then((response)=>{
                    this.$router.push('chat/'+response.data.id)
                })
                
            }
            e.preventDefault()
        },
        checkPrivateChat(chats){
            this.createdId = chats.find(chat=> chat.isPrivate==true &&chat.users.map(user=>user.id).includes(this.user.id))?.id
        },
        checkIsSubscription(){            
            this.me.subscriptions.forEach(sub => {
                if(sub.login == this.user.login)
                    this.isSubscription = true
            })
        },
        changeButtonName(){
            if(this.isSubscription)
                this.textButton = "Отписаться"
            else
                this.textButton = "Подписаться"
        }
    },
    props:{
        user:{},
        posts:{}
    },
    mounted(){
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.me = response.data
                if(this.me.login != this.user.login){
                    this.checkIsSubscription()
                }
            }
            ChatService.getChatsByUser().then((response) => {
                if (response.status == 200) {
                    this.checkPrivateChat(response.data)
                }
            })
        })

    },
    watch:{
        'isSubscription'(){
            this.changeButtonName()
        }
    }
}
</script>

<style scoped>
.profile-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    background-color: white;
    min-height: 250px;
    font-family: Georgia, serif;
    font-size: 12pt;
    border-radius: 10px;
    border: 1px solid;
    padding: 25px 30px;
    border-color: #D276FD;
}

.user-info{
    width: 50%;
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: flex-start;
}

.user-photo{
    /* width: 30%;
    border: 2px solid;
    border-color: #D276FD; */
    width: 250px;
    height: 250px;
    margin: 0 auto;
    overflow: hidden;
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50%;
}

.img-photo {
    width: auto;
    height: 100%;
    margin: 0 auto;
}

.name-surname{
    display: flex;
    flex-direction: row;
    margin-bottom: 0px;
}

.nickname{
    margin-bottom: 35px;
}

.borthdate{
    display: flex;
    margin-bottom: 20px;
}

.city{
    display: flex;
    margin-bottom: 20px;
}

.post-count{
    display: flex;
    margin-bottom: 35px;
}

label{
    text-align: left;
    align-self: center;
}

img{
    align-self: center;
}

.btn{
    padding: 10px 65px;
    margin-right: 10px;
}

.icon{
    margin-right: 10px;
}
</style>