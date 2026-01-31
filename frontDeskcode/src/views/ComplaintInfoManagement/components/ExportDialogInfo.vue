<script setup>
import { ref, defineProps, reactive, nextTick, defineExpose, watch } from "vue";
import {
  AddComplaintInfo,
  getComplaintInfoList,
  ComplaintInfoDetail,
  UpdateComplaintInfo,
  deleteComplaintInfo,
} from "@/apis/complaintInfo";
import fenYe from "./fenye.vue";
import Tableheader from "./header.vue";
import Table from "./TableLa.vue";
import { selectExcelData } from "@/store";
import { ElMessage } from "element-plus";
let emits = defineEmits(["closeExportDialog"]);
let selectdata1 = selectExcelData();
console.log(selectdata1.selectdata);
let fenRow = 5;
let props = defineProps({
  exportVisible: {},
  textTitle: {},
  select: {},
  inputPlod: {},
  editIcon: {},
  cols: {},
  inputPlodFirst: {},
});
let userName = "";
let complaintStatus = "";
let complaintType = "";
let { textTitle, select, inputPlod, editIcon, cols } = props;
let tableData = ref(null);
let dialogVisible = ref(false);
let inputText = ref(null);
let changePage = reactive({
  currentPage: 1,
  total: 1,
  pageCount: 1,
});
let inputPlodFirst = ref("请输入姓名");
watch(
  () => props,
  () => {
    dialogVisible.value = props.exportVisible;
    textTitle = props.textTitle;
    fenRow = 5;
    select = props.select;
    inputPlod = props.inputPlod;
    editIcon = props.editIcon;
    console.log(textTitle);
    console.log(dialogVisible.value);
    updateFilterdata(1, fenRow, "", "", "");
  },
  {
    deep: true,
  }
);
//
let selectText = ref(new Array(select.length).fill(""));
async function updateFilterdata(val, fenRow, userName, complaintStatus, complaintType) {
  console.log(fenRow, val);
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
updateFilterdata(1, fenRow, "", "", "");
const getCurrentPage = (e) => {
  console.log(e);
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, "", "", "");
};

import FileSaver from "file-saver";
import * as XLSX from "xlsx";

let multipleSelection = ref(null);
let titleCol = {};

function getVisibleTitle(cols1, select1, inputPlod1) {
  cols.value = cols1;
  cols1.forEach((item) => {
    titleCol[item.propName] = item.labelName;
  });

  inputPlod = inputPlod1;

  dialogVisible.value = true;
}

function getAddTabledata(tableData1) {
  tableData.value = tableData1;

  console.log(tableData.value);
}
let t;

function closeDialog() {
  dialogVisible.value = false;
  selectdata1.flagExport = false;
}

function confirmExportData() {
  selectdata1.selectdata = multipleSelection;
}
let lenSelectExcel = 0;
function confirmExport() {
  getVisibleTitle(cols, select, inputPlod);
  let data = selectdata1.selectdata;
  console.log(data);
  data = data.map((item) => {
    return {
      userName: item.userName,
      phoneNumber: item.phoneNumber,
      complaintType: item.complaintType,
      textareaContent: item.textareaContent,
      complaintTime: item.complaintTime,
      complaintStatus: item.complaintStatus,
      complaintResult: item.complaintResult,
    };
  });
  console.log(data);
  lenSelectExcel = data.length;
  if (lenSelectExcel > 0) {
    exportExcelSub("excel1", "unit", data, titleCol);
  } else {
    ElMessage({
      message: "请选择需要导出的数据",
      type: "warning",
    });
  }
}

function exportExcelSub(name, id, multipleSelection1, col) {
  const exportData = [col, ...multipleSelection1];
  const worksheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const workbookOutput = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  try {
    FileSaver.saveAs(
      new Blob([workbookOutput], { type: "application/octet-stream" }),
      name + ".xlsx"
    );
  } catch (e) {
    console.log(e);
  }
}

function exportExcel(name, id) {
  var wb = XLSX.utils.table_to_book(document.querySelector("#" + id));
  var wbout = XLSX.write(wb, { bookType: "xlsx", bookSST: true, type: "array" });
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      name + ".xlsx"
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
}
defineExpose({
  getVisibleTitle,
  getAddTabledata,
});
let tableHeight = ref("560px");
let tableWidth = ref("1100px");
const getVisibleNow = () => {
  emits("closeExportDialog");
};
const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  userName = input.value;
  complaintStatus = selectd.value[1];
  complaintType = selectd.value[0];
  updateFilterdata(1, fenRow, userName, complaintStatus, complaintType);
  console.log(inputPlod.value);
};
const clearInput = () => {
  inputText.value = "";
  selectText.value = "";

  userName = "";
  complaintStatus = "";
  complaintType = "";
  updateFilterdata(1, fenRow, "", "", "");
  console.log(inputPlod.value);
};
</script>
<template>
  <div>
    <el-dialog
      :title="textTitle"
      v-model="dialogVisible"
      width="78%"
      style="height: 720px; position: relative"
      @close="getVisibleNow"
      class="parsent"
    >
      <Tableheader
        :inputPlodFirst="inputPlodFirst"
        :select="select"
        :editIcon="editIcon1"
        :textTitle="''"
        @getInputText="getInput"
        @exportExcel="getVisible"
        @clearInputText="clearInput"
      ></Tableheader>
      <div
        style="
          height: 550px;
          width: 100%;
          top: 120px;
          justify-content: center;
          position: absolute;
          display: flex;
        "
      >
        <Table
          :fenRow="fenRow"
          :tableData="tableData"
          style="height: 450px; width: 1445px; position: relative; left: -15px; top: 10px"
          :cols="cols"
          :textTitle="textTitle"
          :changePage="changePage"
          @getCurrentPage="getCurrentPage"
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
      <template #footer>
        <span
          class="dialog-footer"
          style="
            justify-content: center;
            display: flex;
            bottom: 20px;
            position: absolute;
            text-align: center;
            width: 100%;
          "
        >
          <el-button @click="closeDialog" style="width: 120px">取消</el-button>
          <el-button
            type="primary"
            @click="confirmExport"
            style="width: 120px"
            color="#F3B805"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.parsent {
  :deep(.headerStyleTable) {
    margin-top: -10px;
  }
}
</style>
