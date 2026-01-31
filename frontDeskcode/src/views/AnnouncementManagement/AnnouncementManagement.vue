<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialog.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialog.vue";
import TwoNew from "./components/twoNew.vue";
import fenYe from "./components/fenye.vue";
import moment from "moment";
import {
  Addannouncenment,
  getAnnouncenmentList,
  announcenmentDetail,
  updateAnnouncenment,
  deleteAnnouncenment,
} from "@/apis/announcementNodejs.js"
const timeFormat = "YYYY-MM-DD HH:mm:ss"
const timeFormatSelect = "YYYY-MM-DD"
let newTwoTable = ref(null);
let formToEdit = reactive({
  title: "",
  content: "",
  announcementType: "",
  picture: "",
})
let textTitle = ref("发布记录")
let inputPlod = "输入标题等"
let inputText = ref(null)
let tableheight = ref("692px")
let tableWidth1 = ref("80%")
let editId;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let announcementType = "";
let announcementStatus = "";
let releaseTime = "";
let title = "";
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
      title,
  announcementType,
  announcementStatus,
  releaseTime
    ) 


  };
}
const updateFilterdataSocket = async (
  val,
  fenRow,
  title,
  announcementType,
  announcementStatus,
  releaseTime
) => {

  await getAnnouncenmentList(
    title,
    announcementType,
    announcementStatus,
    releaseTime,
    fenRow,
    val
  ).then((res) => {
    tableData.value = res.data.data.rows;
    let len = res.data.total;
    console.log(res.data);
    let pagecount = Math.ceil(len / fenRow);
    changePage.total = len;
    if (len > 0) {
      changePage.pageCount = pagecount;
    } else {
      changePage.pageCount = 1;
    }
  })
  getTwo()
}

const updateFilterdata = async (
  val,
  fenRow,
  title,
  announcementType,
  announcementStatus,
  releaseTime
) => {

  await getAnnouncenmentList(
    title,
    announcementType,
    announcementStatus,
    releaseTime,
    fenRow,
    val
  ).then((res) => {
    tableData.value = res.data.data.rows;
    sendMessageToServer()
    let len = res.data.total;
    console.log(res.data);
    let pagecount = Math.ceil(len / fenRow);
    changePage.total = len;
    if (len > 0) {
      changePage.pageCount = pagecount;
    } else {
      changePage.pageCount = 1;
    }
  })
  getTwo()
}
updateFilterdata('', '', title, announcementType, announcementStatus, releaseTime);

async function getTwo() {
  let dataLast = []
  let dataBefore = []
  let len = 0
  let lastPage 
  await getAnnouncenmentList("", "", "", "", '', '').then((res) => {
      lastPage = Math.ceil(res.data.total/fenRow)   
  })
  
  await getAnnouncenmentList("", "", "", "", fenRow, lastPage).then((res) => {
    dataLast = res.data.data.rows
    len = dataLast.length
  })
  if (len < 2 &&lastPage > 1) {
    await getAnnouncenmentList("", "", "", "", fenRow, lastPage - 1).then(
      (res) => {
        let reLen = 2 - len
        dataBefore = res.data.data.rows.splice(fenRow - reLen)
      }
    )
  } else if (len > 2) {
    dataLast = dataLast.splice(len - 2)
  }
  let data = dataBefore.concat(dataLast)
  newTwoTable.value = data
}
const select = [
  {
    placeholder: "公告类型",
    options: [
      {
        value: "招聘",
        label: "招聘",
      },
      {
        value: "活动",
        label: "活动",
      },
      {
        value: "提醒",
        label: "提醒",
      },
      {
        value: "通知",
        label: "通知",
      },
    ],
  },
  {
    placeholder: "公告状态",
    options: [
      {
        value: "待审核",
        label: "待审核",
      },
      {
        value: "已审核",
        label: "已审核",
      },
      {
        value: "未通过",
        label: "未通过",
      },
    ],
  },
  {
    placeholder: "发布时间",
    options: [
      {
        value: "Option1",
        label: "Option1",
      },
      {
        value: "Option2",
        label: "Option2",
      },
    ],
  },
];
let selectText = ref(new Array(select.length).fill(""))
let cols = [
  {
    propName: "title",
    labelName: "标题",
    width: "180px",
  },
  {
    propName: "content",
    labelName: "内容描述",
    width: "270px",
  },
  {
    propName: "announcementType",
    labelName: "公告类型",
    width: "90px",
  },
  {
    propName: "announcementStatus",
    labelName: "公告状态",
    width: "120px",
  },
  {
    propName: "releaseTime",
    labelName: "发布时间",
    width: "180px",
  },
  {
    propName: "picture",
    labelName: "照片",
    width: "180px",
  },
]
let editIconn = [
  {
    imgIcon: "../../src/assets/edit4.png",
    name: "导出",
  },
  {
    imgIcon: "../../src/assets/edit3.png",
    name: "新增",
  },
]
function getInput(input, selectd){
  inputText.value = input.value;
  console.log(input.value);
  selectText.value = selectd.value;
  title = input.value;
  announcementType = selectd.value[0];
  announcementStatus = selectd.value[1];
  if (selectd.value[2]) {
    releaseTime = moment(selectd.value[2]).format(timeFormatSelect);
  } else {
    releaseTime = undefined;
  }
  
  updateFilterdata(
    1,
    fenRow,
    title,
    announcementType,
    announcementStatus,
    releaseTime
  )
  
}
const clearInput = () => {
  inputText.value = ""
  selectText.value = []
  announcementType = ""
  announcementStatus = ""
  releaseTime = ""
  title = ""
  updateFilterdata(
    1,
    fenRow,
    '',
    '',
    '',
    undefined
  )
}
let exportVisible = ref(false);
const getVisible = (e) => {
  exportVisible.value = e
}
let addVisible = ref(false)
const getVisibleAdd = (e) => {
  textTitleOperate.value = "新增" + textTitle.value
  addVisible.value = e
  formToEdit.value = null
}
const closeExportDialog = () => {
  exportVisible.value = false
}
const closeAddDialog = () => {
  addVisible.value = false
}
//新增
async function getForm(params, title) {
  params.announcementStatus = "待审核"
  params.releaseTime = moment(params.releaseTime).format(timeFormat)
  if (title.indexOf("新增") !== -1) {
    await Addannouncenment(params).then((res) => {

      console.log(res);
    })
    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      title,
      announcementType,
      announcementStatus,
      releaseTime
    )
  } else if (title.indexOf("修改") !== -1) {
    await updateAnnouncenment(editId, params).then((res) => {});
    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      title,
      announcementType,
      announcementStatus,
      releaseTime
    )
  }
  addVisible.value = false
}
const getdeleteNoteId = async (e) => {
  await deleteAnnouncenment(e)
  updateFilterdata(
    changePage.currentPage,
    fenRow,
    title,
    announcementType,
    announcementStatus,
    releaseTime
  )
}
let textTitleOperate = ref(null);
const geteditId = async (e) => {
  editId = e;
  textTitleOperate.value = "修改" + textTitle.value;
  await announcenmentDetail(e).then((res) => {
    formToEdit.value = res.data.data
    addVisible.value = true
  })
}
const getCurrentPage = (e) => {
  changePage.currentPage = e
  updateFilterdata(e, fenRow, title, announcementType, announcementStatus, releaseTime)
}
</script>
<template>
  <div class="RuralBlockk">
    <TwoNew :newTwoTable="newTwoTable"></TwoNew>
  </div>
  <div class="RuralBlock">
    <Tableheader
      :textTitle="textTitle"
      :inputPlod="inputPlod"
      :select="select"
      :editIconn="editIconn"
      @getInputText="getInput"
      @clearInputText="clearInput"
      @exportExcel="getVisible"
      @addForm="getVisibleAdd"
    ></Tableheader>
    <div
      style="
        height: 502px;
        width: 100%;
        top: 120px;
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
        @editId="geteditId"
      ></Table>
      <fenYe
        :changePage="changePage"
        :fenRow="fenRow"
        @getCurrentPage="getCurrentPage"
        :inputText="inputText"
        :selectText="selectText"
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
    ></ExportDialog>
    <Dialog
      :addVisible="addVisible"
      @closeAddDialog="closeAddDialog"
      :textTitle="textTitleOperate"
      @formGet="getForm"
      :formToEdit="formToEdit"
    ></Dialog>
  </div>
</template>
<style scoped lang="scss">
.RuralBlock {
  width: 1635px;
  height: 622px;
  background-color: white;
  border-radius: 16px;
  margin-top: 80px;
  position: relative;
}
.RuralBlockk {
  width: 1635px;
  height: 265px;
  background-color: white;
  border-radius: 16px;
}

</style>
