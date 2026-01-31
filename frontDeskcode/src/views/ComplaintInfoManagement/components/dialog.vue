<script setup>
import { ref, reactive, watch,onUpdated,onMounted } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "@/store";
import moment from 'moment'
const timeFormat = "YYYY-MM-DD hh:mm:ss"
let props = defineProps({ addVisible: {}, textTitle: {},formToEdit:{} });
let labelNameArr = ref([
  { label: "姓名", type: "" },
  { label: "联系方式", type: "" },
  { label: "投诉类型", type: "" },
  { label: "投诉内容", type: "" },
   { label: "投诉时间", type: "datetime" },
  { label: "状态", type: "select" },
  { label: "投诉结果", type: "textarea" },
]);
let textSwitch = reactive("是");
import {getCurrentInstance} from 'vue'
const cns = getCurrentInstance()

let formToEdit = reactive({
  userName:"",
  phoneNumber: "",
  complaintType:'',
  textareaContent:'',
  complaintTime:'',
  complaintStatus:'',
  complaintResult:''
})
let { addVisible, textTitle } = props;

let form= reactive({
  userName:"",
  phoneNumber: "",
  complaintType:'',
  textareaContent:'',
  complaintTime:'',
  complaintStatus:'',
  complaintResult:''
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

  complaintStatus: [{ required: true, message: "请选择状态", trigger: "blur" }],
  complaintResult: [{ required: true, message: "请填写投诉结果", trigger: "blur" }],
})
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

let selectArr={complaintStatus:["已受理"]}
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
    custom-class="classDialog"
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
        <div v-if="item.type === 'switch'">
          <el-switch
            :active-value="1"
            :inactive-value="0"
             active-color="#13ce66" 
             inactive-color="rgba(164, 169, 182, 0.20)"
            v-model="formToEdit.isResident"
            @change="getChange"
            style="--el-switch-on-color: #f3b805"
          />
          {{ textSwitch }}
        </div>
        <div v-if="item.type === ''" style="width:250px">
         {{formToEdit[Object.keys(form)[index]]}}
        </div>
        <div v-if="item.type === 'select'" style="width:250px">
          <el-select v-model="formToEdit[Object.keys(form)[index]]" placeholder="请选择" style="width:100%">
            <el-option :label="item" :value="item" v-for="item in selectArr[Object.keys(form)[index]]"/>
           
            
          </el-select>
        </div>
        <div v-if="item.type === 'textarea'" >
          <textarea v-model="formToEdit.complaintResult" style="width:250px"></textarea>
        </div>
          <div v-if="item.type === 'datetime'" style="width:250px">
          {{moment(formToEdit.complaintTime).format(timeFormat)}}
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
