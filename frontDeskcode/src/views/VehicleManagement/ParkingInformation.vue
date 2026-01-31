<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogPI.vue";
import fenYe from "./components/fenyePI.vue";
import { getParkingInfoList } from "@/apis/parkingInfo.js";

let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let parkingName = "";
let parkingNumber = "";
let parkingStatus = "";
updateFilterdata(1, fenRow, "", "", "");

async function updateFilterdata(val, fenRow, parkingName, parkingNumber, parkingStatus) {
  await getParkingInfoList(parkingName, parkingNumber, parkingStatus, fenRow, val).then(
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
      parkingName,
      parkingNumber,
      parkingStatus
    );
  };
}
async function updateFilterdataSocket(
  val,
  fenRow,
  parkingName,
  parkingNumber,
  parkingStatus
) {
  await getParkingInfoList(parkingName, parkingNumber, parkingStatus, fenRow, val).then(
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
    placeholder: "停车场",
    options: [
      {
        value: "东区",
        label: "东区",
      },
      {
        value: "西区",
        label: "西区",
      },
      {
        value: "南区",
        label: "南区",
      },
      {
        value: "北区",
        label: "北区",
      },
    ],
  },
  {
    placeholder: "车位状态",
    options: [
      {
        value: "在用车位",
        label: "在用车位",
      },
      {
        value: "预约车位",
        label: "预约车位",
      },
      {
        value: "空闲车位",
        label: "空闲车位",
      },
      {
        value: "暂停使用车位",
        label: "暂停使用车位",
      },
    ],
  },
];
let selectText = ref(new Array(select.length).fill(""));
let cols = [
  {
    propName: "parkingName",
    labelName: "停车场",
    width: "140px",
  },
  {
    propName: "parkingNumber",
    labelName: "车位序号",
    width: "60px",
  },
  {
    propName: "parkingStatus",
    labelName: "车位状态",
    width: "160px",
  },
];

let textTitle = ref("车位信息管理");
let inputPlod = "输入车位序号";
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
  parkingNumber = input.value;
  parkingName = selectd.value[0];
  parkingStatus = selectd.value[1];

  changePage.currentPage = 1;

  console.log(1, fenRow, parkingName, parkingNumber, parkingStatus);
  updateFilterdata(1, fenRow, parkingName, parkingNumber, parkingStatus);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  parkingName = "";
  parkingNumber = "";
  parkingStatus = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, "", "", "");
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

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, parkingName, parkingNumber, parkingStatus);
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
