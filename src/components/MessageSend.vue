<template>
    <div class="sms-create">
        <textarea @keyup.enter.exact="createOrEdit" :class="{flash: focusOnTextArea}" ref="text-area" v-model="text" type="text" placeholder="Напишите сообщение..."></textarea>
        <div>
            <img @click="createOrEdit" src="../assets/send.png" width="35" height="35">
            <MyButton v-if="this.internalMessage" @click="cancel">Отменить</MyButton>
        </div>
        <input @change="onFileChange" id="file" type="file">
        <label for="file" class="input-file-btn"  v-bind:class="{ disabled: fileDisabled }">
            <div class="label-photo">
                <img src="../assets/file.png" width="20" height="20">
                <span>Файл</span>
            </div>
        </label>
    </div>
    <div class="message-file" v-if="this.file != null">
        <div v-if="this.file.type.startsWith('image')" class="image-area">
            <img @dblclick="removePhoto($event)">
        </div>
        <div v-else class="file-area">
            <div @dblclick="removePhoto($event)">
                <img src="../assets/file.png" width="20" height="20">
                <p>{{ this.file.name }}</p>
            </div>
        </div>
    </div>
    <div class="message-file" v-else-if="this.internalMessage?.file">
        <div v-if="this.internalMessage.isFileImage" class="image-area">
            <img v-bind:src="'/photos/'+this.internalMessage.file" @dblclick="removeAttachment($event)">
        </div>
        <div v-else class="file-area">
            <div @dblclick="removeAttachment($event)">
                <img src="../assets/file.png" width="20" height="20">
                <p>{{ this.internalMessage.file.split('.')[1]+'.'+this.internalMessage.file.split('.')[2]}}</p>
            </div>
        </div>
    </div>
    <div class="message-post-reply" v-else-if="this.internalMessage?.replyPost">
        <div class="post-reply-area">
            <div @dblclick="removeAttachment($event)">
                <p>Прикреплённый пост</p>
            </div>
        </div>
    </div>
    
</template>

<script>
import MyButton from './MyButton.vue'


export default {
    components:{
        MyButton
    },
    data(){
        return{
            text: '',
            internalMessage: null,
            file:null,
            binaryFile:null,
            isFileDeleted: false,
            fileDisabled:false,
            focusOnTextArea: false
        }
    },
    props:{
        messageEdit: null
    },
    methods:{
        createOrEdit() {
            if (!this.internalMessage && (this.text.trim()!=='' || this.file)) {
                this.$emit('createMessage', {
                    text: this.text,
                    file: this.file,
                    binaryFile: this.binaryFile
                })
                this.cancel()
            }
            else if(this.text.trim()!=='' || this.file || this.internalMessage?.replyPost || this.internalMessage?.file){
                this.$emit('editMessage', {
                    id : this.internalMessage.id,
                    text: this.text,
                    file: this.file,
                    binaryFile: this.binaryFile,
                    isFileDeleted: this.isFileDeleted,
                    isReplyDeleted: this.internalMessage.isReplyDeleted
                })
                this.cancel()
            }
            else{
                this.scrollToTextArea()
                this.flashingTextArea()
            }
        },
        flashingTextArea() {
            this.focusOnTextArea = true
            setTimeout(() => {
                this.focusOnTextArea = false
            }, 800);
        },
        cancel(){
            this.file=null
            this.binaryFile=null
            this.text=''
            this.internalMessage = null
            this.isFileDeleted = false
            document.getElementById('file').disabled = false;
            this.fileDisabled = false;
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
                if(file.type.startsWith("image")){
                    var preview = document.querySelector("#app > div.page-chat > div > div.message-file > div.image-area > img")
                    preview.src = e.target.result;
                }
                vm.binaryFile = e.target.result;
            };
            reader.readAsDataURL(file);
            this.file = file;
            this.isFileDeleted = false
        },
        removeAttachment(e){
            this.file=null
            if(this.internalMessage){
                this.internalMessage.file = null
                this.internalMessage.isFileImage = null
                this.isFileDeleted = true
                this.internalMessage.replyPost = null
                this.internalMessage.isReplyDeleted = true
            }
            e.preventDefault()
        },
        scrollToTextArea(){
            this.$refs["text-area"].scrollIntoView({ behavior: "smooth" })
            this.$refs["text-area"].focus({preventScroll :true})
        }
    },
    watch:{
        'messageEdit.key'() {
            this.internalMessage = JSON.parse(JSON.stringify(this.messageEdit)) 
            this.text = this.internalMessage.text
            if(this.internalMessage.replyPost){
                document.getElementById('file').disabled = true;
                this.fileDisabled = true;
            }
            else{
                document.getElementById('file').disabled = false;
                this.fileDisabled = false;
            }
            this.internalMessage.isReplyDeleted = false
            this.scrollToTextArea()
        },

    },
}
</script>

<style scoped>
.sms-create textarea{
    outline: none;
    padding: 10px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
    margin-right: 10px;
    font-family: Georgia, serif;
    resize: none;
}
.sms-create{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-inline: 10px;
    padding-block: 20px;
    background-color: #ffffff;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
}

.sms-create img{
    align-self: center;
    cursor: pointer
}

.input-file-btn {	
	display: inline-block;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	font-size: 10pt;
	vertical-align: middle;
	color: black;
	text-align: center;
	height: 40px;
	padding: 10px 42px;
	box-sizing: border-box;
	border: none;
	margin: 0;
	transition: background-color 0.2s;
    border-radius: 50px;    
    border: 1px solid;
    margin-bottom: 5px;
}

#file{
    display: none;
}

.btn-bar{
    display: flex;
    flex-direction: column;
}

.btn-bar img{
    margin-right: 10px;
}

span{
    align-self: center;
}

.label-photo{
    display: flex;
    align-items: center;
}

.image-area{
    border: 2px solid;
    align-self: center;
    border-color: #D276FD;
    border-radius: 10px;
    margin-block: 10px;
    margin-left: 2px;
    overflow: hidden;
    width: 50px;
    height: 50px;
    cursor: pointer
}

.file-area, .post-reply-area{
    border: 2px solid;
    align-self: center;
    border-color: #D276FD;
    border-radius: 10px;
    margin-block: 10px;
    margin-inline: 2px;
    height: 50px;
    cursor: pointer
}

.file-area div, .post-reply-area div{
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.image-area img{
    width: auto;
    height: 100%;
    margin: 0 auto;
    cursor: pointer;
}

.disabled{
    cursor:auto;
    background-color:#dddddd;
}

.flash { border-color: red !important }

</style>