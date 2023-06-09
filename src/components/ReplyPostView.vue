<template>
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
            </div>

            <div>
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
    </div>
    
</template>

<script>
    import UserService from "@/services/UserService";

    export default{
    data(){
        return {
            me:{},
            likedByMe: false,
            animated: false,
            likesCount: Number,
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
            comments:[],
            isShowModalSendReply: false
        }
    },
    props: {
        post:null,
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



.post-create button{
    padding: 10px;
    min-width: 150px;
    font-family: Georgia, serif;
    align-self: center;
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

</style>