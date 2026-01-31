<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from './components/dialog.vue'
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogInfo.vue";
import fenYe from './components/fenye.vue'

import {
  getRepairInfoList,
  RepairInfoDetailById,
  UpdateRepairInfo,
  deleteRepairInfo,
} from "@/apis/repairInfo"; 
let editItem
let tableData = ref([]);
let fenRow = 10
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userId=""
let auditStatus=""
let repairProgress=""
updateFilterdata(1, fenRow,'','','');

async function updateFilterdata(val, fenRow,userId, auditStatus, repairProgress) {

  console.log(fenRow, val,userId, auditStatus, repairProgress);
  await getRepairInfoList(userId, auditStatus, repairProgress,fenRow, val).then((res) => {
    console.log(res.data);
    tableData.value = res.data.data.rows;
    sendMessageToServer()
    let len = res.data.total;

    let pagecount = Math.ceil(len / fenRow);
    changePage.total = len;
    
    if (len > 0) {
      changePage.pageCount = pagecount;
    } else {
      changePage.pageCount = 1;
    }
  });
}
function sendMessageToServer() {

   var ws = new WebSocket('ws://localhost:8080');

   ws.onopen = function () {
    console.log('ws onopen');
     ws.send('from client: hello');
  };

  ws.onmessage = function (e) {
    console.log('ws onmessage');
    console.log('from server: ' + e.data);
     updateFilterdataSocket(
      changePage.currentPage,
      fenRow,
      userId, auditStatus, repairProgress
    ) 


  };
}
async function updateFilterdataSocket(val, fenRow,userId, auditStatus, repairProgress) {

  console.log(fenRow, val,userId, auditStatus, repairProgress);
  await getRepairInfoList(userId, auditStatus, repairProgress,fenRow, val).then((res) => {
    console.log(res.data);
    tableData.value = res.data.data.rows;
    let len = res.data.total;

    let pagecount = Math.ceil(len / fenRow);
    changePage.total = len;
    
    if (len > 0) {
      changePage.pageCount = pagecount;
    } else {
      changePage.pageCount = 1;
    }
  });
}
const select = [
  {
    placeholder: "审核状态",
    options: [
      {
        value: "待审核",
        label: "待审核",
      },
      {
        value: "通过",
        label: "通过",
      },
      {
        value: "不通过",
        label: "不通过",
      },
    ],
  },
  {
    placeholder: "维修进展",
    options: [
      {
        value: "申请",
        label: "申请",
      },
      {
        value: "受理",
        label: "受理",
      },
      {
        value: "派工",
        label: "派工",
      },
       {
        value: "完工",
        label: "完工",
      },
      {
        value: "评价",
        label: "评价",
      },
    ],
  },
 
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "userId",
    labelName: "用户ID",
    width: "100px",
  },
  {
    propName: "repairAddress",
    labelName: "报修地址",
    width: "120px",
  },
  {
    propName: "repairDate",
    labelName: "预约报修时间",
    width: "140px",
  },
  {
    propName: "repairPicture",
    labelName: "报修细节图片",
    width: "140px",
  },
  {
    propName: "repairEmployeeId",
    labelName: "维修师傅ID",
    width: "140px",
  },
   {
    propName: "repairProgress",
    labelName: "维修进展",
    width: "140px",
  },
  {
    propName: "repairEvent",
    labelName: "维修项目",
    width: "160px",
  },
  {
    propName: "repairDetail",
    labelName: "维修详情",
    width: "160px",
  },
  {
    propName: "applicationtime",
    labelName: "申请时间",
    width: "200px",
  },
  {
    propName: "auditStatus",
    labelName: "审核状态",
    width: "100px",
  }
];

let textTitle = ref("报修信息管理");
let inputPlod = "输入用户ID"
let inputText = ref(null)
let tableheight = ref("692px");
let tableWidth1 = ref("80%");
let editIcon = []
let editIconn = [
  {
    imgIcon: "../../src/assets/edit4.png",
    name: "导出",
  }
];

const getInput = (input,selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userId=input.value
  auditStatus=selectd.value[0]
  repairProgress=selectd.value[1]
  changePage.currentPage=1
  console.log(1, fenRow,userId,);
  
  updateFilterdata(1, fenRow,userId,auditStatus,repairProgress)
  
}
const clearInput = ()=>{
  inputText.value = ''
  selectText.value = ''
  userId=""
  auditStatus=""
  repairProgress=""
  changePage.currentPage=1
  updateFilterdata(1, fenRow,userId,auditStatus,repairProgress)
  console.log(inputPlod.value);
}
let exportVisible = ref(false);
const getVisible = (e) => {
  exportVisible.value = e;
  console.log(exportVisible.value);
};
let addVisible = ref(false)



const closeExportDialog = () => {
  exportVisible.value = false;

}
const closeAddDialog = () => {
  addVisible.value = false;

}

async function getForm(params,title) {  
     console.log(params);
     addVisible.value=false
     await UpdateRepairInfo(editItem,params).then((res)=>{
                console.log(res);
                addVisible.value=false
     })
     await updateFilterdata(changePage.currentPage, fenRow,userId, auditStatus, repairProgress)

}


const getdeleteNoteId = async(e)=>{
  console.log(e)
  await deleteRepairInfo(e)
  updateFilterdata(changePage.currentPage, fenRow,userId, auditStatus, repairProgress)
}

let formToEdit =ref(null)

let textTitleOperate =ref(null)

const geteditItem = async(e)=>{
  console.log(e);
  editItem =e.id
  textTitleOperate.value = "修改"+textTitle.value
  await RepairInfoDetailById(e.id).then(res=>{
    console.log(res);
    
    formToEdit.value=res.data.data


    addVisible.value = true
  })
}
const getCurrentPage = (e)=>{
  console.log(e);
   changePage.currentPage = e
   updateFilterdata(e, fenRow,userId, auditStatus, repairProgress);
}

</script>
<template>

  <div class="RuralBlock">
    <Tableheader
      :textTitle="textTitle"
      :inputPlodFirst="inputPlod"
      :select="select"
      :editIcon="editIcon"
      :editIconn="editIconn"
      @getInputText="getInput"
      @clearInputText="clearInput"
      @exportExcel="getVisible"
      @importDataExcel="importDataExcel"
      :cols="cols"
      
    ></Tableheader>
    <div
      style="
        height: 850px;
        width: 100%;
        top: 90px;
        justify-content: center;
        position: absolute;
        display: flex;
      "
    >
    <Table
      :fenRow="fenRow"
      :cols="cols"
      :tableData="tableData"
      :textTitle="textTitle"
      :changePage="changePage"
      @deleteNoteId="getdeleteNoteId"
      @editItem ="geteditItem"
    ></Table>
     <fenYe
        :changePage="changePage"
        :fenRow="fenRow"
        @getCurrentPage="getCurrentPage"
        :selectText="selectText"
        :inputPlod="inputText"
        style="bottom: 20px; position: absolute"
      ></fenYe>
      </div>
    <ExportDialog
      :editIcon="editIcon1"
      :cols="cols"
      :exportVisible="exportVisible"
      @closeExportDialog="closeExportDialog"
      :textTitle="`导出${textTitle}`"
      :inputPlod="inputPlod"
      :select="select"
      :fenRow="fenRow"
      style="position:relative"
    ></ExportDialog>
    <Dialog :addVisible="addVisible" @closeAddDialog="closeAddDialog" :textTitle="textTitleOperate" @formGet="getForm" :formToEdit="formToEdit"></Dialog>
    
  </div>
 
</template>
<style scoped>

.RuralBlock {

  height:850px;
  width:1635px;
  background-color:white;
  border-radius: 16px;
  position:relative
  


}
</style>
