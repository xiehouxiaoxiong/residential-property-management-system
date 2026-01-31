<script setup>
import LoginPassword from './components/loginPassword.vue'
import { reactive,ref } from "vue";

  let title = ref("修改密码")
  let passwordError = reactive({error:"false"})
  let form = reactive({
    username:"",
    password:""
  })
  let textone = ref("输入新密码")
  let texttwo = ref("再次输入新密码")
  let buttonText = ref("确定")
  let tip = ref("首次登录需修改密码")
  
  
</script>
<template>
    <div class="loginbackground">
      
    </div>
    <LoginPassword :title="title" :passwordError="passwordError" :form="form" :textone="textone" :texttwo="texttwo" 
    :buttonText="buttonText" :tip="tip" style="position:absolute;top:0"></LoginPassword>
</template>
<style scoped>
 .loginbackground{
    width: 100vw;
    height: 100vh;
    background-color: #8BC6EC;
    background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%);
  }

</style>