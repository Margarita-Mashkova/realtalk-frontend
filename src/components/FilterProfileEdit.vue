<template>
    <div id="btn-bar">
        <button :onclick="goToPersonalData">
        Личные данные
        </button>
        <button :onclick="goToLoginData">
        Данные входа
        </button>
    </div>
</template>

<script>
export default {
    components:{
    },
    methods:{
        goToPersonalData(){
            this.$router.push("personal")
        },
        goToLoginData(){
            this.$router.push("login-data")
        }
    }
}
</script>
    
<style scoped>
#btn-bar{
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
}
button{
    padding: 10px;
    margin: 10px;
    border-radius: 10px;
    background-color: white;
    border-color: #D276FD;    
    font-family: Georgia, serif;
    font-size: 10pt;  
}
</style>