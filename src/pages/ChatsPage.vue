<template>
    <PageHeader/>
    <div class="page-chats">        
        <div class="chats-list">
            <div class="input-block">
                <InputIcon
                v-model="search"
                class="input-icon"
                :type = "'text'"
                :placeholder = "'Поиск'"
                :src = "'search.png'"
                :width = "'18'"
                :height = "'18'"
                />
                <MyButton @click="createChat">Создать чат</MyButton>
            </div>
           
            <div v-for='chat in filter' v-bind:key="chat.id">
                <MessageView :chat="chat" @click="click(chat.id)" class="chat"/>               
            </div>
            <div v-if="!bot">
                <p>Не с кем пообщаться? </p>
                <MyButton @click="createChatWithBot($event)">Поговорите с Чаттером!</MyButton>
            </div>            
        </div>        
    </div>
</template>
  
<script>
import ChatService from "@/services/ChatService";

import PageHeader from "@/components/PageHeader";
import MessageView from "@/components/MessageView";
import InputIcon from "@/components/InputIcon";
import MyButton from "@/components/MyButton";
import UserService from "@/services/UserService";

import NProgress from "nprogress";
export default {
    data(){
        return {
            chats:[],
            chat:{},
            bot:null,
            search:'',
            me:{}
        }
    },
    components: {
        PageHeader,
        MessageView,
        InputIcon,
        MyButton
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData() {
            ChatService.getChatsByUser().then((response) => {
                if (response.status == 200) {
                    this.chats = response.data
                    let usersInChat = this.chats.map(chat => chat.users)
                    usersInChat.forEach(userInChat => {
                        userInChat.forEach(user => {
                            if (user.login === "bot") {
                                this.bot = user
                            }
                        });
                    });
                    
                }
                NProgress.done(true)
            })

            UserService.me().then((response) => {
                if (response.status == 200) {
                    this.user = response.data
                    this.choosen = this.user.tags
                }
            })
        },
        click(chatId, e){
            ChatService.getChatById(chatId).then((response)=> {
                if(response.status == 200) {            
                    this.chat = response.data
                }
            })
            this.$router.push('/chat'+'/'+chatId)            
            e.preventDefault()
        },
       
        createChatWithBot(e) {
            UserService.getUserProfile("bot").then((response) => {
                let chat = { name: '', isPrivate: true, userIds: [response.data.id] }
                ChatService.createChat(chat).then((response) => {
                    this.$router.push('/chat/' + response.data.id)
                })
            })
            e.preventDefault()
        },
        createChat(){
            this.$router.push('/chat-create')
        }
    },
    computed: {
        filter() {
            let usersInChat = this.chats.map(chat => chat.users)
            usersInChat.forEach(userInChat => {
                if (userInChat[0].login == this.me.login) {
                    userInChat.withName = userInChat[1].name
                    userInChat.withSurname = userInChat[1].surname
                    userInChat.withLogin = userInChat[1].login
                }
                else {
                    userInChat.withName = userInChat[0].name
                    userInChat.withSurname = userInChat[0].surname
                    userInChat.withLogin = userInChat[0].login
                }
            });
            
            return this.chats.filter(chat => 
            (chat.users.withName.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
            || (chat.users.withSurname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
            || (chat.users.withName.toLowerCase() +' '+chat.users.withSurname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
            || (chat.users.withLogin.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
            || (chat.name.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1)
        },
    },
    watch: {
        '$route'() {
            this.loadData()
        }
    }
}
</script>
  
<style scoped>
    .page-chats{
        display: flex;
        flex-direction: column;
    }
    
    .chats-list{
        margin: 0px 300px 20px 300px;
        padding: 0px 0px 20px 0px;
        background-color: white;
        border-radius: 10px;
        border: 1px solid;
        border-color: #D276FD;
        margin-top: 90px;
    }

    .input-icon{
        margin: 3px !important;
        border: 0px !important;
        width: 100%;
    }
    .chat{
        cursor: pointer;
    }
    .btn{
        padding: 10px;
        min-width: 150px;
        font-family: Georgia, serif;
        align-self: center;
    }
    .input-block{
        display: flex;
    }
</style>