<template>
    <PopUpDialogVue
      v-show="isShowModalDelete"
      text='Вы действительно хотите удалить чат?'
      @modalAction="onModalActionDelete"
    />
    <PopUpDialogVue
      v-show="isShowModalLeave"
      text='Вы действительно хотите покинуть чат?'
      @modalAction="onModalActionLeave"
    />
    <div class="companion-container">
        <div class="user">
            <div class="back" @click="back()">
                <img src="../assets/back.png" width="15" height="15" >
                <label>Назад</label>
            </div>
            <div v-if="this.with" class="private">
                <div class="user-info">
                    <router-link :to="'/'+this.with.login" class="username">{{this.with.name + ' ' +this.with.surname}}</router-link>
                    <label class="login">@{{ this.with.login }}</label>
                </div>
                <div class="user-profile" v-if="!this.with.photo">
                    <img class="user-photo" src="../assets/profile.png" width="50" height="50">
                </div>
                <div class="user-profile" v-else>
                    <img class="user-photo" v-bind:src= "'/photos/'+ this.with.photo" width="50" height="50">
                </div>         
            </div>
            <div v-else class="non-private">
                <div class="user-info">
                    <label class="username">{{ this.chat.name }}</label>
                    <div v-for="user in users" v-bind:key="user.id">
                        <label v-if="this.chat.creator.login==user.login" class="login">{{ user.name+' '+user.surname +' (Создатель)'}}</label>
                        <label v-else class="login">{{ user.name+' '+user.surname }}</label>
                    </div>
                </div>
                <div class="user-profile" v-if="!this.chat.image">
                    <img class="user-photo" src="../assets/profile-photo.png" width="50" height="50">
                </div>
                <div class="user-profile" v-else>
                    <img class="user-photo" v-bind:src= "'/photos/'+ this.chat.image" width="50" height="50">
                </div>
            </div>
            <div class="btns-bar" v-if="this.chat && this.me.login==this.chat.creator.login">
                <img class="icon" src="../assets/edit.png" width="25" height="25" @click="editChat">
                <img class="icon" src="../assets/add.png" width="25" height="25" @click="addMembers">
                <img class="icon" src="../assets/delete-member.png" width="25" height="25" @click="deleteMembers">
                <img class="icon" src="../assets/delete.png" width="25" height="25" @click="toggleModalDelete">
            </div>
            <div class="btns-bar" v-else-if="this.chat && this.me.login!=this.chat.creator.login">
                <img class="icon" src="../assets/exit.png" width="25" height="25" @click="toggleModalLeave">
            </div>                
        </div>
    </div>
</template>

<script>
    import UserService from "@/services/UserService";
    import ChatService from "@/services/ChatService";
    import PopUpDialogVue from "@/components/pop-up/PopUpDialog.vue"

    export default{
        components:{
            PopUpDialogVue
        },
        data(){
            return{
                me:{},
                isShowModalDelete: false,
                isShowModalLeave: false,
            }
        },
        props:{
            users:[],
            with:null,
            chat:null
        },
        methods:{
            back(e) {
                this.$router.push("/chats")
                e.preventDefault()
            },
            editChat(){
                this.$router.push("/chat/"+this.chat.id+"/edit")
            },
            addMembers(){
                this.$router.push("/chat/"+this.chat.id+"/add-members")
            },
            deleteMembers(){
                this.$router.push("/chat/"+this.chat.id+"/delete-members")
            },
            toggleModalDelete() {
                this.isShowModalDelete = !this.isShowModalDelete;
            },
            toggleModalLeave() {
                this.isShowModalLeave = !this.isShowModalLeave;
            },
            onModalActionDelete(flag){
                if(!flag){
                    this.isShowModalDelete = false
                }
                else{
                    ChatService.deleteChat(this.$route.params.id).then( ()=>{this.$router.push("/chats"); this.$forceUpdate()})
                }
            },
            onModalActionLeave(flag){
                if(!flag){
                    this.isShowModalLeave = false
                }
                else{
                    ChatService.leaveChat(this.$route.params.id).then( this.$router.push("/chats"))
                }
            }
        },
        mounted(){
            UserService.me().then((response) => {
                if (response.status == 200) {
                    this.me = response.data
                }
            })
        }
       
    }
</script>
    

<style scoped>
.companion-container{
    display: flex;
    flex-direction: column;
    background-color: white;
    font-family: Georgia, serif;
    font-size: 12pt;
    border-radius: 10px;
    border: 1px solid;
    padding: 10px 20px;
    border-color: #D276FD;
}

.user{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.private, .non-private{
    display: flex;
    flex-direction: row;
    width: -webkit-fill-available;
    justify-content: center
}
.user-profile{
    display: flex;
    flex-direction: row;
}

.user-info{
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
}
.user-photo{
    border: 2px solid;
    border-color: #D276FD;
    border-radius: 50%;
    margin-left: 5px
}

.username{
    margin-bottom: 5px;
}

.login{
    font-size: 11pt;
}

.back{
    display: flex;
    align-self: center;
    cursor: pointer;
}

.back label{
    margin-left: 5px;
    cursor: pointer;
}

label{
    text-align: left;
}

img{
    align-self: center;
}
.btns-bar{
    display: flex;
    flex-direction: column;
}

.btns-bar img{
    margin-right: 10px;
    margin-left: 10px;
    margin-block: 5px;
    cursor: pointer;
}

.pop-up{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

</style>