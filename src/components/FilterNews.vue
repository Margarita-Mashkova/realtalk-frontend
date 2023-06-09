<template>
    <div id="btn-bar">
        <button @click="feed()">
        Подписки
        </button>
        <button @click="rec()">
        Рекомендации
        </button>
    </div>
</template>

<script>
export default {
    methods:{
        feed(){
            this.$emit('chooseNews', {
                feedType: 'feed'
            })
        },
        rec(){
            this.$emit('chooseNews', {
                feedType: 'recommend'
            })
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
    font-size: 12pt;  
}
</style>