<script setup>
import { reactive, defineProps, ref, toRefs, h, computed } from "vue";

import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const props = defineProps({
  title: { type: String, default: "" },
  passwordError: { type: Object, default: {} },
  form: { type: Object, default: {} },
  textone: { type: String, default: "" },
  texttwo: { type: String, default: "" },
  buttonText: { type: String, default: "" },
  tip: { type: String, default: "" },
});
const { title, passwordError, form, textone, texttwo, buttonText, tip } = props;
let flag = title === "修改密码" ? "false" : "true";
console.log(flag);



const router = useRouter();

const formRef = ref(null);

let checkPasswordd = (rule, value, callback) => {
  console.log(form.username);
  console.log(form.password);
  if (form.username !== value) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

let passwordd = (rule, value, callback) => {
  if (form.password !== "") {
    formRef.value.validateField("password");
    callback();
  }
};

let rules1 = {
  username: [
    {
      required: true,
      message: "账号不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ],
};

let rules2 = {
  username: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
    {
      validator: passwordd,
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "验证密码不能为空",
      trigger: "blur",
    },
    {
      validator: checkPasswordd,
      trigger: "blur",
    },
  ],
};
let rules = flag == "false" ? rules2 : rules1;
console.log(flag);
console.log(rules);

function elmessage(imgsrc, titletext) {
  ElMessageBox({
    message: h("div", { class: "messagebox" }, [
      h("img", { class: "imgicon", style: { marginTop: "15px" }, src: imgsrc }),
      h("h3", { style: { margin: "8px" } }, titletext),
    ]),
    showClose: false,
    customStyle: {
      width: "200px",
      height: "180px",
      textAlign: "center",
      borderRadius: "20px",
    },
    showConfirmButton: false,
    beforeClose: (action, instance, done) => {
      setTimeout(() => {
        done();
      }, 500);
    },
  });
  setTimeout(() => {
    ElMessageBox.close(false);
  }, 1000);
}

let confirm = () => {
  const { password } = form;

  formRef.value.validate(async (valid) => {
    console.log(valid);
    if (valid) {
      let username = userStore.userInfo.user.userName;

      let res = await userStore.UpdatePasswordpass(password);
      console.log(res);
      if (res.status === 200) {
        elmessage("/src/assets/success.png", "操作成功");
        router.replace("/index");
      } else {
        elmessage("/src/assets/failure.png", "修改密码失败");
      }
    }
  });
};
let doLogin = () => {
  const { username, password } = form;
  console.log(username);
  console.log(password);

  formRef.value.validate(async (valid) => {
    console.log(valid);

    if (valid) {
      console.log(flag);

      let token = await userStore.getUserInfo(username, password);
    }
  });
};

let doOperate = flag == "false" ? confirm : doLogin;
console.log(doOperate);
let isActive = true;
let classObject = computed(() => {
  return {
    accountBox: true,
  };
});
</script>
<template>
  <div class="loginbackground">
    <div :class="classObject">
      <div class="form">
        <div class="welcome">{{ title }}</div>
        <el-form ref="formRef" :model="form" :rules="rules" status-icon size="small">
          <el-form-item prop="username" size="medium">
            <el-input
              v-model="form.username"
              :placeholder="textone"
              style="height: 40px"
            />
          </el-form-item>
          <el-form-item prop="password" size="medium">
            <el-input
              v-model="form.password"
              :placeholder="texttwo"
              style="height: 40px"
            />
          </el-form-item>
          <el-form-item
            size="medium"
            style="margin: -20px 5px 5px 0px; zoom: 0.85; color: #ec7f00"
            v-if="passwordError.error === true"
          >
            密码错误
          </el-form-item>
          <el-button size="large" class="subBtn1" @click="doOperate">{{
            buttonText
          }}</el-button>
          <el-form-item style="color: #969ba0; zoom: 0.95">
            <div style="margin: 0 auto">{{ tip }}</div>
          </el-form-item>
          <el-form-item v-if="flag == 'true'"> </el-form-item>
          <el-form-item v-if="flag == 'false'">
            <div class="blockk"></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.subBtn1 {
  width: 100%;
  background-color: #8bc6ec;
  background-image: linear-gradient(135deg, #8bc6ec 0%, #9599e2 100%);
  border-radius: 5px;
  color: white;
}
.messagebox {
  display: flex;
  flex-direction: column;
}
.form {
  margin-top: 0px;
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
    display: inline-block;
    width: 35px;
    height: 28px;
    object-fit: cover;
    background: url(@/assets/weixin.png) no-repeat;
    background-size: 82% 100%;
  }
}
.blockk {
  width: 100%;
  height: 50px;
}

.welcome {
  text-align: center;
  margin: 0px 0px 40px 0;
  font-weight: 700;
  font-size: 20px;
}

.accountBox {
  background-color: white;
  width: 450px;
  height: 369px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: 0 5px 20px 0px#999fa5;
}
.form {
  text-align: center;
  width: 80%;
}
</style>
