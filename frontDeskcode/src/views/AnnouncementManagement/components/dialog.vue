<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "../../../store";
import { uploadG } from "@/apis/uploadImage.js";
import { getCurrentInstance } from "vue";
const cns = getCurrentInstance();
let props = defineProps({ addVisible: {}, textTitle: {}, formToEdit: {} });
let { addVisible, textTitle } = props;
let labelNameArr = ref([]);
let formToEdit = reactive({
  title: "",
  content: "",
  announcementType: "",
  picture: "",
});
let ruleFormRef = ref(null);
let form;
let formYes = reactive({
  title: "",
  content: "",
  announcementType: "",
  picture: "",
});
watch(
  () => props,
  () => {
    if (props.textTitle.indexOf("修改") !== -1 && props.formToEdit.value) {
      formToEdit = props.formToEdit.value;

      let name = props.formToEdit.value.picture.substring(
        props.formToEdit.value.picture.lastIndexOf("/") + 1
      );
      fileList.value = new Array({ url: props.formToEdit.value.picture, name: name });
    } else if (props.textTitle.indexOf("新增") !== -1) {
      formToEdit = formYes;
      fileList.value = [];
    }
  },
  {
    deep: true,
  }
);
let labelNameArrYes = [
  { label: "标题", type: "input" },
  { label: "内容描述", type: "textarea" },
  { label: "公告类型", type: "select" },
  { label: "上传照片", type: "upload" },
];

form = formYes;
labelNameArr.value = labelNameArrYes;
watch(
  () => props,
  () => {
    dialogVisible.value = props.addVisible;
    if (props.addVisible === true) {
      VehicleInformation();
    }
    textTitle = props.textTitle;
  },
  {
    deep: true,
  }
);
let selectForm1 = selectForm();
let labelPosition = ref("left");
let emits = defineEmits(["formGet"]);
let dialogVisible = ref(false);
let select = reactive([]);
let rules = reactive({
  title: [{ required: true, message: "请填写标题", trigger: "blur" }],
  content: [{ required: true, message: "请填写内容描述", trigger: "blur" }],
  announcementType: [{ required: true, message: "请选择公告类型", trigger: "blur" }],
});
let form1;
let formFilter;
function VehicleInformation() {
  dialogVisible.value = true;
  select = ["1", "2"];
}

function handelCancel() {
  if (textTitle.indexOf("新增") === -1) {
    if (form1 !== undefined) {
      emits("formGet", form1, textTitle);
    }
  }
  dialogVisible.value = false;
}

let fileList = ref([]);
const beforePicUpload = (file) => {
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
  formdata.append("file", file.file);
  await uploadG(formdata).then((res) => {
    let str = cns.appContext.config.globalProperties.$uploadUrl;
    formToEdit.picture = str + res.data.data;
  });
};
let upload = ref(null);
function handleExceed(files, fileList) {
  ElMessage.warning("当前限制选择 1 个一张");
}

const getVisibleNow = () => {
  emits("closeAddDialog");
};
let textSwitch = reactive("否");
let getChange = (res) => {
  ruleFormRef.value.clearValidate();
  if (res == false) {
    textSwitch = "否";
  } else {
    textSwitch = "是";
  }
  labelNameArr.value = labelNameArrYes;
  form = formYes;
};
function addData() {
  ruleFormRef.value.validate(async (valid) => {
    if (fileList.value.length === 0) {
      ElMessage.error("请上传照片");
    }
    if (valid && fileList.value.length > 0) {
      dialogVisible.value = false;

      emits("formGet", formToEdit, textTitle);
    }
  });
}

let selectArr = { announcementType: ["招聘", "活动", "提醒", "通知"] };
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="24%"
    custom-class="classDialog"
  >
    <el-form
      :model="formToEdit"
      ref="ruleFormRef"
      :rules="rules"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-form-item
        :label="item.label"
        v-for="(item, index) in labelNameArr"
        :prop="Object.keys(form)[index]"
      >
        <div v-if="item.type === 'switch'">
          <el-switch
            v-model="formToEdit.isresidents"
            @change="getChange"
            style="--el-switch-on-color: #f3b805"
          />
          {{ textSwitch }}
        </div>
        <div v-if="item.type === 'textarea'" style="width: 90%">
          <el-input
            type="textarea"
            :rows="5"
            maxlength="255"
            show-word-limit
            v-model="formToEdit.content"
          />
        </div>
        <div v-if="item.type === 'input'" style="width: 90%">
          <el-input
            v-model="formToEdit[Object.keys(form)[index]]"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === 'select'" style="width: 90%">
          <el-select v-model="formToEdit[Object.keys(form)[index]]" placeholder="请选择">
            <el-option
              :label="item"
              :value="item"
              v-for="item in selectArr[Object.keys(form)[index]]"
            />
          </el-select>
        </div>
        <div v-if="item.type === 'upload'" style="text-align: left">
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
          >
            <el-button type="primary" color="#F3B805">
              <img src="/src/assets/upload.png" /><span
                style="font-weight: 700; font-size: 14px"
                >上传图片</span
              >
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span style="display: flex; justify-content: center">
        <el-button @click="handelCancel" style="width: 110px">取 消</el-button>
        <el-button color="#F3B805" @click="addData" style="width: 110px">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
