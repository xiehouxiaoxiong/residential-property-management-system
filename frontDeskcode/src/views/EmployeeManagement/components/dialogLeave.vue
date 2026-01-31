<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "../../../store";
import { uploadOne } from "@/apis/uploadImage.js";
import { getCurrentInstance } from "vue";
import {getEmployeeNumberList} from '@/apis/employee'
const cns = getCurrentInstance();
let props = defineProps({ addVisible: {}, textTitle: {}, formToEdit: {} });
let { addVisible, textTitle } = props;
let labelNameArr = ref([]);
let formToEdit = reactive({
  number:'',
  leavingDate:'',
  pretext:'',
  leavingAddress:'',
  leavingStatus:'',
  
});
let ruleFormRef = ref(null);
let form;
let formYes = reactive({
  number:'',
  leavingDate:'',
  pretext:'',
  leavingAddress:'',
  leavingStatus:'',
});
watch(
  () => props,
  () => {
    if (props.textTitle.indexOf("审核") !== -1 && props.formToEdit.value) {
      formToEdit = props.formToEdit.value;

     
    } else if (props.textTitle.indexOf("新增") !== -1) {
      formToEdit = formYes;
    
    }
  },
  {
    deep: true,
  }
);
let labelNameArrYes = [
  { label: "工号", type: "input" },
  { label: "请假时间", type: "dateTodate" },
  { label: "事由类型", type: "select" },
  { label: "请假地址", type: "input" },
  { label: "状态", type: "select" },
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
let validateNumber = (rule,value,callback)=>{
  console.log(value);
  if(value){
    getEmployeeNumberList().then((res)=>{
      console.log(res);
      let numberList = res.data.data.result.map((item)=>{
            return item.number
      })
      console.log(numberList);
      console.log(value);
      if(numberList.includes(value)){
        callback()
      }else{
        ElMessage.error('不存在此员工')
        callback()
      }
    })
  }else{
    callback('请填写工号')
  }
}
let rules = reactive({
  number: [{ required: true, message: "请填写工号", trigger: "blur",validator: validateNumber }],
  leavingDate: [{ required: true, message: "请选择请假时间", trigger: "blur" }],
  pretext: [{ required: true, message: "请选择事由类型", trigger: "blur" }],
  leavingStatus: [{ required: true, message: "请选择审核状态", trigger: "blur" }],
  leavingAddress: [{ required: true, message: "请填写请假地址", trigger: "blur" }],
});
let form1;
let formFilter;

function VehicleInformation() {
  dialogVisible.value = true;

}
//父组件修改子组件的表单弹窗
function handelCancel() {
  if (textTitle.indexOf("新增") === -1) {
    if (form1 !== undefined) {
      emits("formGet", form1, textTitle);
    }
  }
  dialogVisible.value = false;
}
//上传照片
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
  await uploadOne(formdata).then((res) => {
    let str = cns.appContext.config.globalProperties.$uploadUrl;
    formToEdit.picture = str + res.data.fileName;
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
   
    if (valid) {
      dialogVisible.value = false;

      console.log(formToEdit.leavingDate)
    
      emits("formGet", formToEdit, textTitle);
    }
  });
}

let selectArr = { pretext: ["事假", "病假"],leavingStatus:['待审核','通过','打回'] };
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="27%"
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
       
        <div v-if="item.type === 'textarea'" style="width: 90%">
          <el-input
            type="textarea"
            :rows="5"
            maxlength="255"
            show-word-limit
            v-model="formToEdit.address"
          />
        </div>
        <div v-if="item.type === 'input'" style="width: 90%">
          <el-input
            v-model="formToEdit[Object.keys(form)[index]]"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === 'dateTodate'" style="width: 90%">
            <el-date-picker
            v-model="formToEdit.leavingDate"
            type="daterange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束之间"
            size="default"
            
          />
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

