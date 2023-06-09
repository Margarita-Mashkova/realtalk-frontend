<template>
    <PageHeader />
    <div class="feed-body">
        <div class="feed-posts" v-if="this.posts.length > 0">
            <div class="post" v-for='post in posts' v-bind:key="post.id">
            <PostView :post="post" :stompClient="stompClient"/>
            </div>
        </div>
        <div class="noNews" v-else>            
            <label v-if="recsMode"> У Вас пока нет рекомендаций :(<br> Чтобы увидеть рекомендации, выберите категории в списке справа!</label>
            <label v-else> У Вас пока нет новостей :(<br> Чтобы увидеть новости, подпишитесь на кого-нибудь! </label>
        </div>
        <div class="filter">
            <div class="feed-filters" >
                <FilterNews @chooseNews="onChooseNews"/>
            </div>
            <div id="preferences-checkboxes">
                <label class="choose">Выберите категории, которые Вам интересны:</label>
                <div class="list">
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
                <div>
                    <MyButton @click="editPreferences($event)">Сохранить выбор</MyButton>
                </div>
            </div>
        </div>        
    </div>
</template>

<script>
import FeedService from "@/services/FeedService";
import UserService from "@/services/UserService";

import PageHeader from "@/components/PageHeader";
import PostView from "@/components/PostView";
import FilterNews from "@/components/FilterNews";
import MyButton from "@/components/MyButton";

import NProgress from "nprogress";

import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'


export default {
    data(){
        return {
            posts:[],
            choosen:[],
            preferences:[],
            user:{},
            categories:[
                {tag:"Природа"},
                {tag:"Животные"},
                {tag:"Люди"},
                {tag:"Спорт"},
                {tag:"Еда"},
                {tag:"Семья"},
                {tag:"Мода"},
                {tag:"Машина"},
                {tag:"Мемы"},
            ],
            recsMode: false,
            stompClient: null
        }
    },
    components:{
        PageHeader,
        PostView,
        FilterNews,
        MyButton
    },
    methods:{
        onChooseNews(data){
            if(data.feedType == 'feed'){
                this.recsMode = false
                FeedService.getFeed().then((response)=> {
                    if(response.status == 200) {            
                        this.posts = response.data
                    }          
                })
            }
            if(data.feedType == 'recommend'){
                this.recsMode = true
                FeedService.getFeedRec().then((response)=> {
                    if(response.status == 200) {        
                        this.posts = response.data
                    }          
                })
            }
        },
        getFeedType(){
            if(localStorage.getItem('feedType') == 'recommend') return true
            else return false
        },
        editPreferences(e) {
            const tags = {tags: this.choosen}
            UserService.editPreferences(tags).then((response) => {
                if (response.status == 200) {
                    this.preferences = response.data.tags
                }
            })
            e.preventDefault() 
        },
        findRecommends(){
            FeedService.getFeed().then((response)=> {
                if(response.status == 200) {            
                    this.posts = response.data
                }          
            })
        },
        connect() {
            var socket = new SockJS('http://localhost:9000/gs-guide-websocket');
            this.stompClient = Stomp.over(socket);
            this.stompClient.debug = f => f;
            this.stompClient.connect({}, {})
        },
    },
    mounted(){
        this.findRecommends()
        this.connect()
        UserService.me().then((response)=> {
          if(response.status == 200) {            
            this.user = response.data
            this.choosen = this.user.tags
          }
          NProgress.done(true)
        })        
    },
    unmounted(){
        if (this.stompClient !== null) {
            this.stompClient.disconnect()
        }
    },
    watch: {
        'preferences'() {
            this.onChooseNews({feedType: "recommend"})
        }
    }
}
</script>

<style scoped>
.feed-body {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    margin: 0px 280px 20px 300px;
    padding: 0px 0px 20px 0px;
}

.feed-filters {
   min-width: 300px;
}

.feed-posts {
   margin-inline: 20px;
   min-width: 300px;
   flex: auto;
   margin-top: 90px;
}

.noNews{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
    width: 600px;
    height: 550px;
    font-size: 14pt;
    padding: 0px 10px;
    margin-top: 90px;
}

.filter {
    display: flex;
    flex-direction: column;
    margin-top: 90px;
}

#preferences-checkboxes{
    max-width: 300px;
    font-family: Georgia, serif;
    font-size: 12pt;
    display: flex;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
    margin-top: 20px;
    flex-direction: column;
    padding: 10px;
}

#preferences-checkboxes input, label{
    margin-right: 10px;
}

.category{
    margin: 5px;
}

.list{
    display: flex;
    flex-direction: column;
    align-items: self-start;
}

.choose{
    font-size: 13pt;
    font-weight: bold;
    margin-bottom: 15px;
}

.btn{
    padding: 10px 70px;
    margin-top: 15px;
}

</style>


<!-- <div class="category">
    <input type="checkbox" id="nature" value="Природа" v-model="checked" />
    <label for="nature">Природа</label>
</div>
<div class="category">
    <input type="checkbox" id="animals" value="Животные" v-model="checked" />
    <label for="animals">Животные</label>
</div>
<div class="category">
    <input type="checkbox" id="people" value="Люди" v-model="checked" />
    <label for="people">Люди</label>
</div>
<div class="category">
    <input type="checkbox" id="sport" value="Спорт" v-model="checked" />
    <label for="sport">Спорт</label>
</div>
<div class="category">
    <input type="checkbox" id="food" value="Еда" v-model="checked" />
    <label for="food">Еда</label>
</div>
<div class="category">
    <input type="checkbox" id="family" value="Семья" v-model="checked" />
    <label for="family">Семья</label>
</div>
<div class="category">
    <input type="checkbox" id="fashion" value="Мода" v-model="checked" />
    <label for="fashion">Мода</label>
</div> -->