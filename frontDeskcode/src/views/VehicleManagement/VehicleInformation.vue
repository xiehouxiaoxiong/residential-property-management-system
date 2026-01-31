<script setup>
import { ref, reactive } from "vue";
import Tableheader from "./components/header.vue";
import Dialog from "./components/dialogVI.vue";
import Table from "./components/TableLa.vue";
import ExportDialog from "./components/ExportDialogVI.vue";
import fenYe from "./components/fenyeVI.vue";
import {
  AddVehicleInfo,
  getVehicleInfoList,
  VehicleInfoDetailById,
  UpdateVehicleInfo,
  deleteVehicleInfo,
} from "@/apis/vehicleInfo";
let editItem;
let tableData = ref([]);
let fenRow = 10;
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
let licenseNumber = "";
let carBrand = "";
let userName = "";
updateFilterdata(1, fenRow, "", "", "");

async function updateFilterdata(val, fenRow, licenseNumber, carBrand, userName) {
  console.log(licenseNumber, carBrand, userName, fenRow, val);
  await getVehicleInfoList(licenseNumber, carBrand, userName, fenRow, val).then((res) => {
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
async function updateFilterdataSocket(val, fenRow, licenseNumber, carBrand, userName) {
  console.log(licenseNumber, carBrand, userName);
  await getVehicleInfoList(licenseNumber, carBrand, userName, fenRow, val).then((res) => {
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
    updateFilterdataSocket(
      changePage.currentPage,
      fenRow,
      licenseNumber,
      carBrand,
      userName
    );
  };
}
const select = [
  {
    placeholder: "汽车品牌",
    options: [
      {
        value: "大众",
        label: "大众",
      },
      {
        value: "宝马",
        label: "宝马",
      },
      {
        value: "奥迪",
        label: "奥迪",
      },
      {
        value: "劳斯莱斯",
        label: "劳斯莱斯",
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
    propName: "phoneNumber",
    labelName: "联系方式",
    width: "160px",
  },
  {
    propName: "licenseNumber",
    labelName: "车牌号",
    width: "160px",
  },
  {
    propName: "carType",
    labelName: "车辆类型",
    width: "160px",
  },
  {
    propName: "carBrand",
    labelName: "汽车品牌",
    width: "160px",
  },
  {
    propName: "carColor",
    labelName: "颜色",
    width: "160px",
  },
];

let textTitle = ref("车辆信息管理");
let inputPlod = "输入车主姓名";
let inputPlodSencond = "输入车牌号";
let inputText = ref(null);
let inputSencond = ref(null);
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

const getInput = (input, inputSencond, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userName = input.value;
  licenseNumber = inputSencond.value;
  console.log(selectd.value[0]);
  carBrand = selectd.value[0];
  changePage.currentPage = 1;
  console.log(1, fenRow);

  updateFilterdata(1, fenRow, licenseNumber, carBrand, userName);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";
  licenseNumber = "";
  carBrand = "";
  userName = "";
  changePage.currentPage = 1;
  updateFilterdata(1, fenRow, licenseNumber, carBrand, userName);
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
    carColor: "",
    licenseNumber: "",
    carType: "",
    carBrand: "",
    userId: "",
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
    await AddVehicleInfo(params).then((res) => {
      console.log(res);

      addVisible.value = false;
    });

    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      licenseNumber,
      carBrand,
      userName
    );
  } else if (title.indexOf("修改") !== -1) {
    console.log(editItem, params);
    await UpdateVehicleInfo(editItem, params).then((res) => {
      console.log(res);
      addVisible.value = false;
    });
    await updateFilterdata(
      changePage.currentPage,
      fenRow,
      licenseNumber,
      carBrand,
      userName
    );
  }
}

const getdeleteNoteId = async (e) => {
  console.log(e);
  await deleteVehicleInfo(e);
  updateFilterdata(changePage.currentPage, fenRow, licenseNumber, carBrand, userName);
};

let formToEdit = ref(null);

let textTitleOperate = ref(null);

const geteditItem = async (e) => {
  console.log(e);
  editItem = e.id;
  textTitleOperate.value = "修改" + textTitle.value;
  await VehicleInfoDetailById(e.id).then((res) => {
    console.log(res);

    formToEdit.value = res.data.data;

    addVisible.value = true;
  });
};
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, licenseNumber, carBrand, userName);
};
const importDataExcel = (result) => {
  result.forEach(async (item) => {
    console.log(item);

    await AddVehicleInfo(item).then((res) => {
      console.log(res);
      updateFilterdata(changePage.currentPage, fenRow, licenseNumber, carBrand, userName);
    });
  });
};
</script>
<template>
  <div class="RuralBlock">
    <Tableheader
      :textTitle="textTitle"
      :inputPlodFirst="inputPlod"
      :inputPlodSencond="inputPlodSencond"
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
        :inputSencond="inputSencond"
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
      :inputPlodSencond="inputPlodSencond"
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
