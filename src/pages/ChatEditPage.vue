<template>
    <PageHeader />
    <div class="page-chat-edit">

        <div v-if="this.chat" class="page-chat-edit-body">
            <div>
                <h4>Введите название чата</h4>
                <InputIcon v-model="chatName" :type="'text'" :placeholder="'Чат'" :src="'name.png'" :width="'18'"
                    :height="'18'" />
            </div>
            <div>
                <h4>Установите фото чата</h4>
                <input @change="onFileChange" id="file" type="file" accept="image/*">
                <label for="file">
                    <span class="input-file-btn">Выберите файл</span>
                </label>
                <div class="image-area">
                    <img v-if="chat.image"
                        v-bind:src= "'/photos/'+ chat.image"
                    >
                    <img v-else src= "../assets/profile-photo.png" >
                </div>
                <MyButton @click="editChat($event)">
                    Изменить
                </MyButton>
            </div>
        </div>
    </div>
    
</template>

<script>
import UserService from "@/services/UserService";

import PageHeader from "@/components/PageHeader";
import InputIcon from "@/components/InputIcon";
import MyButton from "@/components/MyButton.vue";
import ChatService from "@/services/ChatService";

import NProgress from "nprogress";

export default {
    data() {
        return {
            user: {},
            file:null,
            chatName:'',
            chat:{}
        }
    },
    components: {
        PageHeader,
        InputIcon,
        MyButton
    },
    methods: {
        editChat(e){
            if(this.chatName!==''){
                let chat = { name: this.chatName, image: this.file }
                ChatService.editChat(this.chat.id ,chat).then((response) => {
                this.$router.push('/chat/' + response.data.id)
            })
            }
            
            e.preventDefault()
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0]);
        },
        createImage(file) {
            
            var reader = new FileReader();
            var vm = this;
            
            reader.onload = (e) => {
                var preview = document.querySelector("#app > div.page-chat-edit > div > div:nth-child(2) > div > img")
                vm.image = e.target.result;
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            this.file = file;
        },
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.user = response.data
            }
        })
        let chatId = this.$route.params.id
        ChatService.getChatById(chatId).then((response) => {
            if (response.status == 200) {
                this.chat = response.data
                this.chatName = this.chat.name
            }
            NProgress.done(true)
        })

    },
}
</script>

<style scoped>
.page-chat-edit {
    display: flex;
    flex-direction: column;
}

.page-chat-edit-body {
    margin: 15px 300px 20px 300px;
    padding: 0px 0px 20px 0px;
    background-color: white;
    border-radius: 20px;
    border: 1px solid;
    border-color: #D276FD;
    margin-top: 90px;
    margin-bottom: 100px;
}

.input-icon {
    margin: 5px !important;
    border: 0px !important;
}

input[type=checkbox] {
    -ms-transform: scale(5);
    /* IE */
    -moz-transform: scale(5);
    /* FF */
    -webkit-transform: scale(5);
    /* Safari and Chrome */
    -o-transform: scale(5);
    /* Opera */
    transform: scale(5);
    accent-color: #c34ff8;
    margin-right: 30px;
}

.btn{    
    padding: 10px;
    min-width: 150px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.btn-bar{
    display: flex;
    justify-content: space-evenly;
}

input[type=file]{
    display: none;
}

.input-file-btn {
	position: relative;
	display: inline-block;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	font-size: 10pt;
	vertical-align: middle;
	color: rgb(255 255 255);
	text-align: center;
	background-color: #D276FD;
	line-height: 22px;
	height: 40px;
	padding: 10px 20px;
	box-sizing: border-box;
	border: none;
	margin: 0;
	transition: background-color 0.2s;
    border-radius: 50px;    
    border: 1px solid;
    border-color: #D276FD;
    margin-bottom: 20px;
}

h4{
    margin: 30px;
}

.image-area{
    border: 2px solid;
    align-self: center;
    border-color: #D276FD;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 50%;
    width: 150px;
    height: 150px;
    margin-inline: auto;
}
img{
    width: auto;
    height: 100%;
    margin: 0 auto;
}

</style>