<template>
    <PageHeader/>
    <h4>Страница не найдена</h4>
</template>

<script>
    import PageHeader from '../components/PageHeader.vue';
    export default{
        components:{
            PageHeader
        }
    }
</script>

<style scoped>
    h4{
        margin: 15px 300px 20px 300px;
        padding-block: 20px;
        background-color: white;
        border-radius: 20px;
        border: 1px solid;
        border-color: #D276FD;
        margin-top: 90px;
        margin-bottom: 100px;
    }
    #navbar{
        top: 0;
    }
</style>