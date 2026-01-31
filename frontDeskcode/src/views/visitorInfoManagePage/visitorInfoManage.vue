<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialog.vue";
import Table from "./components/TableLa.vue";
import fenYe from "./components/fenye.vue";
import {
  AddVisitorInfo,
  getVisitorInfoList,
  VisitorInfoDetailById,
  UpdateVisitorInfo,
  deleteVisitorInfo,
} from "@/apis/visitorInfo";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userName = "";
updateFilterdata(1, fenRow, "");
function sendMessageToServer() {
  var ws = new WebSocket("ws://localhost:8080");

  ws.onopen = function () {
    console.log("ws onopen");
    ws.send("from client: hello");
  };

  ws.onmessage = function (e) {
    console.log("ws onmessage");
    console.log("from server: " + e.data);
    updateFilterdataSocket(changePage.currentPage, fenRow, userName);
  };
}
async function updateFilterdataSocket(val, fenRow, userName) {
  console.log(fenRow, val, userName);
  await getVisitorInfoList(userName, fenRow, val).then((res) => {
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

async function updateFilterdata(val, fenRow, userName) {
  console.log(fenRow, val, userName);
  await getVisitorInfoList(userName, fenRow, val).then((res) => {
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

const select = [];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "visitorUserName",
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
    propName: "credentialsType",
    labelName: "有效证件",
    width: "160px",
  },
  {
    propName: "credentials",
    labelName: "证件",
    width: "140px",
  },
  {
    propName: "visitorReason",
    labelName: "来访原因",
    width: "60px",
  },
  {
    propName: "accompanyingNumber",
    labelName: "随行人数",
    width: "160px",
  },
  {
    propName: "interviewee",
    labelName: "被访人",
    width: "160px",
  },
  {
    propName: "enterTime",
    labelName: "进入时间",
    width: "160px",
  },
  {
    propName: "leavingTime",
    labelName: "离开时间",
    width: "160px",
  },
  {
    propName: "staffUserName",
    labelName: "保安姓名",
    width: "160px",
  },
];

let textTitle = ref("访客记录管理");
let inputPlod = "输入姓名";
let inputText = ref(null);
let tableheight = ref("692px");
let tableWidth1 = ref("80%");
let editIcon = [];

let editIconn = [];

const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userName = input.value;
  changePage.currentPage = 1;
  console.log(1, fenRow, userName);

  updateFilterdata(1, fenRow, userName);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";

  userName = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, userName);
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
    userName: "",
    phoneNumber: "",
    credentialsType: "",
    credentials: "",
    sex: "",
    visitorReason: "",
    accompanyingNumber: "",
    interviewee: "",
    enterTime: "",
    leavingTime: "",
    securityEmployeeId: "",
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

  if (title.indexOf("新增") !== -1) {
    await AddVisitorInfo(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(changePage.currentPage, fenRow, userName);
  } else if (title.indexOf("修改") !== -1) {
    await UpdateVisitorInfo(editItem, params).then((res) => {
      console.log(res);
      addVisible.value = false;
    });
    await updateFilterdata(changePage.currentPage, fenRow, userName);
  }
}

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteVisitorInfo(e);
  updateFilterdata(changePage.currentPage, fenRow, userName);
};

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.id;
  textTitleOperate.value = "修改" + textTitle.value;
  await VisitorInfoDetailById(e.id).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data;

    addVisible.value = true;
  });
};
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, userName);
};
const importDataExcel = (result) => {
  result.forEach(async (item) => {
    console.log(item);

    await AddVisitorInfo(item).then((res) => {
      console.log(res);
      updateFilterdata(changePage.currentPage, fenRow, userName);
    });
  });
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
      @addForm="getVisibleAdd"
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
        @editItem="geteditItem"
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
