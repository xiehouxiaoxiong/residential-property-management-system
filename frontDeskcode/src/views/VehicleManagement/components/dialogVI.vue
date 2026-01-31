<script setup>
import { ref, reactive, watch,onUpdated,onMounted } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "@/store";
import {getProprietorList} from '@/apis/proprietorManage.js'
import {uploadG} from '@/apis/uploadImage.js'
let props = defineProps({ addVisible: {}, textTitle: {},formToEdit:{} });
let labelNameArr = ref([
  { label: "姓名", type: "selectv2" },
  { label: "车牌号", type: "input" },
  { label: "车辆类型", type: "select" },
  { label: "汽车品牌", type: "select" },
   { label: "颜色", type: "input" },
   {label:'车辆照片',type:"carPicture"},
   {label:'行驶证',type:"drivingLicense"},
]);


let textSwitch = reactive("是");
import {getCurrentInstance} from 'vue'
const cns = getCurrentInstance()

let formToEdit = reactive({
  userId:"",
  licenseNumber: "",
  carType: "",
  carBrand:'',
  carColor:'',
  carPicture:'',
  drivingLicense:''
})
let { addVisible, textTitle } = props;

let form= reactive({
   userId:"",
   licenseNumber: "",
   carType: "",
   carBrand:'',
   carColor:'',
   carPicture:'',
  drivingLicense:''
});

watch(()=>props.formToEdit,()=>{
  if(textTitle.indexOf('修改')!==-1){
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

  userId: [{ required: true, message: "请选择业主", trigger: "blur" }],
  licenseNumber: [{ required: true, message: "请填写车牌号", trigger: "blur" }],
  carType:[{ required: true, message: "请选择车辆类型", trigger: "blur" }],
  carBrand:[{ required: true, message: "请选择汽车品牌", trigger: "blur" }],
  carColor:[{ required: true, message: "请填写颜色", trigger: "blur" }],
  carPicture:[{ required: true, message: "请上传汽车照片", trigger: "blur" }],
  drivingLicense:[{ required: true, message: "请上传行驶证", trigger: "blur" }],
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


function addData() {
  

  ruleFormRef.value.validate(async (valid) => {
    console.log(valid);

 

     if(valid){
    
      
      dialogVisible.value = false;

      emits("formGet", formToEdit, textTitle);
    
    }
 
  });
}

let selectArr={carType:['轿车','摩托车','货车','挂车'],carBrand:['大众','宝马','比亚迪','奔驰','奥迪','劳斯莱斯']}

let userNameOptions = ref([]);
let totalProprietor = ref(null)
getProprietorList('','',1,1).then((res)=>{
    totalProprietor.value = res.data.total
   getProprietorList('','',totalProprietor.value,1).then((res)=>{
      res.data.data.rows.forEach((item)=>{
        let obj={}
        obj.label = item.userName
        obj.value = item.userId
        userNameOptions.value.push(obj)

        
      })
      console.log(userNameOptions);
    })
}) 

const onBlur = (evn) => {
	if (evn.target.value) {
		formToEdit.userId= evn.target.value;
	}
};

let fileList1 = ref([]);
let fileList2 = ref([]);
const beforePicUpload1 = (file) => {
  console.log(fileList1.value);


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
const beforePicUpload2 = (file) => {
  console.log(fileList2.value);


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
const uploadPic1 = async (file) => {
  let formdata = new FormData();
  console.log(file.file);
  
  
  formdata.append("file", file.file);
  console.log(formdata.get("file"));
  await uploadG(formdata).then((res) => {
    console.log(res);

    let str = cns.appContext.config.globalProperties.$uploadUrl;
    console.log(str + res.data.data);


    formToEdit.carPicture = str + res.data.data
    fileList1.value=[]
  
  })

};
const uploadPic2 = async (file) => {
  let formdata = new FormData();
  console.log(file.file);
 
  
  formdata.append("file", file.file);
  console.log(formdata.get("file"));
  await uploadG(formdata).then((res) => {
    console.log(res);

    let str = cns.appContext.config.globalProperties.$uploadUrl;
    console.log(str + res.data.data);

    formToEdit.drivingLicense = str + res.data.data
    fileList2.value=[]

    
        
    })

    
  }

let upload1 = ref(null);
let upload2 = ref(null);
function handleExceed1(files, fileList) {
 
}
function handleExceed2(files, fileList) {

}
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
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
       
        <div v-if="item.type === 'input'" style="width:250px">
          <el-input
            v-model="formToEdit[Object.keys(form)[index]]"
            style="width: 100%"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === 'select'" style="width:250px">
          <el-select v-model="formToEdit[Object.keys(form)[index]]" placeholder="请选择" style="width:100%">
            <el-option :label="item" :value="item" v-for="item in selectArr[Object.keys(form)[index]]"/>
           
            
          </el-select>
        </div>
        <div v-if="item.type === 'selectv2'" style="width:250px">
         	<el-select-v2
            v-model="formToEdit.userId"
            :options="userNameOptions"
            placeholder="请输入或选择业主"
            filterable
            clearable
            @blur="onBlur"
          />
       </div>
         <div  v-if="item.type ==='carPicture'" style="width:250px;display:flex">
                     
                             <text style="max-width:150px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">   {{formToEdit.carPicture}}</text>
                                     <el-upload
                              v-model:file-list="fileList1"
                              ref="upload1"
                              class="upload-demo"
                              action="#"
                              :limit="1"
                              :on-exceed="handleExceed1"
                              list-type="text"
                              :http-request="uploadPic1"
                              :before-upload="beforePicUpload1"
                              :show-file-list="false"
                       
                            >
                               <el-button type="primary" color="#F3B805">

                                      <img src="/src/assets/upload.png"><span style="font-weight:700;font-size:14px">上传图片</span>
                                </el-button>
                              
                            </el-upload>
                                    
                                </div> 
             <div  v-if="item.type ==='drivingLicense'" style="width:250px;display:flex">
                            <text style="max-width:150px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">   {{formToEdit.drivingLicense}}</text>
                                     <el-upload
                              v-model:file-list="fileList2"
                              ref="upload2"
                              class="upload-demo"
                              action="#"
                              :limit="1"
                              :on-exceed="handleExceed2"
                              list-type="text"
                              :http-request="uploadPic2"
                              :before-upload="beforePicUpload2"
                              :show-file-list="false"
                       
                            >
                               <el-button type="primary" color="#F3B805">

                                      <img src="/src/assets/upload.png"><span style="font-weight:700;font-size:14px">上传图片</span>
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
<style scoped></style>
