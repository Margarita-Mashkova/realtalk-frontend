<template>
    <form @submit.prevent>
        <h4>Установите фото профиля</h4>        
        <input @change="onFileChange" id="file" type="file" accept="image/*">        
        <label for="file">
            <span class="input-file-btn">Выберите файл</span>
        </label>            
        <div class="image-area">
            <img src="../assets/profile-photo.png">
        </div>
        <div class="error" v-if="file==null && !skip">
            <label>Необходимо выбрать фото</label>
        </div>     
        <div class="btn-bar">
            <!-- "Успешная регистрация" попа окно -->
            <MyButton @click="goToLogin(false, $event)">Пропустить</MyButton>            
            <MyButton @click="goToLogin(true, $event)">Готово</MyButton>
        </div>        
    </form>
</template>

<script>
import MyButton from './MyButton.vue';
export default {
    components:{
        MyButton
    },
    props: ['user'],
    data() {
        return {
            file: null,
            skip: true,
        }
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
                var preview = document.querySelector("#app > form > div.image-area > img")
                vm.image = e.target.result;
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            this.file = file;
        },
        goToLogin(flag, e){
            if (flag) {
                this.skip = false
                if(this.file != null){
                    this.$emit('updateUser', {
                    file: this.file,
                    })
                    this.$emit('registerUser')
                }
            }
            else{
                this.$emit('registerUser')
            }            
            e.preventDefault()
        }
    },
    created(){
        if(this.$props.user.file!=null){
            this.createImage(this.$props.user.file)
            this.file = this.$props.user.file
        }
    },
    unmounted() {
        this.$emit('updateUser', {
            file: this.file,
        })
    }  
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    width: 35%;
    margin: auto;
    margin-top: 10%;
    background-color: #ffffff50;
    border-radius: 30px; 
    border: 1px solid;
    border-color: #D276FD;
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

input{
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
}
img{
    width: auto;
    height: 100%;
    margin: 0 auto;
}
.error{
    padding: 2px;
    background-color: #ffb6b6;
    margin: 10px 50px 0px 50px;
    align-self: center;
    border-radius: 2px;
    border-color: #ed5656;
    display: flex;    
}

label{
  font-size: 11.5pt;
  color: #b10000;
}

/*::-webkit-file-upload-button {
    padding: 10px;
    font-family: Georgia, serif;
    font-size: 10pt;
    color: white;
    border-radius: 50px;
    background-color: #D276FD;
    border-color: #D276FD;
    text-align: center;
}*/
</style>