<template>
    <PageHeader />
    <div class="page-search">
        <div class="container">
        <div class="users-list">
            <InputIcon class="input-icon" :type="'text'" :placeholder="'Поиск'" :src="'search.png'" :width="'18'"
                :height="'18'" v-model="query"/>
            <div v-if="this.users.length > 0">
                <div class="user" v-for='user in users' v-bind:key="user.id">
                    <SubscrView :user="user" :me2="this.me"/>
                </div>
            </div>
            <div v-else-if="this.users.length == 0 & this.query != ''">
                <label>По запросу "{{this.query}}" ничего не найдено</label>
            </div>
            <div v-else-if="this.users.length == 0 & this.query == ''">
                <label>По выбранным категориями нет пользователей :(</label>
            </div>
        </div>
        <div class="filter">
            <div class="search-filters" >
                <FilterSearchUsers @chooseSearch="onChooseSearch"/>
            </div>
            <div v-if="choosen" id="preferences-checkboxes">
                <label class="choose">Выберите категории, <br> которые Вам интересны,<br> чтобы увидеть рекомендованных пользователей:</label>
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
                    <MyButton @click="editPreferences($event)">Показать</MyButton>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
  
<script>
import PageHeader from "@/components/PageHeader";
import SubscrView from "@/components/SubscrView";
import InputIcon from "@/components/InputIcon";
import UserService from "@/services/UserService";

import MyButton from "@/components/MyButton";
import FilterSearchUsers from "@/components/FilterSearchUsers";

import NProgress from "nprogress";

export default {
    data() {
        return {
            me: {},
            users: {},
            choosen:[],
            preferences:[],
            noResults: false,
            categories: [
                { tag: "Природа" },
                { tag: "Животные" },
                { tag: "Люди" },
                { tag: "Спорт" },
                { tag: "Еда" },
                { tag: "Семья" },
                { tag: "Мода" },
                { tag: "Машина" },
                { tag: "Мемы" }
            ],
            query: "",
            recsMode: false
        }
    },
    components: {
        PageHeader,
        SubscrView,
        InputIcon, 
        MyButton,
        FilterSearchUsers
    },
    methods: {
        onChooseSearch(data){            
            if(data.searchType == 'all'){
                this.recsMode = false
                UserService.findAllUsers().then((response)=> {
                    if (response.status == 200) {
                        this.users = response.data
                        this.users.splice(this.getIndex(this.users, this.me.id), 1)
                    }        
                })
            }
            if(data.searchType == 'recommend'){
                this.recsMode = true
                this.findUsersByPreferences()
            }
        },
        getIndex(list, id) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        findUsersByQuery(query){
            UserService.findUsers(query).then((response)=> {
                if(response.status == 200) {
                    this.users = response.data
                    if(this.users.map(user=>user.login).includes(this.me.login)){
                        this.users.splice(this.getIndex(this.users, this.me.id), 1)
                    }
                }
            }) 
        },
        editPreferences(e) {
            const tags = {tags: this.choosen}
            UserService.editPreferences(tags).then((response) => {
                if (response.status == 200) {
                    this.preferences = response.data.tags
                    this.findUsersByPreferences()
                }
            })
            e.preventDefault() 
        },
        findUsersByPreferences(e){
            UserService.findUsersByPreferences().then((response)=> {
                if(response.status == 200) {
                    this.users = response.data
                    if(this.users.map(user=>user.login).includes(this.me.login)){
                        this.users.splice(this.getIndex(this.users, this.me.id), 1)
                    }
                }
            })
            e.preventDefault()
        }
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.me = response.data
                UserService.findAllUsers().then((response) => {
                    if (response.status == 200) {                        
                        this.users = response.data
                        this.choosen = this.me.tags
                        this.users.splice(this.getIndex(this.users, this.me.id), 1)
                    }
                    NProgress.done(true)
                })
            }
        })
    },
    watch:{
        'query'(){
            this.findUsersByQuery(this.query)
        },
        'preferences'() {
            if(this.preferences.length != 0){
                this.onChooseSearch({searchType: "recommend"})
            }            
        }
    }
}
</script>
  
<style scoped>
.page-search {
    margin: 0px 290px 20px 300px;
    padding: 0px 0px 20px 0px;
    display: flex;
    flex-direction: row;
}

.container{
    display: flex;
    flex-direction: row;
    margin-top: 90px;
}

.users-list {
    width: 100%;
    min-width: 600px;
    background-color: white;
    border-radius: 20px;
    border: 1px solid;
    border-color: #D276FD;
    margin-right: 20px;
    padding-bottom: 20px;
}

.users-list label{
    font-size: 13pt;
}

.input-icon {
    margin: 5px !important;
    border: 0px !important;
}

#preferences-checkboxes{
    font-family: Georgia, serif;
    font-size: 12pt;
    display: flex;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
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
    padding: 10px 100px;
    margin-top: 15px;
}

.search-filters {
   min-width: 300px;
   margin-bottom: 20px;
}


</style>