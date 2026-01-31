<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialog.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogInfo.vue";
import fenYe from "./components/fenye.vue";
import {
  AddProprietor,
  getProprietorList,
  ProprietorDetailById,
  ProprietorDetailByProprietorName,
  UpdateProprietor,
  deleteProprietor,
} from "@/apis/proprietorManage";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userName = "";
let sex = "";
updateFilterdata(1, fenRow, "", "");
function sendMessageToServer() {
  var ws = new WebSocket("ws://localhost:8080");

  ws.onopen = function () {
    console.log("ws onopen");
    ws.send("from client: hello");
  };

  ws.onmessage = function (e) {
    console.log("ws onmessage");
    console.log("from server: " + e.data);
    updateFilterdataSocket(changePage.currentPage, fenRow, userName, sex);
  };
}

async function updateFilterdata(val, fenRow, userName, sex) {
  console.log(fenRow, val, userName, sex);
  await getProprietorList(userName, sex, fenRow, val).then((res) => {
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
async function updateFilterdataSocket(val, fenRow, userName, sex) {
  console.log(fenRow, val, userName, sex);
  await getProprietorList(userName, sex, fenRow, val).then((res) => {
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
    placeholder: "性别",
    options: [
      {
        value: "男",
        label: "男",
      },
      {
        value: "女",
        label: "女",
      },
    ],
  },
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "userName",
    labelName: "姓名",
    width: "140px",
  },
  {
    propName: "sex",
    labelName: "性别",
    width: "60px",
  },
  {
    propName: "phoneNumber",
    labelName: "联系方式",
    width: "160px",
  },
  {
    propName: "money",
    labelName: "余额",
    width: "160px",
  },
  {
    propName: "parkingArrearage",
    labelName: "停车欠费",
    width: "160px",
  },
  {
    propName: "wuyeArrearage",
    labelName: "物业欠费",
    width: "160px",
  },
];

let textTitle = ref("业主信息");
let inputPlod = "输入姓名等";
let inputText = ref(null);
let tableheight = ref("692px");
let tableWidth1 = ref("80%");
let editIcon = [
  {
    imgIcon: "../../src/assets/BatchImport.png",
    name: "批量导入",
  },
];

let editIconn = [
  {
    imgIcon: "../../src/assets/edit4.png",
    name: "导出",
  },
  {
    imgIcon: "../../src/assets/edit3.png",
    name: "新增",
  },
];

const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userName = input.value;
  sex = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow, userName, sex);

  updateFilterdata(1, fenRow, userName, sex);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  sex = "";
  userName = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, userName, sex);
  console.log(inputPlod.value);
};
let exportVisible = ref(false);
const getVisible = (e) => {
  exportVisible.value = e;
  console.log(exportVisible.value);
};
let addVisible = ref(false);

const getVisibleAdd = (e) => {
  textTitleOperate.value = "新增" + textTitle.value;
  addVisible.value = e;
  console.log(addVisible.value);
  formToEdit.value = {
    sex: "",
    userName: "",
    phoneNumber: "",
    parkingArrearage: "",
    wuyeArrearage: "",
  };
};

const closeExportDialog = () => {
  exportVisible.value = false;
};
const closeAddDialog = () => {
  addVisible.value = false;
};

async function getForm(params, title) {
  console.log(params);
  addVisible.value = false;
  console.log(title);
  if (title.indexOf("新增") !== -1) {
    await AddProprietor(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(changePage.currentPage, fenRow, userName, sex);
  } else if (title.indexOf("修改") !== -1) {
    await UpdateProprietor(params.userId, params).then((res) => {
      console.log(res);
      addVisible.value = false;
    });
    await updateFilterdata(changePage.currentPage, fenRow, userName, sex);
  }
}
//delete

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteProprietor(e);
  updateFilterdata(changePage.currentPage, fenRow, userName, sex);
};
//edit
let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.id;
  textTitleOperate.value = "修改" + textTitle.value;
  await ProprietorDetailById(e.id).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data;

    addVisible.value = true;
  });
};
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, userName, sex);
};
const importDataExcel = (result) => {
  result.forEach(async (item) => {
    console.log(item);

    await AddProprietor(item).then((res) => {
      console.log(res);
      updateFilterdata(changePage.currentPage, fenRow, userName, sex);
    });
  });
};
function getupdateAfterPay() {
  console.log(1111);
  updateFilterdata(changePage.currentPage, fenRow, userName, sex);
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
      @addForm="getVisibleAdd"
      @importDataExcel="importDataExcel"
      :cols="cols"
      @updateAfterPay="getupdateAfterPay"
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
        @editItem="geteditItem"
        @updateAfterPay="getupdateAfterPay"
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
    <Dialog
      :addVisible="addVisible"
      @closeAddDialog="closeAddDialog"
      :textTitle="textTitleOperate"
      @formGet="getForm"
      :formToEdit="formToEdit"
    ></Dialog>
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
