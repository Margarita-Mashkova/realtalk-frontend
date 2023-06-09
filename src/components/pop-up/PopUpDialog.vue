<template>
    <transition :name="modalClass">
        <div :class="modalClass">
            <div :class="`${modalClass}-backdrop`">
                <div :class="`${modalClass}-container`">
                    <div :class="`${modalClass}-content`">
                        <form @submit.prevent>
                            <h4>
                                {{ this.text }}
                            </h4>
                            <div>
                                <MyButton @click="positive($event)">Да</MyButton>
                                <MyButton @click="negative($event)">Нет</MyButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script>
import MyButton from '../MyButton.vue';

export default {

    props: {
        show: {
            type: Boolean,
            default: false,
        },
        modalClass: {
            type: String,
            default: 'simple-modal',
        },
        text: String
    },
    components: {
        MyButton
    },

    methods: {
        positive(e) {
            this.$emit('modalAction', true);
            e.preventDefault()
        },
        negative(e) {
            this.$emit('modalAction', false);
            e.preventDefault()
        },
    },
};
</script>
  
<style lang="scss">
.simple-modal {
    &-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        transition: opacity 0.3s ease;
        z-index: 9999;
    }

    &-container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: auto;
        margin: 16px;
    }

    &-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        max-width: 700px;
        margin: 1.75rem auto;
        padding: 20px 30px;
        border-radius: 5px;
        color: #000;
        background-color: #fff;
        box-sizing: border-box;
        transform: translate(0, 0);
        transition: all 0.3s ease;
    }


    /* Вы уверены, что хотите выйти? */
    h4 {

        font-family: 'Georgia';
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 55px;
        text-align: center;
        letter-spacing: 0.01em;
    }

    .btn {
        padding: 10px;
        min-width: 170px;
        margin-top: 30px;
        margin-bottom: 30px;
        margin-inline: 10px;
    }

    &-enter,
    &-leave-to {
        opacity: 0;
    }

    &-enter-active,
    &-leave-active {
        transition: opacity 0.2s ease;
    }
}
</style>