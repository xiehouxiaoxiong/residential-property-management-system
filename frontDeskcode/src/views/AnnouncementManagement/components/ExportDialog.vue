<script setup>
import {
  ref,
  defineProps,
  reactive,
  nextTick,
  defineExpose,
  watch,
  watchEffect,
} from "vue";
import Tableheader from "./header.vue";
import {
  Addannouncenment,
  getAnnouncenmentList,
  announcenmentDetail,
  updateAnnouncenment,
  deleteAnnouncenment,
} from "@/apis/announcementNodejs.js";
import Table from "./TableLa.vue";
import { selectExcelData } from "../../../store";
import { ElMessage } from "element-plus";
import fenYe from "./fenye.vue";
import moment from "moment";
const timeFormat = "YYYY-MM-DD HH:mm:dd";
const timeFormatSelect = "YYYY-MM-DD";
let emits = defineEmits(["closeExportDialog"]);
let selectdata1 = selectExcelData();

let props = defineProps({
  exportVisible: {},
  textTitle: {},
  fenRow: {},
  select: {},
  inputPlod: {},
  editIcon: {},
  cols: {},
});

let { textTitle, fenRow, select, editIcon, cols } = props;
let tableData = ref(null);
let inputPlod = ref(null);
let dialogVisible = ref(false);
let changePage = reactive({
  currentPage: 1,
  total: 1,
  pageCount: 1,
});

watchEffect(() => {
  dialogVisible.value = props.exportVisible;
  textTitle = props.textTitle;
  fenRow = props.fenRow;
  select = props.select;
  inputPlod.value = props.inputPlod;
  editIcon = props.editIcon;
});

const updateFilterdata = async (
  val,
  fenRow,
  title,
  announcementType,
  announcementStatus,
  releaseTime
) => {
  await getAnnouncenmentList(
    title,
    announcementType,
    announcementStatus,
    releaseTime,
    fenRow,
    val
  ).then((res) => {
    tableData.value = res.data.data.rows;
    let len = res.data.total;
    console.log(res.data);
    let pagecount = Math.ceil(len / fenRow);
    changePage.total = len;
    if (len > 0) {
      changePage.pageCount = pagecount;
    } else {
      changePage.pageCount = 1;
    }
  });
};
updateFilterdata(1, fenRow, "", "", "", "");

import FileSaver from "file-saver";
import * as XLSX from "xlsx";

let multipleSelection = ref(null);
let titleCol = {};

function getVisibleTitle(cols1, select1, inputPlod1) {
  cols.value = cols1;
  cols1.forEach((item) => {
    titleCol[item.propName] = item.labelName;
  });

  inputPlod.value = inputPlod1;

  dialogVisible.value = true;
}

function getAddTabledata(tableData1) {
  tableData.value = tableData1;
}
let t;

function handelCannelExport(e) {
  closeDialog();
}
function closeDialog() {
  dialogVisible.value = false;

  emits("closeExportDialog");
}

function confirmExportData() {
  selectdata1.selectdata = multipleSelection;
}
let lenSelectExcel = 0;
function confirmExport() {
  getVisibleTitle(cols, select, inputPlod);
  let data = selectdata1.selectdata;

  data = data.map((item) => {
    let obj = {
      title: item.title,
      content: item.content,
      announcementType: item.announcementType,
      announcementStatus: item.announcementStatus,
      releaseTime: item.releaseTime,
      picture: item.picture,
    };
    return obj;
  });

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
  handelCannelExport,
  getAddTabledata,
});
let tableHeight = ref("560px");
let tableWidth = ref("1100px");
const getVisibleNow = () => {
  emits("closeExportDialog");
};
let title = "";
let announcementType = "";
let announcementStatus = "";
let releaseTime = "";
let selectText = ref(new Array(select.length).fill(""));
let inputText = ref(null);
const getInput = (input, selectd) => {
  inputText.value = input.value;
  selectText.value = selectd.value;
  title = input.value;
  announcementType = selectd.value[0];
  announcementStatus = selectd.value[1];
  if (selectd.value[2]) {
    releaseTime = moment(selectd.value[2]).format(timeFormatSelect);
  } else {
    releaseTime = undefined;
  }
  updateFilterdata(1, fenRow, title, announcementType, announcementStatus, releaseTime);
};
const getCurrentPage = (e) => {
  changePage.currentPage = e;
  updateFilterdata(e, fenRow, "", "", "", "");
};
const clearInput = () => {
  inputText.value = "";

  select.value = "";
  announcementType = "";
  announcementStatus = "";
  releaseTime = "";
  title = "";
  updateFilterdata(
    changePage.pageCount,
    fenRow,
    title,
    announcementType,
    announcementStatus,
    releaseTime
  );
};
let clearSelectData = ref(null);
const clearSelection = () => {
  clearSelectData.value = true;
};
</script>
<template>
  <el-dialog
    :title="textTitle"
    v-model="dialogVisible"
    width="78%"
    style="height: 720px"
    @close="getVisibleNow"
  >
    <Tableheader
      :inputPlod="inputPlod"
      :select="select"
      :editIcon="editIcon1"
      @getInputText="getInput"
      @exportExcel="getVisible"
      @clearInputText="clearInput"
      @clearSelection="clearSelection"
    ></Tableheader>
    <div
      style="
        height: 502px;
        width: 98%;
        top: 120px;
        justify-content: center;
        position: absolute;
        display: flex;
        margin-top: 20px;
      "
    >
      <Table
        :fenRow="fenRow"
        :cols="cols"
        :tableData="tableData"
        :textTitle="''"
        :changePage="changePage"
        :Pagebottom="bottom"
        :clearSelectData="clearSelectData"
      ></Table>
      <fenYe
        :changePage="changePage"
        @getCurrentPage="getCurrentPage"
        :fenRow="fenRow"
        :inputText="inputText"
        :selectText="selectText"
        style="bottom: 20px; position: absolute"
      ></fenYe>
    </div>
    <template #footer>
      <span
        class="dialog-footer"
        style="
          justify-content: center;
          display: flex;
          bottom: 60px;
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
</template>
<style scoped></style>
