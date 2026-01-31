<script setup>
import {
  getLeaveInfoList,
  AddLeaveInfo,
  leaveInfoDetailById,
  deleteLeaveInfo,
  updateLeaveInfo,
} from "@/apis/leavingInfo";
import { reactive, ref } from "vue";
import Tableheader from "./header.vue";
import Dialog from "./dialogLeave.vue";
import Table from "./TableLa.vue";
import fenYe from "./fenyeLeave.vue";
import moment from "moment";
const timeFormat = "YYYY-MM-DD hh:mm:ss";
let tableData1 = ref([]);
let fenRow1 = 5;
let editIcon1 = [
  {
    imgIcon: "/src/assets/BatchImport.png",
    name: "批量导入",
  },
];
let editIconn1 = [
  {
    imgIcon: "/src/assets/edit3.png",
    name: "新增",
  },
];
let inputPlod1 = "输入姓名等";
let inputPlodSecond = "请输入工号";
let inputText1 = ref(null);
let inputText2 = ref(null);
const select1 = [
  {
    placeholder: "状态",
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
        value: "打回",
        label: "打回",
      },
    ],
  },
];
let selectText1 = ref(new Array(select1.length).fill(""));

let userName = "";
let number = "";
let leavingStatus = "";
let cols1 = [
  {
    propName: "userName",
    labelName: "姓名",
    width: "100px",
  },
  {
    propName: "number",
    labelName: "工号",
    width: "100px",
  },
  {
    propName: "leavingDate",
    labelName: "请假时间",
    width: "60px",
  },
  {
    propName: "pretext",
    labelName: "事由类型",
    width: "120px",
  },
  {
    propName: "leavingAddress",
    labelName: "请假地址",
    width: "120px",
  },
  {
    propName: "leavingStatus",
    labelName: "状态",
    width: "120px",
  },
];
let changePage1 = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
function sendMessageToServer() {
  var ws = new WebSocket("ws://localhost:8080");

  ws.onopen = function () {
    console.log("ws onopen");
    ws.send("from client: hello");
  };

  ws.onmessage = function (e) {
    console.log("ws onmessage");
    console.log("from server: " + e.data);
    updateFilterdataSocket(
      changePage1.currentPage,
      fenRow1,
      userName,
      number,
      leavingStatus
    );
  };
}

const updateFilterdata1 = async (val, fenRow, userName, number, leavingStatus) => {
  await getLeaveInfoList(userName, number, leavingStatus, fenRow, val).then((res) => {
    console.log(userName, number, leavingStatus);
    tableData1.value = res.data.data.rows;
    sendMessageToServer();
    console.log(res.data);
    let len = res.data.total;
    console.log(res.data);
    let pagecount = Math.ceil(len / fenRow1);
    changePage1.total = len;
    if (len > 0) {
      changePage1.pageCount = pagecount;
    } else {
      changePage1.pageCount = 1;
    }
  });
};

const updateFilterdataSocket = async (val, fenRow, userName, number, leavingStatus) => {
  await getLeaveInfoList(userName, number, leavingStatus, fenRow, val).then((res) => {
    console.log(userName, number, leavingStatus);
    tableData1.value = res.data.data.rows;
    console.log(res.data);
    let len = res.data.total;
    console.log(res.data);
    let pagecount = Math.ceil(len / fenRow1);
    changePage1.total = len;
    if (len > 0) {
      changePage1.pageCount = pagecount;
    } else {
      changePage1.pageCount = 1;
    }
  });
};
updateFilterdata1(1, fenRow1, "", "", "");
let exportVisible1 = ref(false);
const getVisible1 = (e) => {
  exportVisible1.value = e;
};
let addVisible1 = ref(false);
const getVisibleAdd1 = (e) => {
  textTitleOperate1.value = "新增" + textTitle1;
  addVisible1.value = e;
  formToEdit1.value = null;
};

//新增
async function getForm1(params, title) {
  if (title.indexOf("新增") !== -1) {
    params.leavingDate =
      moment(params.leavingDate[0]).format(timeFormat) +
      "至" +
      moment(params.leavingDate[1]).format(timeFormat);
    await AddLeaveInfo(params).then((res) => {
      console.log(res);
    });
    await updateFilterdata1(
      changePage1.currentPage,
      fenRow1,
      userName,
      number,
      leavingStatus
    );
  } else if (title.indexOf("审核") !== -1) {
    console.log(params.leavingDate[0]);
    console.log(params.leavingDate[1]);
    params.leavingDate =
      moment(params.leavingDate[0]).format(timeFormat) +
      "至" +
      moment(params.leavingDate[1]).format(timeFormat);

    await updateLeaveInfo(editId1, params).then((res) => {
      console.log(res);
    });
    await updateFilterdata1(
      changePage1.currentPage,
      fenRow1,
      userName,
      number,
      leavingStatus
    );
  }
  addVisible1.value = false;
}
const getdeleteNoteId1 = async (e) => {
  await deleteLeaveInfo(e);
  updateFilterdata1(changePage1.currentPage, fenRow1, userName, number, leavingStatus);
};
function getInput1(input, input2, selectd) {
  inputText1.value = input.value;
  inputText2.value = input2.value;
  console.log(input.value);
  console.log(input2.value);
  selectText1.value = selectd.value;
  userName = input.value;
  number = input2.value;
  leavingStatus = selectd.value[0];

  updateFilterdata1(1, fenRow1, userName, number, leavingStatus);
}
const clearInput1 = () => {
  inputText1.value = "";
  inputText2.value = "";
  selectText1.value = [];
  userName = "";
  number = "";
  leavingStatus = "";
  updateFilterdata1(1, fenRow1, "", "", "");
};
let textTitleOperate1 = ref(null);
let editId1;
let formToEdit1 = reactive({
  userName: "",
  number: "",
  leavingDate: "",
  pretext: "",
  leavingAddress: "",
  leavingStatus: "",
});
const geteditId1 = async (e) => {
  editId1 = e;
  textTitleOperate1.value = "审核" + textTitle1;
  await leaveInfoDetailById(e).then((res) => {
    console.log(res);
    formToEdit1.value = res.data.data;
    formToEdit1.value.leavingDate = res.data.data.leavingDate.split("至");
    addVisible1.value = true;
  });
};
const getCurrentPage1 = (e) => {
  changePage1.currentPage = e;
  console.log(e);
  updateFilterdata1(e, fenRow1, userName, number, leavingStatus);
};
const closeExportDialog1 = () => {
  exportVisible1.value = false;
};
let color1 = "linear-gradient(to right, #F6FCFE, #FBFFFF)";

let tableHeight1 = ref("100%");

let tableWidth1 = ref("50%");

let textTitle1 = "请假记录";
</script>
<template>
  <Tableheader
    :textTitle="textTitle1"
    :inputPlod="inputPlod1"
    :inputPlodSecond="inputPlodSecond"
    :select="select1"
    :editIconn="editIconn1"
    @getInputText="getInput1"
    @clearInputText="clearInput1"
    @exportExcel="getVisible1"
    @addForm="getVisibleAdd1"
  ></Tableheader>
  <div
    style="
      height: 382px;
      width: 100%;
      top: 120px;
      justify-content: center;
      position: absolute;
      display: flex;
    "
  >
    <Table
      :fenRow="fenRow1"
      :cols="cols1"
      :tableData="tableData1"
      :textTitle="textTitle1"
      :changePage="changePage1"
      @deleteNoteId="getdeleteNoteId1"
      @editId="geteditId1"
    ></Table>

    <fenYe
      :changePage="changePage1"
      :fenRow="fenRow1"
      @getCurrentPage="getCurrentPage1"
      :inputText="inputText1"
      :inputText2="inputText2"
      :selectText="selectText1"
      style="bottom: 20px; position: absolute; width: 100%"
    ></fenYe>
  </div>

  <Dialog
    :addVisible="addVisible1"
    @closeAddDialog="closeAddDialog1"
    :textTitle="textTitleOperate1"
    @formGet="getForm1"
    :formToEdit="formToEdit1"
  ></Dialog>
</template>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.colW {
  margin-left: 20px;
}

@media screen and (min-width: 2030px) {
  .colW .marginTop {
    width: 100%;
    height: 45%;
    margin-top: 35px;
    max-height: 49%;
  }
}

@media screen and (min-width: 1330px) and (max-width: 1920px) {
  .colW .marginTop {
    margin-top: 20px;
    height: 45%;
  }
}
</style>
