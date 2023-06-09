<template>
    <button @click="$emit('click')" class="btn">
        <slot></slot>
    </button>
</template>

<script>
export default {
  name: 'MyButton'
}
</script>

<style>
.btn{
    font-family: Georgia, serif;
    font-size: 12pt;
    color: white;
    border-radius: 50px;
    background-color: #c445ff;
    border-color: #D276FD;
    text-align: center;
    cursor: pointer;
}
</style>