<template>
    <div class="message-container" @click="$emit('click')">
        <div v-if="chat!=null" class="user">
            <div class="user-profile">
                <img class="user-photo"
                 v-if="this.chat.image"
                 v-bind:src= "'/photos/'+ this.chat.image"
                 width="50" 
                 height="50"
                 >
                <img class="user-photo"
                v-else-if="this.chat.isPrivate && this.withUser().photo"
                v-bind:src= "'/photos/'+ this.withUser().photo"
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
                    <label class="username" 
                    v-if="this.chat.isPrivate">{{ this.withUser().name }} {{ this.withUser().surname }}</label>
                    <label class="username" v-else>{{ this.chat.name }}</label>
                    <label class="message-text">{{ this.getLastMessage() }}</label>
                </div>
            </div>
            
            <div class="date">
                <label style="font-size: 11pt;">{{this.getLastMessageDate()}}</label>
            </div>            
        </div>

        <div v-else class="user">
            <div class="user-profile">
                <img class="user-photo"
                 v-if="this.message.user.photo"
                 v-bind:src= "'/photos/'+ this.message.user.photo"
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
                    <label class="username">{{ this.message.user.name + ' '+ this.message.user.surname }}</label>
                    <label class="message-text">{{ this.message.text }}</label>
                    <div v-if="this.message.file">
                        <img v-if="this.message.isFileImage" class="message-image" v-bind:src= "'/photos/'+ this.message.file">
                        <a v-else v-bind:href= "'/photos/'+ this.message.file" class ="message-file" target="_blank">
                            <img src="../assets/file.png" width="20" height="20">
                            <p>{{ this.message.file.split('.')[1]+'.'+this.message.file.split('.')[2]}}</p>
                        </a>
                    </div>
                    <ReplyPostView v-if="this.message.replyPost" :post="this.message.replyPost" class="reply" @click="goToPost(this.message.replyPost)"/>
                </div>
            </div>
            <div>
                <div class="date">
                    <label style="font-size: 11pt;">{{this.message.date}}</label>
                </div> 
                <div class="btns-bar" v-if="message.user.login == this.me.login">
                    <img class="icon" src="../assets/edit.png" width="20" height="20" @click="this.$emit('editMessageEvent', message)">
                    <img class="icon" src="../assets/delete.png" width="20" height="20" @click="this.$emit('deleteMessage', message.id)">   
                </div>
            </div>
                 
        </div>
    </div>
</template>

<script>
    import UserService from "@/services/UserService";
    import ReplyPostView from "./ReplyPostView.vue";

    export default{
    data() {
        return {
            me: {},
        };
    },
    props: {
        chat: null,
        message: null,
    },
    components: { ReplyPostView },
    methods: {
        getLastMessage() {
            if (this.chat.messages.length != 0) {
                let lastMessage = this.chat.messages[this.chat.messages.length - 1];
                let text = lastMessage.text;
                let owner = lastMessage.user.name + " " + lastMessage.user.surname;
                return owner + ": " + text;
            }
            return "";
        },
        getLastMessageDate() {
            if (this.chat.messages.length != 0) {
                let date = this.chat.messages[this.chat.messages.length - 1].date;
                return date;
            }
            return "";
        },
        withUser() {
            if (this.chat.users[0].login == this.me.login) {
                return this.chat.users[1];
            }
            else {
                return this.chat.users[0];
            }
        },
        goToPost(post){
            this.$router.push("/"+post.user.login+"?post="+post.id)
        },
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.me = response.data;
            }
        });
    },
    
}
</script>

<style scoped>
.message-container{
    display: flex;
    flex-direction: column;
    background-color: white;
    font-family: Georgia, serif;
    font-size: 12pt;
    border-top: 1px solid;
    border-bottom: 1px solid;
    padding: 15px 20px;
    border-color: #D276FD;
}

.user{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.user-profile{
    display: flex;
    flex-direction: row;
}

.user-info{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 15px;
}
.user-photo{
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50%;
}

.username{
    margin-bottom: 5px;
}

.date{
    display: flex;
    align-self: self-start;
}

label{
    text-align: left;
}

.icon{
    cursor: pointer;
}
.message-file{
    align-self: center;
    border-color: #D276FD;
    margin-block: 10px;
    margin-inline: 2px;
    height: 50px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.reply{
    cursor: pointer;
}
.message-image{
    max-width: 500px;
    max-height: 500px;
}
</style>