<template>
    <LoginForm class="login-form"/>
</template>
  
  <script>
  
  import LoginForm from "@/components/LoginForm";

  export default {
    name: "LoginPage",
    components: {LoginForm},
    }
  
  </script>
  
  <style scoped>
    .login-form{
      left: 50%;
      top: 45%;
      position: absolute;
      transform: translate(-50%, -50%);
    }
  </style>