<template>
    <div class="comment-container">
        <div class="user">
            <div class="user-profile">
                <img class="user-photo"
                 v-if="this.comment.user.photo"
                 v-bind:src= "'/photos/'+ this.comment.user.photo"
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
                    <router-link :to="'/'+comment.user.login">@{{ comment.user.login }}</router-link>
                    <div>
                        <div class="comment-text" v-if="comment.text != ''">
                            <label>{{ comment.text }}</label>
                        </div>          
                    </div>                   
                </div>
            </div>
            <div>                
                <div class="btns-bar" v-if="comment.user.login == this.me.login">                
                    <img class="icon" src="../assets/edit.png" width="20" height="20" @click="this.$emit('editComment', comment)">
                    <img class="icon" src="../assets/delete.png" width="20" height="20" @click="this.$emit('deleteComment', comment.id)">
                </div>
                <div class="btns-bar" v-else-if="post.user.login == this.me.login">
                    <img class="icon" src="../assets/delete.png" width="20" height="20" @click="this.$emit('deleteComment', comment.id)">
                </div> 
            </div>            
        </div>
        
        <div class="likes-container">
            <label style="font-size: 10pt; margin-left: 70px;">{{comment.date}}</label> 
            <div class="likes">                
                <img v-if="!likedByMe" src="../assets/unlike.png" width="20" height="22" @click="this.like" :class="{'animated': animated}">
                <img v-else src="../assets/like.png" width="20" height="22" @click="this.like" :class="{'animated': animated}">
                <label class="likes-count">{{this.likesCount + likedByMe}}</label>
            </div>
        </div>
    </div>
</template>

<script>
import CommentService from "@/services/CommentService";
import UserService from "@/services/UserService";

export default{
    data(){
        return {
            me:{},
            likedByMe: false,
            animated: false,
            likesCount: Number,
            editMode: false
        }
    },
    props: {
        comment: {
            id: Number,
            text: "",
            date: "",
            user: {},
            likes: {}
        },
        post:{}
    },
    methods: {        
        like() {
            CommentService.likeComment(this.comment.id).then((response)=>this.likedByMe=response.data)
            this.animated = true;
            setTimeout(() => {
                this.animated = false;
            }, 500); // 1 second animation duration
        },        
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.me = response.data
                if (this.comment.likes.map(user => user.login).includes(this.me.login)) {
                    this.likedByMe = true
                    this.likesCount = this.comment.likes.length-1
                }
                else{
                    this.likesCount = this.comment.likes.length
                }
            }
        })
    }
}
</script>

<style scoped>
.comment-container{
    display: flex;
    flex-direction: column;
    background-color: white;
    font-family: Georgia, serif;
    font-size: 12pt;
    padding: 15px 30px;
    border-top: 1px solid;
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

.comment-text{    
    margin: 10px 0px 10px 0px;
    text-align: left;
    text-align: justify;
}

label{
    text-align: left;
}

.likes-container{
    display: flex;
    justify-content: space-between;
}

.likes{
    display: flex; 
    margin-right: 10px;
    cursor: pointer;
    transition: all 1s ease-out;
}

.likes-count{
    margin-left: 6px;
}

img{
    align-self: center;
}

.icon{
    margin-right: 3px;
    cursor: pointer;
}

.animated {
  transform: rotate(360deg) scale(1.5);
}

.comment-create textarea{
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
.comment-create{
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

.comment-create button{
    padding: 10px;
    min-width: 150px;
    font-family: Georgia, serif;
    align-self: center;
}

.comment-create-form{
    display: flex;
    flex-direction: column;
    flex: auto;
    margin-right: 10px;
}

.input-file-btn {
	position: relative;
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

.btns-bar{
    display: flex;
    justify-content: flex-end;
}

span{
    align-self: center;
}
</style>