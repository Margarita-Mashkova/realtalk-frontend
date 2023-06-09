<template>
    <form @submit.prevent>
        <div>
            <h4>Введите название чата</h4>    
            <InputIcon
            v-model="surname"
            :type = "'text'"
            :placeholder = "'Фамилия'"
            :src = "'name.png'"
            :width = "'18'"
            :height = "'18'"
            />
        </div>
        <div>
            <h4>Установите фото чата</h4>        
            <input @change="onFileChange" id="file" type="file" accept="image/*">        
            <label for="file">
                <span class="input-file-btn">Выберите файл</span>
            </label>            
            <div class="image-area">
                <img src="../assets/profile-photo.png">
            </div>
        </div>
        
        <div class="btn-bar">
            <MyButton @click="createChat($event)">Создать</MyButton>            
        </div>        
    </form>
</template>

<script>
import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';

export default{
    components:{
        MyButton,
        InputIcon
    },
    data() {
        return {
            file: null,
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
        createChat(e){
            e.preventDefault()
        }
    },
}
</script>

<style scoped>
</style>