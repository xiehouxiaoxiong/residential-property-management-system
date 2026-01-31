<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialog.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogInfo.vue";
import fenYe from "./components/fenye.vue";
import { ElMessage } from "element-plus";
import {
  getUserInfoList,
  deleteUser,
  UpdateUser,
  UserDetailById,
  resetPassword,
  addUser,
} from "@/apis/sysUser";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userId = "";
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
    updateFilterdataSocket(changePage.currentPage, fenRow, userId, sex);
  };
}
async function updateFilterdataSocket(val, fenRow, userId, sex) {
  await getUserInfoList(userId, sex, fenRow, val).then((res) => {
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

async function updateFilterdata(val, fenRow, userId, sex) {
  await getUserInfoList(userId, sex, fenRow, val).then((res) => {
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
    propName: "userId",
    labelName: "用户ID",
    width: "100px",
  },
  {
    propName: "userName",
    labelName: "用户名",
    width: "120px",
  },
  {
    propName: "avatar",
    labelName: "头像",
    width: "140px",
  },
  {
    propName: "sex",
    labelName: "性别",
    width: "140px",
  },
  {
    propName: "number",
    labelName: "工号",
    width: "140px",
  },
  {
    propName: "phoneNumber",
    labelName: "联系方式",
    width: "100px",
  },
];

let textTitle = ref("管理员账号管理");
let inputPlod = "输入用户ID";
let inputText = ref(null);
let tableheight = ref("692px");
let tableWidth1 = ref("80%");
let editIcon = [];
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
  userId = input.value;
  sex = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow, userId);

  updateFilterdata(1, fenRow, userId, sex);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  userId = "";
  sex = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, userId, sex);
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
    params.password = "123456";
    params.userId = (Math.random() + new Date().getTime()).toString(32).slice(0, 8);
    await addUser(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(changePage.currentPage, fenRow, userId, sex);

    //
  } else if (title.indexOf("修改") !== -1) {
    await UpdateUser(params.userId, params).then((res) => {
      console.log(res);
      addVisible.value = false;
    });
    await updateFilterdata(changePage.currentPage, fenRow, userId, sex);
  }
}

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteUser(e);
  updateFilterdata(changePage.currentPage, fenRow, userId, sex);
};

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.userId;
  textTitleOperate.value = "修改" + textTitle.value;
  await UserDetailById(editItem).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data.user;

    addVisible.value = true;
  });
};
async function resetPasswordFunc(params) {
  console.log(params);
  await resetPassword(params.userId).then((res) => {
    ElMessage.success("重置密码成功");
  });
}
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, userId, sex);
};
const getVisibleAdd = (e) => {
  textTitleOperate.value = "新增" + textTitle.value;
  addVisible.value = e;
  console.log(addVisible.value);
  formToEdit.value = {
    sex: "",
    userName: "",
    phoneNumber: "",
    avatar: "",
    number: "",
  };
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
      @addForm="getVisibleAdd"
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
        @resetPassword="resetPasswordFunc"
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
