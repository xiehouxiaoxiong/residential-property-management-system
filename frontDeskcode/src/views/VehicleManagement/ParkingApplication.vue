<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialogPA.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogPA.vue";
import fenYe from "./components/fenyePA.vue";

import {
  AddParkingApplication,
  getParkingApplicationList,
  ParkingApplicationDetailById,
  UpdateParkingApplication,
  deleteParkingApplication,
} from "@/apis/parkingApplication";
import { addPayment, updateAllMoney, getUserPayment } from "@/apis/payment";
import { updateParkingInfo } from "@/apis/parkingInfo";
import moment from "moment";
const timeFormat = "YYYY-MM-DD";
const timeFormats = "YYYY-MM-DD HH:mm:ss";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let userId = "";
let auditResult = "";
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
    updateFilterdataSocket(changePage.currentPage, fenRow, userId, auditResult);
  };
}

async function updateFilterdata(val, fenRow, userId, auditResult) {
  await getParkingApplicationList(userId, auditResult, fenRow, val).then((res) => {
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
async function updateFilterdataSocket(val, fenRow, userId, auditResult) {
  await getParkingApplicationList(userId, auditResult, fenRow, val).then((res) => {
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
    placeholder: "审核结果",
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
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "userId",
    labelName: "用户ID",
    width: "140px",
  },
  {
    propName: "parkingName",
    labelName: "停车场",
    width: "60px",
  },
  {
    propName: "parkingNumber",
    labelName: "车位序号",
    width: "60px",
  },
  {
    propName: "parkingStartTime",
    labelName: "车位申请开始时间",
    width: "160px",
  },
  {
    propName: "parkingEndTime",
    labelName: "车位申请结束时间",
    width: "160px",
  },
  {
    propName: "auditResult",
    labelName: "审核结果",
    width: "160px",
  },
  {
    propName: "auditOpinion",
    labelName: "审核意见",
    width: "160px",
  },
];

let textTitle = ref("车位申请");
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
];

const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userId = input.value;
  auditResult = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow, userId, auditResult);

  updateFilterdata(1, fenRow, userId, auditResult);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  auditResult = "";
  userId = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, userId, auditResult);
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
    parkingStartTime: "",
    parkingEndTime: "",
    auditResult: "",
    auditOpinion: "",
    userId: "",
    parkingId: "",
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
  params.parkingStartTime = moment(params.parkingStartTime).format(timeFormat);
  params.parkingEndTime = moment(params.parkingEndTime).format(timeFormat);
  let year =
    new Date(params.parkingEndTime).getFullYear() -
    new Date(params.parkingStartTime).getFullYear();
  let mon =
    new Date(params.parkingEndTime).getMonth() -
    new Date(params.parkingStartTime).getMonth();
  console.log(year, mon);
  let parkingATime = year * 12 + mon;
  console.log(parkingATime);
  let money1 = 70 * parkingATime;
  let payId;
  if (title.indexOf("新增") !== -1) {
    await AddParkingApplication(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(changePage.currentPage, fenRow, userId, auditResult);
  } else if (title.indexOf("审核") !== -1) {
    console.log(params.auditResult);
    if (params.auditResult === "通过") {
      params.auditTime = moment(new Date()).format(timeFormats);
      console.log(params.auditTime);

      UpdateParkingApplication(editItem, params).then((res) => {
        console.log(res);
        addVisible.value = false;
      });

      updateParkingInfo(params.parkingId, { parkingStatus: "预约车位" }).then((res) => {
        console.log(res);
      });

      getUserPayment(params.userId).then((res) => {
        console.log(res);
        let { money, parkingArrearage, wuyeArrearage } = res.data.data;
        console.log(money, parkingArrearage, wuyeArrearage, money1);
        let dataMoney = {
          money: money,
          parkingArrearage: parkingArrearage + money1,
          wuyeArrearage: wuyeArrearage,
        };
        updateAllMoney(params.userId, dataMoney).then((res) => {
          console.log(res);
        });
      });

      let ss = {
        payStatus: "待支付",
        payType: "停车费",
        money: money1,
        payTime: moment(new Date()).format(timeFormats),
        userId: params.userId,
      };
      addPayment(ss).then((res) => {
        console.log(res);
      });

      await updateFilterdata(changePage.currentPage, fenRow, userId, auditResult);
    }
  }
}

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteParkingApplication(e);
  updateFilterdata(changePage.currentPage, fenRow, userId, auditResult);
};

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.id;
  textTitleOperate.value = "审核";
  await ParkingApplicationDetailById(e.id).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data;

    addVisible.value = true;
  });
};
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, userId, auditResult);
};
const importDataExcel = (result) => {
  result.forEach(async (item) => {
    console.log(item);

    await AddParkingApplication(item).then((res) => {
      console.log(res);
      updateFilterdata(changePage.currentPage, fenRow, userId, auditResult);
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
