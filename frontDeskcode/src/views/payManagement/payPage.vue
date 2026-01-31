<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogInfo.vue";
import fenYe from "./components/fenye.vue";
import { getPaymentList, deletePayment } from "@/apis/payment";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let payType = "";
let userName = "";

updateFilterdata(1, fenRow, "", "");

async function updateFilterdata(val, fenRow, payType, userName) {
  console.log(fenRow, val, payType, userName);
  await getPaymentList(payType, userName, fenRow, val).then((res) => {
    console.log(res.data);
    tableData.value = res.data.data.rows;
    sendMessageToServer();
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
async function updateFilterdataSocket(val, fenRow, payType, userName) {
  console.log(fenRow, val, payType, userName);
  await getPaymentList(payType, userName, fenRow, val).then((res) => {
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
function sendMessageToServer() {
  var ws = new WebSocket("ws://localhost:8080");

  ws.onopen = function () {
    console.log("ws onopen");
    ws.send("from client: hello");
  };

  ws.onmessage = function (e) {
    console.log("ws onmessage");
    console.log("from server: " + e.data);
    updateFilterdataSocket(changePage.currentPage, fenRow, payType, userName);
  };
}
const select = [
  {
    placeholder: "缴费类型",
    options: [
      {
        value: "物业费",
        label: "物业费",
      },
      {
        value: "停车费",
        label: "停车费",
      },
    ],
  },
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "userId",
    labelName: "用户ID",
    width: "140px",
  },
  {
    propName: "userName",
    labelName: "姓名",
    width: "140px",
  },
  {
    propName: "payType",
    labelName: "费用类型",
    width: "60px",
  },
  {
    propName: "money",
    labelName: "缴费金额",
    width: "160px",
  },
  {
    propName: "payTime",
    labelName: "缴费时间",
    width: "160px",
  },
];

let textTitle = ref("缴费记录");
let inputPlod = "输入姓名";
let inputText = ref(null);
let tableheight = ref("692px");
let tableWidth1 = ref("80%");
let editIcon = [];

let editIconn = [
  {
    imgIcon: "../../src/assets/edit4.png",
    name: "导出",
  },
];

const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userName = input.value;
  payType = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow, payType, userName);

  updateFilterdata(1, fenRow, payType, userName);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  userName = "";
  payType = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, payType, userName);
  console.log(inputPlod.value);
};
let exportVisible = ref(false);
const getVisible = (e) => {
  exportVisible.value = e;
  console.log(exportVisible.value);
};
let addVisible = ref(false);

const closeExportDialog = () => {
  exportVisible.value = false;
};

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deletePayment(e);
  updateFilterdata(changePage.currentPage, fenRow, payType, userName);
};

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, payType, userName);
};
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
      style="position: relative"
    ></ExportDialog>
  </div>
</template>
<style scoped>
.RuralBlock {
  height: 850px;
  width: 1635px;
  background-color: white;
  border-radius: 16px;

  position: relative;
}
</style>
