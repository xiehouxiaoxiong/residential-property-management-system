<script setup lang="ts">
import { uploadG } from "@/apis/uploadImage.js";
import { reactive, ref, onUpdated } from "vue";
import SuccessDialog from "./components/success.vue";
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
import { useUserStore } from "@/store/userStore";
import { getCurrentInstance } from "vue";
import { UserDetailById } from "@/apis/sysUser";
const cns = getCurrentInstance();

const userStore = useUserStore();

let form = ref(null);
form.value = {
  avatar: "",
  userName: "",
  sex: "",
  number: "",
};
const getUserDetail = async () => {
  let id = userStore.userInfo.user.userId;
  console.log(userStore.userInfo);

  await UserDetailById(id).then((res) => {
    console.log("***********");

    console.log(res.data);

    form.value = res.data.data.user;
    console.log(form.value);
  });
};

getUserDetail();

let formToEdit = reactive({
  avatar: "",
  userName: "",
  sex: "",
  number: "",
  userId: "",
  password: "",
});

console.log(userStore.userInfo);

formToEdit.value = userStore.userInfo.user;
let form2 = ref(null);
form2.value = {
  userId: userStore.userInfo.user.userId,
  password: userStore.userInfo.user.password,
};

let labelName = ["头像", "姓名", "性别"];
let labelName3 = ["工号"];
let labelName2 = ["账号", "密码"];
let operate = ["修改", "更换"];
let firstVisible = ref(false);
let secondVisible = ref(false);
let titleArray = reactive(["修改姓名", "修改性别", "修改工号"]);
let secondArray = reactive(["修改账号", "修改密码"]);
let title = ref("修改昵称");
let title2 = ref("");
let indexDialog = ref(1);
let indexDialog2 = ref(1);

function dialogVisible(index) {
  console.log(index);
  indexDialog.value = index;
  firstVisible.value = true;
  title.value = titleArray[index - 1];
}
function dialogVisible2(index) {
  secondVisible.value = true;
  title2.value = secondArray[index];
}
let formPassword = reactive({
  nowPassword: "",
  newPassword: "",
  confirmPassword: "",
});
let labelPassword = ["当前密码", "新密码", "确认密码"];
let changePhone = ref(false);

//上传头像
const imageUrl = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  console.log(imageUrl.value);
};
const getImgUrl = (res) => {
  console.log(res);
  console.log(imageUrl.value);
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
let checkPasswordd = (rule, value, callback) => {
  if (formPassword.newPassword !== value) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

let formRef = ref(null);

let rules = {
  nowPassword: [
    {
      required: true,
      message: "请输入当前密码",
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur",
    },
  ],
  confirmPassword: [
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

let fileList = ref([]);

const beforePicUpload = (file) => {
  console.log(fileList.value);

  const fileName = file.name;
  const fileType = fileName.substring(fileName.lastIndexOf("."));
  const isOKType =
    fileType === ".jpg" ||
    fileType === ".png" ||
    fileType === ".jpeg" ||
    fileType === ".bmp" ||
    fileType === ".gif";
  if (!isOKType) {
    ElMessage.error("图片格式只能为jpeg/png/jpg/bmp/gif");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
  }

  return isLt2M && isOKType;
};
const uploadPic = async (file) => {
  let formdata = new FormData();
  console.log(file.file);

  formdata.append("file", file.file);
  console.log(formdata.get("file"));
  await uploadG(formdata).then((res) => {
    console.log(res);

    let str = cns.appContext.config.globalProperties.$uploadUrl;
    console.log(str + res.data.data);

    form.value.avatar = str + res.data.data;
    fileList.value = [];

    let data = form.value;
    userStore.updateUserProfile(data);
  });
};
let upload = ref(null);
function handleExceed(files, fileList) {}

const confirmData = () => {
  firstVisible.value = false;
  console.log(form.value);
  let data = form.value;
  userStore.updateUserProfile(data);
};

const closeFirst = () => {
  firstVisible.value = false;
  getUserDetail();
};

const closeSecond = () => {
  secondVisible.value = false;
};

const changePassword = () => {
  secondVisible.value = false;

  formRef.value.validate(async (valid) => {
    console.log(valid);

    if (valid) {
      userStore.validatePassword(formPassword.nowPassword).then((res) => {
        console.log(res);

        if (res === true) {
          secondVisible.value = false;
          let newPassword = formPassword.newPassword;
          userStore.UpdatePasswordpass(newPassword);
          ElMessage.success("密码修改成功");
        } else {
          ElMessage.error("当前密码输入错误");
        }
      });
    }
  });
};
let reg = /(\d{3})\d{4}(\d{4})/;
console.log(userStore.userInfo.user.userName);

let showPhoneCodeCount = ref(60);
let timer = 0;

let showPhoneCode = ref(true);
const getPhoneCode = () => {
  if (!timer) {
    showPhoneCodeCount.value = 60;
    showPhoneCode.value = false;
    timer = setInterval(() => {
      if (showPhoneCodeCount.value > 0 && showPhoneCodeCount.value <= 60) {
        showPhoneCodeCount.value--;
      } else {
        showPhoneCode.value = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};
let PhoneCode = ref(null);
let NewAccount = ref(null);
let newPhoneCode = ref(null);
//新号码
let shownewPhoneCodeCount = ref(60);
let newtimer = 0;
let shownewPhoneCode = ref(true);
const getnewPhoneCode = () => {
  if (!newtimer) {
    shownewPhoneCodeCount.value = 60;
    shownewPhoneCode.value = false;
    timer = setInterval(() => {
      if (shownewPhoneCodeCount.value > 0 && shownewPhoneCodeCount.value <= 60) {
        shownewPhoneCodeCount.value--;
      } else {
        shownewPhoneCode.value = true;
        clearInterval(newtimer);
        newtimer = null;
      }
    }, 1000);
  }
};

const tishiChange = () => {
  ElMessage.success(修改成功);
};
</script>
<template>
  <div style="width: 1635px; height: 100%">
    <div style="width: auto; display: flex; height: 100%; flex-direction: column">
      <div style="width: auto; height: 472px">
        <div class="trafficBackgroundEvent">
          <div style="padding-top: 30px; padding-left: 30px">
            <div style="font-weight: 700; font-size: 20px">个人信息</div>
          </div>
          <el-form
            :model="form"
            label-width="120px"
            style="margin-top: 50px; margin-left: -45px; width: 100%"
          >
            <div style="display: flex">
              <div style="width: 50%">
                <el-form-item
                  :label="item"
                  v-for="(item, index) in labelName"
                  style="margin-top: 20px; padding-top: 20px"
                >
                  <div class="titleTrafficc">
                    <div style="font-size: 13px; display: flex" v-if="item === '头像'">
                      <div v-if="form.avatar">
                        <el-image
                          style="
                            width: 64px;
                            height: 64px;
                            border-radius: 32px;
                            margin-top: 20px;
                          "
                          :src="form.avatar"
                          fit="cover"
                        />
                      </div>
                    </div>
                    <div style="font-size: 16px; display: flex" v-if="item !== '头像'">
                      <div style="font-weight: 700; margin-top: 35px">
                        {{ form[Object.keys(formToEdit)[index]] }}
                      </div>
                    </div>

                    <div style="margin-top: 20px" v-if="item === '头像'">
                      <el-upload
                        v-model:file-list="fileList"
                        ref="upload"
                        class="upload-demo"
                        action="#"
                        :limit="1"
                        :on-exceed="handleExceed"
                        list-type="text"
                        :http-request="uploadPic"
                        :before-upload="beforePicUpload"
                        :show-file-list="false"
                      >
                        <el-button type="primary" color="#F3B805">
                          <img src="/src/assets/upload.png" /><span
                            style="font-weight: 700; font-size: 14px"
                            >上传图片</span
                          >
                        </el-button>
                      </el-upload>
                    </div>
                    <div
                      style="
                        font-weight: 700;
                        font-size: 14px;
                        color: #f3b805;
                        margin-top: 20px;
                      "
                      v-if="item !== '头像'"
                      @click="dialogVisible(index)"
                    >
                      修改
                    </div>
                  </div>

                  <div
                    style="
                      width: 100%;
                      height: 1px;
                      background-color: #f9fafa;
                      margin-top: 40px;
                    "
                  ></div>
                </el-form-item>
              </div>
              <div style="width: 50%; margin-top: 15px">
                <el-form-item
                  :label="item"
                  v-for="(item, index) in labelName3"
                  style="padding-top: 24px"
                >
                  <div class="titleTrafficc">
                    <div style="font-size: 16px; display: flex">
                      <div style="font-weight: 700; margin-top: 35px">
                        {{ form.number }}
                      </div>
                    </div>

                    <div
                      style="
                        font-weight: 700;
                        font-size: 14px;
                        color: #f3b805;
                        margin-top: 30px;
                      "
                      @click="dialogVisible(index + 3)"
                    >
                      修改
                    </div>
                  </div>
                  <div
                    style="
                      width: 100%;
                      height: 1px;
                      background-color: #f9fafa;
                      margin-top: 40px;
                    "
                  ></div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <el-dialog
          v-model="firstVisible"
          :title="title"
          width="24%"
          :before-close="handleClose"
        >
          <div style="display: flex" v-if="indexDialog !== 3">
            <div style="width: 80px; margin-top: 5px">{{ labelName[indexDialog] }}</div>
            <el-input
              placeholder="请输入"
              v-model="form[Object.keys(formToEdit)[indexDialog]]"
            ></el-input>
          </div>
          <div style="display: flex" v-if="indexDialog === 3">
            <div style="width: 80px; margin-top: 5px">
              {{ labelName3[indexDialog - 3] }}
            </div>
            <el-input
              placeholder="请输入"
              v-model="form[Object.keys(formToEdit)[indexDialog]]"
            ></el-input>
          </div>

          <template #footer>
            <span class="dialog-footer" style="justify-content: center; display: flex">
              <el-button @click="closeFirst" style="width: 120px">取消</el-button>
              <el-button
                type="primary"
                @click="confirmData"
                style="width: 120px"
                color="#F3B805"
              >
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <div style="width: 100%; height: 500px; margin-top: 20px">
        <div class="trafficBackgroundEvent">
          <div style="padding-top: 30px; padding-left: 30px; width: 100%; height: 100%">
            <div style="font-weight: 700; font-size: 20px">账号设置</div>
            <el-form
              :model="form2"
              label-width="120px"
              style="margin-top: 50px; margin-left: -75px; width: 100%"
            >
              <el-form-item
                :label="item"
                v-for="(item, index) in labelName2"
                style="margin-top: 20px; padding-top: 20px"
              >
                <div class="titleTrafficc">
                  <div style="font-size: 16px; display: flex">
                    <div style="font-weight: 700; margin-top: 35px" v-if="index === 0">
                      {{ form2.userId }}
                    </div>
                    <div style="font-weight: 700; margin-top: 35px" v-if="index === 1">
                      ***********
                    </div>
                  </div>

                  <div
                    style="
                      font-weight: 700;
                      font-size: 14px;
                      color: #f3b805;
                      margin-top: 20px;
                    "
                    @click="dialogVisible2(index)"
                    v-if="index !== 0"
                  >
                    {{ operate[index] }}
                  </div>
                </div>

                <div
                  style="
                    width: 100%;
                    height: 1px;
                    background-color: #f9fafa;
                    margin-top: 40px;
                  "
                ></div>
              </el-form-item>
            </el-form>
          </div>
          <el-dialog
            v-model="secondVisible"
            :title="title2"
            width="24%"
            :before-close="handleClose"
          >
            <el-form
              :model="formPassword"
              label-width="80px"
              v-if="title2 === '修改密码'"
              ref="formRef"
              :rules="rules"
            >
              <el-form-item
                :label="labelPassword[index]"
                v-for="(item, index) in labelPassword"
                :prop="Object.keys(formPassword)[index]"
              >
                <el-input v-model="formPassword[Object.keys(formPassword)[index]]" />
              </el-form-item>
            </el-form>

            <template #footer>
              <span class="dialog-footer" style="justify-content: center; display: flex">
                <el-button @click="closeSecond" style="width: 120px">取消</el-button>
                <el-button
                  type="primary"
                  @click="changePassword"
                  style="width: 120px"
                  color="#F3B805"
                >
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
        </div>

        <SuccessDialog ref="successdia"></SuccessDialog>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.el-form-item__label) {
  line-height: 55px;
}

.trafficBackgroundEvent {
  width: 100%;
  height: 100%;
  margin-top: 0px;
  background-color: white;
  border-radius: 16px;
  position: relative;
  text-align: left;
}
.titleTraffic {
  width: 90%;
  display: flex;
  justify-content: space-between;
  height: 30px;

  padding-left: 30px;
}
.titleTrafficc {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 25px;

  padding-left: 30px;
  margin-top: -24px;
}
.el-row {
  padding-left: 20px;
}
</style>
