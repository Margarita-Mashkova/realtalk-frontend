<template>
    <transition :name="modalClass">
        <div :class="modalClass">
            <div :class="`${modalClass}-backdrop`">
                <div :class="`${modalClass}-container`">
                    <div :class="`${modalClass}-content`">
                        <form @submit.prevent>
                            <div class="error" v-if="error">
                                <label>Выберите чат!</label>
                            </div>  
                            <h4>Выберите чат</h4>
                            <InputIcon v-model="search" class="input-icon" :type="'text'" :placeholder="'Поиск'"
                                :src="'search.png'" :width="'18'" :height="'18'" />
                            <div :class="`${modalClass}-scrollable`">
                                <div v-for='chat in filter' v-bind:key="chat.id" class="chats"  @click="this.choose(chat.id)">
                                    <MessageView :chat="chat" class="chat-choose"/>
                                    <input name="chat" type="radio" :checked="choosenChat==chat.id"
                                        :value="chat.id">
                                </div>
                            </div>
                            <textarea v-model="this.text" type="text" placeholder="Ваше сообщение..."></textarea>
                            <div>
                                <MyButton @click="sendReplyMessage($event)">Отправить</MyButton>
                                <MyButton @click="cancel($event)">Назад</MyButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </transition></template>
  
<script>
import MyButton from '../MyButton.vue';
import MessageView from "@/components/MessageView";
import InputIcon from "@/components/InputIcon"

import ChatService from "@/services/ChatService";

export default {
    data(){
        return{
            chats:[],
            text:'',
            choosenChat:null,
            search:'',
            error:false
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        modalClass: {
            type: String,
            default: 'simple-modal',
        },
        me: null,
        post: null,
        stompClient: null
    },
    components: {
        MyButton,
        MessageView,
        InputIcon
    },

    methods: {
        sendReplyMessage(e) {
            if(this.choosenChat){
                const message = {
                    user: { login: this.me.login },
                    text: this.text,
                    replyPost:{ id: this.post.id }
                };
                this.stompClient.send("/app/create-message/" + this.choosenChat, {}, JSON.stringify(message))
                this.$parent.toggleModalSendReply()
            }
            else{
                this.error = true
            }
            
            e.preventDefault()
        },
        cancel(e) {
            this.$parent.toggleModalSendReply()
            e.preventDefault()
        },
        choose(chatId){
            this.choosenChat=chatId
        }
    },
    mounted() {
        ChatService.getChatsByUser().then((response) => {
            if (response.status == 200) {
                this.chats = response.data
            }
        });
    },
    computed: {
        filter() {
            let usersInChat = this.chats.filter(chat=>chat.isPrivate).map(chat => chat.users)

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
                (chat.users?.withName?.toLowerCase())?.indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
                || (chat.users?.withSurname?.toLowerCase())?.indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
                || (chat.users?.withName?.toLowerCase() + ' ' + chat.users?.withSurname?.toLowerCase())?.indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
                || (chat.users?.withLogin?.toLowerCase())?.indexOf(this.search.toLowerCase().trim()) !== -1 && chat.isPrivate == true
                || (chat.name.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1)
        }

    }
}
</script>
  
<style lang="scss" scoped>
.simple-modal {
    &-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        transition: opacity 0.3s ease;
        z-index: 9999;
    }

    &-container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: auto;
        margin: 16px;
    }

    &-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        max-width: 700px;
        margin: 1.75rem auto;
        padding: 20px 30px;
        border-radius: 5px;
        color: #000;
        background-color: #fff;
        box-sizing: border-box;
        transform: translate(0, 0);
        transition: all 0.3s ease;
    }
    &-scrollable{
        overflow-y:scroll;
        max-height: 300px;
        border: 2px solid;
        border-radius: 5px;
        border-color: #D276FD;
    }


    h4 {
        font-family: 'Georgia';
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 55px;
        text-align: center;
        letter-spacing: 0.01em;
        margin-block: 20px !important;
    }

    .btn {
        padding: 10px;
        min-width: 170px;
        margin-top: 30px;
        margin-bottom: 30px;
        margin-inline: 10px;
    }
    textarea{
        outline: none;
        padding: 10px;
        width: -webkit-fill-available;
        min-height: 70px;
        background-color: #ffffff;
        border: 1px solid;
        border-radius: 10px;
        border-color: #D276FD;
        font-family: Georgia, serif;
        resize: none;
        margin-top: 12px;
    }
    .chats{
        background-color: white;
        border: 1px solid;
        border-color: #D276FD;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .chat-choose {
        border: none;
        width: 100%;
    }
    input[type=radio] {
        -ms-transform: scale(3);
        /* IE */
        -moz-transform: scale(3);
        /* FF */
        -webkit-transform: scale(3);
        /* Safari and Chrome */
        -o-transform: scale(3);
        /* Opera */
        transform: scale(3);
        accent-color: #c34ff8;
        margin-right: 30px;
    }
    .input-icon{
        margin: 0px !important;
        width: -webkit-fill-available;
        margin-bottom: 12px !important;
    }

    label{
        font-size: 11.5pt;
        color: #b10000;
    }
    &-enter,
    &-leave-to {
        opacity: 0;
    }

    &-enter-active,
    &-leave-active {
        transition: opacity 0.2s ease;
    }
}
</style>