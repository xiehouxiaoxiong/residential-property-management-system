<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialog.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogInfo.vue";
import fenYe from "./components/fenye.vue";
import {
  AddComplaintInfo,
  getComplaintInfoList,
  ComplaintInfoDetail,
  UpdateComplaintInfo,
  deleteComplaintInfo,
} from "@/apis/complaintInfo";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userName = "";
let complaintStatus = "";
let complaintType = "";
updateFilterdata(1, fenRow, "", "", "");
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
      changePage.currentPage,
      fenRow,
      userName,
      complaintStatus,
      complaintType
    );
  };
}

async function updateFilterdata(val, fenRow, userName, complaintStatus, complaintType) {
  console.log(fenRow, val, userName, complaintStatus, complaintType);
  await getComplaintInfoList(userName, complaintStatus, complaintType, fenRow, val).then(
    (res) => {
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
    }
  );
}
async function updateFilterdataSocket(
  val,
  fenRow,
  userName,
  complaintStatus,
  complaintType
) {
  console.log(fenRow, val, userName, complaintStatus, complaintType);
  await getComplaintInfoList(userName, complaintStatus, complaintType, fenRow, val).then(
    (res) => {
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
    }
  );
}

const select = [
  {
    placeholder: "投诉类型",
    options: [
      {
        value: "投诉",
        label: "投诉",
      },
      {
        value: "咨询",
        label: "咨询",
      },
      {
        value: "建议",
        label: "建议",
      },
    ],
  },
  {
    placeholder: "状态",
    options: [
      {
        value: "待受理",
        label: "待受理",
      },
      {
        value: "已受理",
        label: "已受理",
      },
    ],
  },
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "complaintUserName",
    labelName: "姓名",
    width: "140px",
  },
  {
    propName: "complaintPhoneNumber",
    labelName: "联系方式",
    width: "160px",
  },
  {
    propName: "complaintType",
    labelName: "投诉类型",
    width: "160px",
  },
  {
    propName: "textareaContent",
    labelName: "投诉内容",
    width: "160px",
  },
  {
    propName: "complaintTime",
    labelName: "投诉时间",
    width: "160px",
  },
  {
    propName: "complaintStatus",
    labelName: "状态",
    width: "160px",
  },
  {
    propName: "complaintResult",
    labelName: "投诉结果",
    width: "160px",
  },
];

let textTitle = ref("投诉信息管理");
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
  complaintStatus = selectd.value[1];
  complaintType = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow, userName, complaintStatus, complaintType);

  updateFilterdata(1, fenRow, userName, complaintStatus, complaintType);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  userName = "";
  complaintStatus = "";
  complaintType = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, userName, complaintStatus, complaintType);
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
const closeAddDialog = () => {
  addVisible.value = false;
};
//新增
async function getForm(params, title) {
  console.log(params);
  addVisible.value = false;

  if (title.indexOf("新增") !== -1) {
    await AddComplaintInfo(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      userName,
      complaintStatus,
      complaintType
    );

    //
  } else if (title.indexOf("修改") !== -1) {
    await UpdateComplaintInfo(editItem, params).then((res) => {
      console.log(res);
      addVisible.value = false;
    });
    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      userName,
      complaintStatus,
      complaintType
    );
  }
}

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteComplaintInfo(e);
  updateFilterdata(
    changePage.currentPage,
    fenRow,
    userName,
    complaintStatus,
    complaintType
  );
};
//edit
let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.id;
  textTitleOperate.value = "修改" + textTitle.value;
  await ComplaintInfoDetail(e.id).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data;

    addVisible.value = true;
  });
};
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, userName, complaintStatus, complaintType);
};
const importDataExcel = (result) => {
  result.forEach(async (item) => {
    console.log(item);

    await AddComplaintInfo(item).then((res) => {
      console.log(res);
      updateFilterdata(
        changePage.currentPage,
        fenRow,
        userName,
        complaintStatus,
        complaintType
      );
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
