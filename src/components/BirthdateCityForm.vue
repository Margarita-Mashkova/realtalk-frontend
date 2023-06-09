<template>
    <form @submit.prevent>
        <h4>Укажите дату рождения и свой город</h4>
        <InputIcon
        v-model="borthdate"
        :type = "'date'"
        :placeholder = "'Дата рождения'"
        :src = "'cake.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <div class="error" v-if="wrongData.includes('birthdate')">
            <label>Поле "Дата рождения" должно быть заполнено</label>
        </div> 
        <InputIcon
        v-model="city"
        :type = "'text'"
        :placeholder = "'Город'"
        :src = "'city.png'"
        :width = "'18'"
        :height = "'18'"
        />
        <div class="error" v-if="wrongData.includes('city')">
            <label>Поле "Город" должно быть заполнено</label>
        </div> 
        <div class="btn-bar">
            <MyButton @click="goToStep3(false)">Пропустить</MyButton>
            <MyButton @click="goToStep3(true)">Далее</MyButton>
        </div>        
    </form>
</template>

<script>
import MyButton from './MyButton.vue';
import InputIcon from './InputIcon.vue';
export default {
    components:{
        MyButton,
        InputIcon
    },
    props: ['user'],
    data() {
        return {
            borthdate: Date,
            city: '',
            wrongData:[]
        }
    },
    methods:{
        goToStep3(flag) {
            console.log('click')
            if (flag) {
                //ДР
                if(this.borthdate == ''){
                    this.wrongData.push('birthdate')
                }else{
                    if(this.wrongData.includes('birthdate')) this.wrongData.splice(this.getIndex(this.wrongData, 'birthdate'), 1)
                }
                //Город
                if(this.city == ''){
                    this.wrongData.push('city')
                }else{
                    if(this.wrongData.includes('city')) this.wrongData.splice(this.getIndex(this.wrongData, 'city'), 1)
                }
                if(this.wrongData.length == 0){
                    this.$emit('updateUser', {
                    borthdate: this.borthdate,
                    city: this.city
                    })
                    this.$router.push("/registration/step-3")
                }                
            }
            else{
                this.$router.push("/registration/step-3")
            }            
        },
        getIndex(list, str) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === str) {
                    return i;
                }
            }
            return -1;
        }        
    },
    created() {
        this.borthdate = this.$props.user.borthdate
        this.city = this.$props.user.city
    },
    unmounted() {
        this.$emit('updateUser', {
            borthdate: this.borthdate,
            city: this.city
        })
    }
  
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    width: 35%;
    margin: auto;
    margin-top: 12%;
    background-color: #ffffff50;
    border-radius: 30px; 
    border: 1px solid;
    border-color: #D276FD;
}
.btn{    
    padding: 10px;
    min-width: 150px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.btn-bar{
    display: flex;
    justify-content: space-evenly;
}
.error{
    padding: 2px;
    background-color: #ffb6b6;
    margin: 0px 50px;
    
    border-radius: 2px;
    border-color: #ed5656;
    display: flex;
}

label{
  font-size: 11.5pt;
  color: #b10000;
}
</style>