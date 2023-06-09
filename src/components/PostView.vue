<template>
    <PopUpSendReplyVue
      v-show="isShowModalSendReply"
      @modalAction="onModalActionSendReply"
      :me="me"
      :stompClient="stompClient"
      :post="post"
    />
    <div class="post-container">
        <div class="post-area">
            <div class="user">
                <div class="user-profile" v-if="this.post.user">
                    <img class="user-photo"
                    v-if="this.post.user.photo"
                    v-bind:src= "'/photos/'+ this.post.user.photo"
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
                        <router-link :to="'/'+post.user.login">@{{ post.user.login }}</router-link>
                        <label style="font-size: 10pt;">{{post.date}}</label>
                    </div>
                </div>
                <div class="btns-bar" >
                    <img v-if="post.user.login == this.me.login" class="icon" src="../assets/edit.png" width="20" height="20" @click="onEditPostMode()">
                    <img v-if="post.user.login == this.me.login" class="icon" src="../assets/delete.png" width="20" height="20" @click="this.$emit('deletePost', post.id)">
                    <img class="icon" src="../assets/reply.png" width="22" height="22" @click="toggleModalSendReply">
                </div>
            </div>

            <div v-if="!editMode">
                <div class="post-text" v-if="post.text != ''">
                    <label>{{ post.text }}</label>
                </div>
                <div class="post-photo" >
                    <div class="image-area-post-photo" v-if="post.photo != null">
                        <img v-bind:src= "'/photos/'+ post.photo">
                    </div>
                </div>
                <div class="post-tags">
                    <div v-for="tag in post.tags" v-bind:key="tag">
                        <label>#{{tag}}</label>
                    </div>
                </div>            
            </div>

            <div class="post-create" v-else>
                <div class="post-create-form">
                    <textarea v-model="this.$props.post.text" type="text"></textarea>
                    <div id="tags-checkbox">
                        <div class="category" v-for="cat in categories" v-bind:key="cat.tag">
                            <input
                                type="checkbox" 
                                :value="cat.tag"
                                v-model="choosen"
                                :checked="choosen.includes(cat)"
                                >
                            <label>{{ cat.tag }}</label>
                        </div>                           
                    </div>
                    <div class="error" v-if="this.choosen.length == 0 & (this.file != null || this.postText != '')">
                                <label>*Выберите хотя бы один тег к посту</label>
                            </div>
                    <div class="postPhoto" v-if="this.post.photo !=null & this.file!=null">
                        <div class="image-area-edit">
                            <img v-bind:src= "'/photos/'+ this.file" @dblclick="removePhoto($event)" >
                        </div>
                    </div>
                    <div class="postPhoto" v-else-if="this.file !=null">
                        <div class="image-area-edit">
                            <img @dblclick="removePhoto($event)">
                        </div>
                    </div>
                </div>
                <div class="btn-bar">
                    <input @change="onFileChange($event)" id="photo" type="file" accept="image/*">
                    <label for="photo" class="input-file-btn">
                        <div class="label-photo">
                            <img src="../assets/photo.png" width="20" height="16">
                            <span>Фото</span>
                        </div>                                
                    </label>                          
                    <MyButton @click="doEditPost($event)" >
                        Изменить
                    </MyButton>
                </div>
            </div>

            <div class="likes-comms">
                <div class="likes">                
                    <img v-if="!likedByMe" src="../assets/unlike.png" width="20" height="22" @click="this.like" :class="{'animated': animated}">
                    <img v-else src="../assets/like.png" width="20" height="22" @click="this.like" :class="{'animated': animated}">
                    <label class="likes-count">{{this.likesCount+likedByMe}}</label>
                </div>
                <div class="comms" @click="showComments($event)">
                    <img src="../assets/comment.png" width="16" height="16">
                    <label class="comms-count">{{post.comments.length}}</label>
                </div>
            </div>

        </div>
        <div class="comments" v-if="showComms">
            <div class="comment" v-for="comment in post.comments" v-bind:key="comment.id">
                <CommentView :comment="comment" :post="post" @editComment="onEditCommentMode($event)" 
                @deleteComment="onDeleteComment($event)"></CommentView>
            </div>
            <div class="comment-create">
                <textarea v-model="this.newComment.text" type="text" placeholder="Оставьте комментарий..."></textarea>
                <div>
                    <div v-if="editModeComment">
                        <img @click="cancelEditComment($event)" src="../assets/cancel.png" width="35" height="35">
                    </div>                    
                    <img @click="createOrEditComment($event)" src="../assets/send.png" width="35" height="35">
                </div>
            </div>
        </div>      
    </div>
    
</template>

<script>
import UserService from "@/services/UserService";
import PostService from "@/services/PostService";

import MyButton from "@/components/MyButton";
import CommentView from "@/components/CommentView";
import CommentService from "@/services/CommentService";
import PopUpSendReplyVue from "@/components/pop-up/PopUpSendReply"
    export default{
    data(){
        return {
            me:{},
            likedByMe: false,
            animated: false,
            likesCount: Number,
            editMode: false,
            editModeComment: false,
            showComms: false,
            deletePhoto: false,
            categories:[
                {tag:"Природа"},
                {tag:"Животные"},
                {tag:"Люди"},
                {tag:"Спорт"},
                {tag:"Еда"},
                {tag:"Семья"},
                {tag:"Мода"},
                {tag:"Машины"},
                {tag:"Мемы"}
            ],
            file: null,
            choosen: [],
            newComment:{
                id: null,
                text:""
            },
            comments:[],
            isShowModalSendReply: false
        }
    },
    components:{
        MyButton,
        CommentView,
        PopUpSendReplyVue
    },
    props: {
        post:null,
        stompClient: null,
    },
    methods: {
        showComments(e){
            this.showComms = !this.showComms
            e.preventDefault()
        },
        createOrEditComment(e){
            const comment = {postId: this.post.id, text: this.newComment.text}
            if(this.newComment.id == null){
                CommentService.createComment(comment).then((response)=>{
                    this.comments.push(response.data)                
                })
            }
            else{
                CommentService.editComment(this.newComment.id, comment).then((response)=>{
                    this.comments.splice(this.getIndex(this.comments, this.newComment.id), 1, response.data)
                })
            }
            this.editModeComment = false
            this.newComment.text = ''
            e.preventDefault()
        },
        cancelEditComment(e){
            this.editModeComment = !this.editModeComment
            this.newComment.id = null
            this.newComment.text = ''
            e.preventDefault()
        },
        onDeleteComment(id, e){
            CommentService.deleteComment(id).then((response) => {
                if (response.status == 200) {
                    this.comments.splice(this.getIndex(this.comments, id), 1)
                }
            })
            e.preventDefault()
        },
        onEditCommentMode(data, e){
            this.editModeComment = true
            this.newComment.id = data.id
            this.newComment.text = data.text
            e.preventDefault()
        },
        like() {
            PostService.likePost(this.post.id).then((response)=>this.likedByMe=response.data)
            this.animated = true;
            setTimeout(() => {
                this.animated = false;
            }, 500); // 1 second animation duration
        },
        onEditPostMode(){
            if(this.editMode == false)
                this.editMode = true
            else
                this.editMode = false
        },        
        createImage(file) {
            
            var reader = new FileReader();
            var vm = this;
            
            reader.onload = (e) => {
                var preview = document.querySelector("#app > div.profile-body > div.profile-bottom > div.posts-form > div.post > div > div > div.post-create > div.post-create-form > div.postPhoto > div > img")
                vm.image = e.target.result;
                preview.src = e.target.result;
                
            };
            reader.readAsDataURL(file);
            this.file = file;

        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0]);
        },
        doEditPost(e){
            if(((this.post.text != null && this.post.text != "") || (this.file!=null)) && this.choosen.length != 0){
                this.editMode = false
                if(this.post.photo != null && !this.deletePhoto && this.post.photo == this.file){
                    console.log(this.post.photo)
                    this.$emit('editPost', {post: this.post, file: this.createImage(this.post.photo), tags: this.choosen, deletePhoto: this.deletePhoto})
                }
                else{
                    this.$emit('editPost', {post: this.post, file: this.file, tags: this.choosen, deletePhoto: this.deletePhoto})
                }                
            }
            e.preventDefault()
        },
        removePhoto(e){
            this.file=null
            this.deletePhoto = true
            e.preventDefault()
        },
        getIndex(list, id) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        toggleModalSendReply(){
            this.isShowModalSendReply = !this.isShowModalSendReply;
        },
    
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.me = response.data
                if (this.post.likes.map(user => user.login).includes(this.me.login)) {
                    this.likedByMe = true
                    this.likesCount = this.post.likes.length-1
                }
                else{
                    this.likesCount = this.post.likes.length
                }
            }
        }),
        this.file = this.post.photo
        this.choosen = this.post.tags
        this.comments = this.post.comments        
    }
}
</script>

<style scoped>
.post-container{
    display: flex;
    flex-direction: column;    
    min-height: 150px;
    font-family: Georgia, serif;
    font-size: 12pt;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
}

.post-area{
    padding: 25px 30px 5px 30px;
}

.user{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
}

.user-profile{
    display: flex;
    flex-direction: row;
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

.btns-bar{
    display: flex;
    align-self: self-start;
}

a{
    text-decoration: none;
    color: black;
}

a:hover {
  color: #D276FD;
}

.post-text{    
    margin: 10px 0px 10px 0px;
    text-align: left;
    text-align: justify;
}

label{
    text-align: left;
}

.likes-comms{
    display: flex;
    margin-bottom: 15px;
}

.likes{
    display: flex;
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50px;
    padding: 5px 15px;
    margin-right: 10px;
}

.comms{
    display: flex;
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50px;
    padding: 5px 15px;
}

.likes-count, .comms-count{
    margin-left: 6px;
}

img{
    align-self: center;
}

.icon{
    margin-right: 10px;
    cursor: pointer;
}

.image-area-post-photo{
    overflow: hidden;
    width: 500px;
    height: 500px;
}

.image-area-post-photo img{
    width: auto;
    height: 100%;
    margin: 0 auto;    
}

.post-photo{
    /* align-self: center; */
    margin: 5px 0px 20px 0px;
}

.likes, .comms{
    cursor: pointer;
    transition: all 1s ease-out;
}

.animated {
  transform: rotate(360deg) scale(1.5);
}

.post-create textarea{
    outline: none;
    padding: 10px;
    /* width: 100%; */
    min-height: 70px;
    background-color: #ffffff;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
    font-family: Georgia, serif;
    resize: none;
}
.post-create{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-block-end: 10px;
    padding-inline: 10px;
    padding-block: 20px;
    background-color: #ffffff;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
}

.post-create button{
    padding: 10px;
    min-width: 150px;
    font-family: Georgia, serif;
    align-self: center;
}

.post-create-form{
    display: flex;
    flex-direction: column;
    flex: auto;
    margin-right: 10px;
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

#photo{
    display: none;
}

#tags-checkbox{
    font-family: Georgia, serif;
    font-size: 11pt;
    align-self: flex-start;
    margin-top: 10px;
    display: flex;
    flex-flow: wrap;
}

#tags-checkbox label{
    margin-left: 3px;
    margin-top: 3px;
}

.btn-bar{
    display: flex;
    flex-direction: column;
}

.btn-bar img{
    margin-right: 10px;
}


.label-photo{
    display: flex;
    align-items: center;
}

.image-area, .image-area-edit{
    border: 2px solid;
    align-self: center;
    border-color: #D276FD;
    margin-top: 10px;
    margin-left: 2px;
    overflow: hidden;
    width: 50px;
    height: 50px;
}

.image-area, .image-area-edit img{
    width: auto;
    height: 100%;
    margin: 0 auto;
}

.image-area-edit{
    cursor: pointer;
}

span{
    align-self: center;
}

.post-tags{
    display: flex;
    margin-bottom: 15px;    
}

.post-tags label{
    margin-right: 5px;
    border: 1px solid;
    border-color: #D276FD;
    border-radius: 50px;
    padding: 5px 15px;
}

.comment-create textarea{
    resize: none;
    outline: none;
    padding: 10px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid;
    border-radius: 10px;
    border-color: #D276FD;
    margin-right: 10px;
    font-family: Georgia, serif;
    min-height: 50px;
}
.comment-create{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 30px;
    padding-block: 20px;
    border-top: 1px solid;
    border-color: #D276FD;
}

.comment-create img{
    align-self: center;
    cursor: pointer;
}

.error{
    padding: 2px;
    margin: 4px 0px 0px 2px;
    border-radius: 2px;
    border-color: #ed5656;
    display: flex;
}

.error label{
  font-size: 11.5pt;
  color: #b10000;
}
</style>