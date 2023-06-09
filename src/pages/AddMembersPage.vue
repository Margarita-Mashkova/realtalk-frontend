<template>
    <PageHeader />
    <div class="page-add-members">
        <div v-if="this.user.subscribers" class="page-add-members-body">
            <h4>Выберите пользователей</h4>
            <InputIcon v-model="search" class="input-icon" :type="'text'" :placeholder="'Поиск'" :src="'search.png'" :width="'18'"
                :height="'18'" />
            <div class="subscr" v-for='sub in filter' v-bind:key="sub.id">
                <SubscrView :user="sub" :me2="this.user" class="chat-choose-user" @click="this.choose(sub.id)" />
                <input type="checkbox" v-model="choosenUsers" :checked="choosenUsers.indexOf(+sub.id) > -1" :value="sub.id">
            </div>
           
        </div>
    </div>
    <footer class="create-footer">
        <MyButton @click="addMembers($event)">
            Добавить
        </MyButton>
    </footer>
    
</template>
<script>
import UserService from "@/services/UserService";

import PageHeader from "@/components/PageHeader";
import SubscrView from "@/components/SubscrView";
import InputIcon from "@/components/InputIcon";
import MyButton from "@/components/MyButton.vue";
import ChatService from "@/services/ChatService";

import NProgress from "nprogress";

export default {
    data() {
        return {
            user: {},
            choosenUsers: [],
            chatName:'',
            search:'',
            usersIds:[]
        }
    },
    components: {
        PageHeader,
        SubscrView,
        InputIcon,
        MyButton
    },
    methods: {
        choose(subId) {
            if (this.choosenUsers.indexOf(+subId) > -1) {
                this.choosenUsers.splice(this.choosenUsers.indexOf(+subId), 1)
            }
            else {
                this.choosenUsers.push(subId)
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
        addMembers(e){
            if(this.choosenUsers.length!=0){
                ChatService.addMembersToChat(this.$route.params.id, this.choosenUsers).then((response) => {
                this.$router.push('/chat/' + response.data.id)
            })
            }
            
            e.preventDefault()
        },
    },
    mounted() {
        UserService.me().then((response) => {
            if (response.status == 200) {
                this.user = response.data
            }
        })
        let chatId = this.$route.params.id
        ChatService.getChatById(chatId).then((response) => {
            if (response.status == 200) {
                this.usersIds = response.data.users.map(user=>user.id)
            }
            NProgress.done(true)
        })
    },
    computed: {
        filter(){
            return this.user.subscribers.filter(sub => 
            ((sub.name.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 
            || (sub.surname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1
            || (sub.name.toLowerCase() +' '+sub.surname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1
            || (sub.login.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1) && !this.usersIds.includes(sub.id))
        }
    }
}
</script>
<style scoped>
.page-add-members {
    display: flex;
    flex-direction: column;
}

.page-add-members-body {
    margin: 15px 300px 20px 300px;
    padding: 0px 0px 20px 0px;
    background-color: white;
    border-radius: 20px;
    border: 1px solid;
    border-color: #D276FD;
    margin-top: 90px;
    margin-bottom: 100px;
}

.input-icon {
    margin: 5px !important;
    border: 0px !important;
}

input[type=checkbox] {
    -ms-transform: scale(5);
    /* IE */
    -moz-transform: scale(5);
    /* FF */
    -webkit-transform: scale(5);
    /* Safari and Chrome */
    -o-transform: scale(5);
    /* Opera */
    transform: scale(5);
    accent-color: #c34ff8;
    margin-right: 30px;
}

.chat-choose-user {
    border: none;
    width: 100%;
}

.subscr {
    background-color: white;
    border: 1px solid;
    border-color: #D276FD;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn{    
    padding: 10px;
    min-width: 150px;
    margin-top: 30px;
    margin-bottom: 30px;
}

h4{
    margin: 30px;
}

footer{
    bottom: 0;
    position: fixed;
    background-color: white;
    height: 100px;
    width: -webkit-fill-available;
    margin-inline: 300px;
    border: 1px solid;
    border-color: #D276FD;
    border-radius: 20px;
}
</style>