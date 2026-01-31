<script setup>
import { ref, reactive, watch,onUpdated,onMounted } from "vue";
import { ElMessage } from "element-plus";
import {uploadOne} from '@/apis/uploadImage.js'
import { selectForm } from "@/store";
import {getCurrentInstance} from 'vue'
const cns = getCurrentInstance()
let props = defineProps({ addVisible: {}, textTitle: {},formToEdit:{} });
let labelNameArr = ref([
  { label: "用户头像", type: "image" },
  { label: "用户名", type: "input" },
  { label: "性别", type: "select" },
  { label: "工号", type: "" },
  { label: "联系方式", type: "input" }
]);
let textSwitch = reactive("是");

let formToEdit = reactive({
  avatar:"",
  userName:'',
  sex:'',
  number:'',
  phoneNumber:''
})
let { addVisible, textTitle } = props;

let form= reactive({
  avatar:"",
  userName:'',
  sex:'',
  number:'',
  phoneNumber:''
});

watch(()=>props.formToEdit,()=>{
   
    if(props.textTitle.indexOf('修改')!==-1){
      formToEdit = props.formToEdit

  }else{
    formToEdit = form
  }
 
},{
  deep:true
})



watch(
  () => props,
  () => {
    dialogVisible.value = props.addVisible;
    console.log(dialogVisible.value);
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
let ruleFormRef = ref(null);
let rules = reactive({
   avatar: [{ required: true, message: "填写用户ID", trigger: "blur" }],
   userName: [{ required: true, message: "填写用户名", trigger: "blur" }],
   sex: [{ required: true, message: "选择性别", trigger: "blur" }],
   number: [{ required: true, message: "填写工号", trigger: "blur" }],
   phoneNumber: [{ required: true, message: "填写联系方式", trigger: "blur" }],
   
});
let form1;
let formFilter;
function VehicleInformation() {


  dialogVisible.value = true;
  

  select = ["1", "2"];
}


function handelCancel() {
  if (textTitle.indexOf("新增") === -1) {
    console.log(form1);
    if (form1 !== undefined) {
      emits("formGet", form1, textTitle);
    }
  }
  dialogVisible.value = false;
}



const getVisibleNow = () => {
  emits("closeAddDialog");
};

let getChange = (res) => {

  console.log(res);
  if (res == 0) {
    textSwitch = "否";

  } else {
    textSwitch = "是";
  }
  console.log(formToEdit.isResident);
  console.log(formToEdit.isResident===0);
  labelNameArr.value = formToEdit.isResident === 0 ? labelNameArrNo : labelNameArrYes;
  form = formToEdit.isResident === 0 ? formNo : formYes;
};
function addData() {
  

  ruleFormRef.value.validate(async (valid) => {
    console.log(valid);

 

     if(valid){
    
      
      dialogVisible.value = false;

      emits("formGet", formToEdit, textTitle);
    
    }
 
  });
}

let selectArr={sex:["女","男"]}

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
  await uploadOne(formdata).then((res) => {
    console.log(res);

    let str = cns.appContext.config.globalProperties.$uploadUrl;
    console.log(str + res.data.fileName);
  
    formToEdit.avatar = str + res.data.fileName
    fileList.value=[]
  
    let data = form.value
 
    
  });
};
let upload = ref(null);
function handleExceed(files, fileList) {

}
</script>
<template>
  <div>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
    align="left"
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
        <div v-if="item.type === 'image'" style="width:250px;display:flex;align-items:center">
              <div style="width:80px;height:50px"> 
              <el-avatar
                    :src="formToEdit.avatar"
                    style="width:50px;height:50px"
                /></div>
                <div style="margin-left:90rpx;width:100rpx">
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

                                      <img src="/src/assets/upload.png"><span style="font-weight:700;font-size:14px">上传图片</span>
                                </el-button>
                              
                            </el-upload>
                            </div>
        </div>
        <div v-if="item.type === 'input'" style="width:250px">
          <el-input
            v-model="formToEdit[Object.keys(form)[index]]"
            style="width: 100%"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === ''&&textTitle.indexOf('修改')!==-1" style="width:250px">
          {{formToEdit.number}}
        </div>
         <div v-if="item.type === ''&&textTitle.indexOf('新增')!==-1" style="width:250px">
           <el-input
            v-model="formToEdit.number"
            style="width: 100%"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === 'select'" style="width:250px">
          <el-select v-model="formToEdit[Object.keys(form)[index]]" placeholder="请选择" style="width:100%">
            <el-option :label="item" :value="item" v-for="item in selectArr[Object.keys(form)[index]]"/>
           
            
          </el-select>
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
  </div>
</template>
<style scoped>
::v-deep .el-dialog__mask {  
  opacity: 0.5;  
}

</style>
