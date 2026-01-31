<script setup>
import {
  getEmployeeList,
  AddEmployee,
  EmployeeDetail,
  deleteEmployee,
  updateEmployee,
} from "@/apis/employee";
import { reactive, ref } from "vue";
import Tableheader from "./header.vue";
import Dialog from "./dialogEmployee.vue";
import Table from "./TableLa.vue";
import ExportDialog from "./ExportDialog.vue";
import fenYe from "./fenyeEmployee.vue";
import moment from "moment";
let tableData1 = ref([]);
let fenRow1 = 10
let editIcon1 = [
  {
    imgIcon: "/src/assets/BatchImport.png",
    name: "批量导入",
  },
];
let editIconn1 = [
  {
    imgIcon: "/src/assets/edit4.png",
    name: "导出",
  },
  {
    imgIcon: "/src/assets/edit3.png",
    name: "新增",
  },
];
let inputPlod1 = "输入姓名等";
let inputText1 = ref(null);
const select1 = [
  {
    placeholder: "员工工种",
    options: [
      {
        value: "维修工",
        label: "维修工",
      },
      {
        value: "保安",
        label: "保安",
      },
    ],
  },
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
let selectText1 = ref(new Array(select1.length).fill(""));
let userName1 = "";
let employeeType1 = "";
let sex1 = "";
let cols1 = [
  {
    propName: "number",
    labelName: "工号",
    width: "100px",
  },
  {
    propName: "userName",
    labelName: "姓名",
    width: "100px",
  },
  {
    propName: "address",
    labelName: "家庭地址",
    width: "100px",
  },
  {
    propName: "sex",
    labelName: "性别",
    width: "60px",
  },
  {
    propName: "phoneNumber",
    labelName: "联系方式",
    width: "120px",
  },
  {
    propName: "employeeType",
    labelName: "员工工种",
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
      userName1,
      employeeType1,
      sex1
    );
  };
}

const updateFilterdata1 = async (val, fenRow, userName, employeeType, sex) => {
  await getEmployeeList(userName1, employeeType1, sex1, fenRow1, val).then((res) => {
    console.log(userName1, employeeType1, sex1);
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
const updateFilterdataSocket = async (val, fenRow, userName, employeeType, sex) => {
  await getEmployeeList(userName1, employeeType1, sex1, fenRow1, val).then((res) => {
    console.log(userName1, employeeType1, sex1);

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

async function getForm1(params, title) {
  if (title.indexOf("新增") !== -1) {
    await AddEmployee(params).then((res) => {
      console.log(res);
    });
    await updateFilterdata1(
      changePage1.currentPage,
      fenRow1,
      userName1,
      employeeType1,
      sex1
    );
  } else if (title.indexOf("修改") !== -1) {
    await updateEmployee(editId1, params).then((res) => {});
    await updateFilterdata1(
      changePage1.currentPage,
      fenRow1,
      userName1,
      employeeType1,
      sex1
    );
  }
  addVisible1.value = false;
}
const getdeleteNoteId1 = async (e) => {
  await deleteEmployee(e);
  updateFilterdata1(changePage1.currentPage, fenRow1, userName1, employeeType1, sex1);
};
function getInput1(input, selectd) {
  inputText1.value = input.value;
  console.log(input.value);
  selectText1.value = selectd.value;
  userName1 = input.value;
  employeeType1 = selectd.value[0];
  sex1 = selectd.value[1];

  updateFilterdata1(1, fenRow1, userName1, employeeType1, sex1);
}
const clearInput1 = () => {
  inputText1.value = "";
  selectText1.value = [];
  userName1 = "";
  employeeType1 = "";
  sex1 = "";
  updateFilterdata1(1, fenRow1, "", "", "");
};
let textTitleOperate1 = ref(null);
let editId1;
let formToEdit1 = reactive({
  userName: "",
  employeeType: "",
  sex: "",
  address: "",
  phoneNumber: "",
});
const geteditId1 = async (e) => {
  editId1 = e;
  textTitleOperate1.value = "修改" + textTitle1;
  await EmployeeDetail(e).then((res) => {
    formToEdit1.value = res.data.data;
    addVisible1.value = true;
  });
};
const getCurrentPage1 = (e) => {
  changePage1.currentPage = e;
  console.log(e);
  updateFilterdata1(e, fenRow1, userName1, employeeType1, sex1);
};
const closeExportDialog1 = () => {
  exportVisible1.value = false;
};
let color1 = "linear-gradient(to right, #F6FCFE, #FBFFFF)";

let tableHeight1 = ref("100%");

let tableWidth1 = ref("50%");

let textTitle1 = "员工信息";
</script>
<template>
  <Tableheader
    :textTitle="textTitle1"
    :inputPlod="inputPlod1"
    :select="select1"
    :editIconn="editIconn1"
    @getInputText="getInput1"
    @clearInputText="clearInput1"
    @exportExcel="getVisible1"
    @addForm="getVisibleAdd1"
  ></Tableheader>
  <div
    style="
      height: 852px;
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
      :selectText="selectText1"
      style="bottom: 20px; position: absolute"
    ></fenYe>
  </div>
  <ExportDialog
    :editIcon="editIcon1"
    :cols="cols1"
    :exportVisible="exportVisible1"
    @closeExportDialog="closeExportDialog1"
    :textTitle="`导出${textTitle1}`"
    :inputPlod="inputPlod1"
    :select="select1"
    :fenRow="fenRow1"
  ></ExportDialog>
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
