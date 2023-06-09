<template>
    <PageHeader/>
    <div class="page-subscribtions">        
        <div v-if="this.user.subscriptions" class="users-list">
            <InputIcon
            v-model="search"
            class="input-icon"
            :type = "'text'"
            :placeholder = "'Поиск'"
            :src = "'search.png'"
            :width = "'18'"
            :height = "'18'"
            />
            <div class="subscr" v-for='sub in filter' v-bind:key="sub.id">
                <SubscrView :user="sub" :me2="this.user"/>
            </div>            
        </div>        
    </div>
</template>
  
<script>
import UserService from "@/services/UserService";

import PageHeader from "@/components/PageHeader";
import SubscrView from "@/components/SubscrView";
import InputIcon from "@/components/InputIcon";

import NProgress from "nprogress";

export default {
    data(){
        return {
            user:{},
            search:''
        }
    },
    components: {
        PageHeader,
        SubscrView,
        InputIcon
    },
    mounted(){
        UserService.me().then((response)=> {
          if(response.status == 200) {            
            this.user = response.data
          }
          NProgress.done(true)          
        })        
    },
    computed: {
        filter(){
            return this.user.subscriptions.filter(sub => 
            (sub.name.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1 
            || (sub.surname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1
            || (sub.name.toLowerCase() +' '+sub.surname.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1
            || (sub.login.toLowerCase()).indexOf(this.search.toLowerCase().trim()) !== -1)
        }
    }
}
</script>
  
<style scoped>
    .page-subscribtions{
        display: flex;
        flex-direction: column;
    }
    
    .users-list{
        margin: 15px 300px 20px 300px;
        padding: 0px 0px 20px 0px;
        background-color: white;
        border-radius: 20px;
        border: 1px solid;
        border-color: #D276FD;
        margin-top: 90px;
    }

    .input-icon{
        margin: 5px !important;
        border: 0px !important;        
    }
    
</style>