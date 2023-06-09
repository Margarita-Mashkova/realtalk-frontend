<template>
    <PageHeader/>
    <div class="profile-body" v-if="this.user.login === this.anotherUser.login && this.anotherUser && this.user">
        <ProfileView class ="profile-top" :user="this.user" :posts="this.posts"/>
        <div class="profile-bottom">
            <div class="posts-form">
                    <div class="post-create">
                        <div class="post-create-form">
                            <textarea v-model="this.postText" type="text" placeholder="Что у Вас нового?"></textarea>
                            <div id="tags-checkbox">
                                <div class="category" v-for="cat in categories" v-bind:key="cat">                                    
                                    <input
                                    type="checkbox" 
                                    :value="cat.tag"
                                    v-model="choosen"
                                    >
                                    <label>{{cat.tag}}</label>                
                                </div>                            
                            </div>
                            <div class="error" v-if="this.choosen.length == 0 & (this.file != null || this.postText != '')">
                                <label>*Выберите хотя бы один тег к посту</label>
                            </div>
                            <div class="postPhoto" v-if="this.file !=null">
                                <div class="image-area">
                                    <img @dblclick="removePhoto($event)">
                                </div>
                            </div>                            
                        </div>                        
                        <div class="btn-bar">
                            <input @change="onFileChange" id="file" type="file" accept="image/*">
                            <label for="file" class="input-file-btn">
                                <div class="label-photo">
                                    <img src="../assets/photo.png" width="20" height="16">
                                    <span>Фото</span>
                                </div>                                
                            </label>                          
                            <MyButton @click="createPost($event)">
                                Создать пост
                            </MyButton>
                        </div>
                    </div>
                    <div class="post" v-for='post in posts' v-bind:key="post.id">
                        <a :id="'post-' + post.id"></a>
                        <PostView :post="post" @deletePost ="onDeletePost($event)" @editPost ="onEditPost($event)" :stompClient="this.stompClient"/>
                    </div>
            </div>
            <div class="sub-sub" v-if="this.user.subscribers && this.user.subscriptions">
                <div class="subscriptions">
                    <SubcrList :usersList="user.subscriptions" :title="'Подписки'" :link="'/subscriptions'"/>
                </div>
                <div class="subscribers">
                    <SubcrList :usersList="user.subscribers" :title="'Подписчики'" :link="'/subscribers'"/>
                </div> 
            </div>            
        </div>        
    </div>
    
    <div class="profile-body" v-else-if="this.anotherUser">
        <ProfileView class ="profile-top" :user="this.anotherUser" :posts="this.posts"/>
        <div class="profile-bottom">
            <div class="posts-form">
                    <div class="post" v-for='post in posts' v-bind:key="post.id" :id="post.id">
                    <a :id="'post-' + post.id"></a>
                    <PostView :post="post" :stompClient="this.stompClient"/>
                    </div>
            </div>
            <div class="sub-sub">
                <div class="subscriptions">
                    <SubcrList :usersList="anotherUser.subscriptions" :title="'Подписки'" :link="'/subscriptions'"/>
                </div>
                <div class="subscribers">
                    <SubcrList :usersList="anotherUser.subscribers" :title="'Подписчики'" :link="'/subscribers'"/>
                </div> 
            </div>            
        </div>        
    </div>   
</template>

<script>
import PostService from "@/services/PostService";
import UserService from "@/services/UserService";

import PageHeader from "@/components/PageHeader";
import ProfileView from "@/components/ProfileView";
import PostView from "@/components/PostView";
import SubcrList from "@/components/SubcrList";
import MyButton from "@/components/MyButton";

import NProgress from "nprogress";

import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'


export default {
    data(){
        return {
            posts:[],
            user:{},
            anotherUser:{},
            postText:'',
            choosen: [],
            categories:[
                {tag:"Природа"},
                {tag:"Животные"},
                {tag:"Люди"},
                {tag:"Спорт"},
                {tag:"Еда"},
                {tag:"Семья"},
                {tag:"Мода"},
                {tag:"Машины"},
                {tag:"Мемы"},
            ],
            file: null,
            me:{},
            stompClient: null
        }
    },
    components:{
        PageHeader,
        ProfileView,
        SubcrList,
        PostView,
        MyButton,
    },
    methods:{
        createPost(e) {
            if(((this.postText != null && this.postText != "") || (this.file!=null)) && this.choosen.length != 0){
                const post = {text: this.postText, tags: this.choosen}
                PostService.createPost(post).then((response) => {
                    if(this.file != null){
                        PostService.uploadPostPhoto(response.data.id, {file: this.file}).then((response1) => {
                            if (response1.status == 200) {
                                let newPost = response1.data
                                newPost.comments = []
                                this.posts.unshift(newPost)
                                this.postText = ''
                                this.file = null
                            }
                        })
                    }
                    if (response.status == 200 && this.file == null) {
                        let newPost = response.data
                        newPost.comments = []
                        this.posts.unshift(newPost)
                        this.postText = ''
                        this.file = null
                    }
                })
            }
            e.preventDefault() 
        },
        getLoginByRoute(){
            return this.$route.path.toString().substring(1)
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
                var preview = document.querySelector("#app > div.profile-body > div.profile-bottom > div.posts-form > div.post-create > div.post-create-form > div.postPhoto > div > img")
                vm.image = e.target.result;
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            this.file = file;
        },
        loadData() {
            UserService.me().then((response) => {
                if (response.status == 200) {
                    this.user = response.data
                    this.me = response.data
                }
                NProgress.inc(0.33);
                UserService.getUserProfile(this.getLoginByRoute()).then((response) => {
                    if (response.status == 200) {
                        this.anotherUser = response.data
                    }
                    if (!response.data) {
                        this.$router.push({name: "not-found"})
                    }
                    NProgress.inc(0.33);
                    UserService.getUserPosts(this.getLoginByRoute()).then((response) => {
                        if (response.status == 200) {
                            this.posts = response.data
                        }
                        NProgress.done(true);
                    })
                })
            }).then(()=>{
                if(this.$route.query.post){
                    setTimeout(() => {
                        var post = document.querySelector('#post-'+this.$route.query.post)
                        post.scrollIntoView({ behavior: "smooth" , block: "center"})
                    }, 500);    
                }
            })
            
        },
        getIndex(list, id) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        onDeletePost(id, e){
            PostService.deletePost(id).then((response) => {
                if (response.status == 200) {
                    this.posts.splice(this.getIndex(this.posts, id), 1)
                }
            })
            e.preventDefault()
        },
        onEditPost(data, e){        
            if(((data.post.text != null && data.post.text != "") || (data.file!=null)) && data.post.tags.length != 0){
                    data.post.tags = data.tags
                    PostService.editPost(data.post.id, data.post).then((response) => {
                        if(data.file != null || data.deletePhoto == true){
                            PostService.uploadPostPhoto(response.data.id, {file: data.file}).then((response1) => {
                                if (response1.status == 200) {
                                    this.posts.splice(this.getIndex(this.posts, data.post.id), 1, response1.data)
                                }
                            })
                        }
                    if (response.status == 200 && data.file == null) {
                        this.posts.splice(this.getIndex(this.posts, data.post.id), 1, response.data)
                    }
                })
            }    
            e.preventDefault()
        },
        removePhoto(e){
            this.file=null
            e.preventDefault()
        },
        connect() {
            var socket = new SockJS('http://localhost:9000/gs-guide-websocket');
            this.stompClient = Stomp.over(socket);
            this.stompClient.debug = f => f;
            this.stompClient.connect({}, {})
        },
    },
    mounted() {
        this.loadData()
        this.connect()
    },
    unmounted(){
        if (this.stompClient !== null) {
            this.stompClient.disconnect()
        }
    },
    watch: {
        '$route'() {
            this.loadData()
        }
    }
}
</script>

<style scoped>
.profile-body{
    display: flex;
    flex-direction: column;
    margin: 0px 300px 20px 300px;
    padding: 0px 0px 20px 0px;

}
.profile-top{
    margin-block: 15px;
    margin-top: 90px;
}

.profile-bottom{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
   
}

.sub-sub, .posts {
    min-width: 300px;
}
.sub-sub{
    margin-left: 10px;
}
.posts-form{
    flex: auto;
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
    margin-top: 10px;
    margin-left: 2px;
    overflow: hidden;
    width: 50px;
    height: 50px;
}

.image-area img{
    width: auto;
    height: 100%;
    margin: 0 auto;
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