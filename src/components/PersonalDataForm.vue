<template>
    <form @submit.prevent>
        <h4>Личные данные</h4>
        <div class="image-area">
            <img 
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
        <input @change="onFileChange" id="file" type="file" accept="image/*">
        <label for="file">
            <span class="input-file-btn">Выберите файл</span>
        </label>        
        <InputIcon
        v-model = "user.name"
        :type = "'text'"
        :placeholder = "'Имя'"
        :src = "'name.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <InputIcon
        v-model = "user.surname"
        :type = "'text'"
        :placeholder = "'Фамилия'"
        :src = "'name.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <InputIcon
        v-model = "user.borthdate"
        :type = "'date'"
        :placeholder = "'Дата рождения'"
        :src = "'cake.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <InputIcon
        v-model = "user.city"
        :type = "'text'"
        :placeholder = "'Город'"
        :src = "'city.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <MyButton @click="editPersonalData($event)">Изменить</MyButton>
    </form>
</template>

<script>
import UserService from "@/services/UserService";

import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';

import NProgress from "nprogress";

export default {
    data(){
        return {
            user:{
                name:"",
                surname:"",
                city:"",
                borthdate: "",
                photo: null
            },            
        }
    },
    components: {
        MyButton,
        InputIcon
    },
    methods:{
        onFileChange(e) {
            console.log(e)
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0]);
        },
        createImage(file) {
            
            var reader = new FileReader();
            var vm = this;
            
            reader.onload = (e) => {
                var preview = document.querySelector("#app > div.page-edit > div > div.route > form > div.image-area > img")
                vm.image = e.target.result;
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            this.user.photo = file
        },
        editPersonalData(e){
            console.log(this.user)
            UserService.editProfile(this.user).then((response)=> {
            if(response.status == 202) {
                this.user = response.data
                console.log(this.user)
            }          
            }) 
            e.preventDefault();
        }
    },
    mounted(){
        UserService.me().then((response)=> {
          if(response.status == 200) {            
            this.user = response.data
            if(this.user.borthdate!=null){
                this.user.borthdate = new Date(this.user.borthdate)
            }
          } 
          NProgress.done(true)         
        })
    },    
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
}
.btn{
    margin: 30px 50px;
    padding: 10px 70px;
}

input{
    display: none;
}

.input-file-btn {	
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
    border: 0.5px solid;
    border-color: #D276FD;
    margin-bottom: 20px;
    margin-top: 10px;
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
}
img{
    width: auto;
    height: 100%;
    margin: 0 auto;
}
h4{
    margin: 30px;
}
</style>