<script setup>
import { reactive, ref, h, toRefs } from "vue";
import axios from "axios";

import LoginPassword from "./components/loginPassword.vue";

let title = ref("欢迎使用");
let passwordError = reactive({ error: "false" });
let form = reactive({
  account: "",
  password: "",
});
let textone = ref("请输入账号");
let texttwo = ref("初始化密码211");
let buttonText = ref("登录");
let tip = ref("忘记密码请联系管理员：17760096737");
</script>
<template>
  <div class="loginbackground"></div>

  <LoginPassword
    :title="title"
    :passwordError="passwordError"
    :form="form"
    :textone="textone"
    :texttwo="texttwo"
    :buttonText="buttonText"
    :tip="tip"
    style="position: absolute; top: 0; height: 100vh"
  ></LoginPassword>
</template>

<style scoped>
.messagebox {
  display: flex;
  flex-direction: column;
}
.form {
  margin-top: 40px;
}
.imgicon {
  width: 48px;
  height: 32px;
  object-fit: cover;
}
.loginsuccess {
  height: 180px;
}
.weixin {
  width: 100%;
  height: 80px;
  align-items: center;
  justify-content: center;
  margin-top: -40px;
  display: flex;
  &:before {
    content: " ";
    display: inline-block; /**必加 */
    width: 35px;
    height: 28px;
    object-fit: cover;
    background: url(@/assets/weixin.png) no-repeat;
    background-size: 82% 100%;
  }
}

.loginbackground {
  width: 100%;
  height: 100vh;
  background-color: #8ec5fc;
  background-image: linear-gradient(62deg, #8ec5fc 0%, #ffffff 100%);
  background-size: 100% 100%;
}
.loginimg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border: 0;
}

.form {
  text-align: center;
  width: 80%;
}
</style>
