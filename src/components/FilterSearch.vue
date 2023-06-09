<template>
    <div class="filter-bar">
        <div class="filters">
            <InputIcon
            :type = "'date'"
            :placeholder = "'Дата рождения'"
            :src = "'cake.png'"
            :width = "'18'"
            :height = "'18'"
            />
            <InputIcon
            :type = "'text'"
            :placeholder = "'Город'"
            :src = "'city.png'"
            :width = "'18'"
            :height = "'18'"
            />
        </div>        
        <MyButton>Применить</MyButton>
    </div>
</template>

<script>
import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';
export default {
    components:{
        MyButton,
        InputIcon
    }
  
}
</script>

<style scoped>
.filter-bar{
    margin: 5px;
    display: flex;
    flex-direction: column;
    width: 25%;
    background-color: white;
    border-radius: 10px;
    border: 1px solid;
    border-color: #D276FD;
}


.btn{
    padding: 10px;
    margin: 10px 50px;
}
</style>