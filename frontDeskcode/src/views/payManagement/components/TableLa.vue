<script setup>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

import zhCn from "element-plus/es/locale/lang/zh-cn";
import { selectExcelData } from "@/store";
import { ref, reactive, defineProps, nextTick, watch, watchEffect } from "vue";
import moment from "moment";
const timeFormat = "YYYY-MM-DD hh:mm:ss";
let selectdata1 = selectExcelData();
console.log(selectdata1.selectdata);

let props = defineProps({
  cols: { type: Array, default: [] },
  fenRow: { type: String, default: "" },
  colors: { type: String, default: "" },
  textTitle: {},
  changePage: {},
  tableData: {},
});
let tableData = ref(null);
let { textTitle, colors, cols, fenRow, changePage } = props;
let emits = defineEmits(["openDetial", "deleteNoteId", "editId"]);
watchEffect(() => {
  console.log(`子组件接收父组件传入的数据`, props);
  tableData.value = props.tableData;
  changePage = props.changePage;
});
let title = ref(null);
let dialogexport = ref(null);
let selectdata = selectExcelData();

let flagExport1;
let showMutil = ref(false);
let tableRow = ref(null);

let inputFirst = ref("");

zhCn.el.pagination.goto = "前往";
zhCn.el.pagination.pageClassifier = "页";

const currentPage = ref(4);
const pageSize = ref(100);
const small = ref(true);
const background = ref(true);
const disabled = ref(false);

let len = 0;

const handleCurrentChange = (val) => {
  emits("getCurrentPage", val);
};

function getIndexPage(index) {
  return (changePage.currentPage - 1) * fenRow + index + 1;
}

let operate = ref();

function opearteSelect(e, textTitle) {
  console.log(e);
  console.log(operate.value);

  if (e === "新增") {
    operate.value.addEnterprise();
  } else {
    selectdata.flagExport = true;

    title.value = "导出企业";

    dialogexport.value.getVisibleTitle(title, cols, select, inputPlod);
  }
}

let multipleSelection = reactive([]);
let exportid;

let lenSelect = ref(0);
function handelCancelExport() {
  dialogexport.value.handelCannelExport(false);
  showMutil.value = false;
}

function handleSelectionChange(e) {
  selectdata1.selectdata = e;
}

let indexSub = 0;

async function getForm(params, title) {
  console.log(params);
  if (title.indexOf("新增") !== -1) {
    await AddCompany(params).then((res) => {
      console.log(res);
    });

    await updateFilterdata(changePage.pageCount, fenRow, "", []);
  } else if (title.indexOf("修改") !== -1) {
    let authIndex = (changePage.currentPage - 1) * fenRow + indexSub;
    let id = params.id;
    tableData.value[authIndex] = params;
    console.log(params);

    await UpdatePeople(id, params).then((res) => {
      console.log(res);
    });
    await updateFilterdata(changePage.pageCount, fenRow, "", []);
  }
}

let dialogVisibledelete = ref(false);
let deleteId = 0;
let index;
let titleDelete = ref("");
let titleDeleteDetail = ref("");
const handleDelete = (index, data) => {
  dialogVisibledelete.value = true;
  titleDelete.value = `确定要将此${textTitle}的信息删除吗？`;
  titleDeleteDetail.value = `删除后此${textTitle}的信息将无法恢复`;
  deleteId = data.id;
  if (textTitle == "社区管理员信息") {
    deleteId = data.userId;
  }
  index = index;
};

const deleterConfirm = async () => {
  console.log(deleteId);

  emits("deleteNoteId", deleteId);
  dialogVisibledelete.value = false;
};

const backdelete = () => {
  dialogVisibledelete.value = false;
};

let bottom = ref("10px");
if (textTitle.indexOf("导出") !== -1) {
  bottom.value = "10px";
}

async function getSelectContent() {
  let enterpriseName = inputFirst.value;
  console.log(enterpriseName);
  let mainBusinessArr = selectText.value;

  updateFilterdata(changePage.currentPage, fenRow, "", []);
}

function clearSelectContent() {
  inputFirst.value = "";
  selectText.value = [];
  updateFilterdata(changePage.currentPage, fenRow, "", []);
}

const showImageViewer = ref(false);
const urlList = ref([]);
const showImg = (e) => {
  showImageViewer.value = true;
  console.log(e);
  let obj;
  if (e) {
    obj = JSON.parse(e);

    urlList.value = new Array(obj.url);
    console.log(urlList.value);
  }
};
const close = () => {
  showImageViewer.value = false;
};

function toggleSelection() {
  tableRow.value.clearSelection();
}

let importData = (file, fileList) => {
  const f = file.raw;

  let reader = new FileReader();

  FileReader.prototype.readAsBinaryString = (f) => {
    let binary = "";
    let wb;
    let outdata;
    let reader = new FileReader();
    reader.onload = async (e) => {
      let bytes = new Uint8Array(reader.result);
      let length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      wb = XLSX.read(binary, {
        type: "binary",
        cellDates: false,
      });
      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      console.log(outdata);
      const result = generateParam(outdata);
      console.log("result--", result);

      result.forEach(async (item) => {
        await AddCompany(item).then((res) => {
          console.log(res);
        });
      });
      let t = 0;
      getCompanyList(14, 1).then((res) => {
        console.log(res.data.total);
        t = res.data.total;
      });

      let pagecount = Math.ceil(t / fenRow);
      changePage.pageCount = pagecount;

      await updateAuthdata(changePage.pageCount, fenRow);
    };
    reader.readAsArrayBuffer(f);
  };
  reader.readAsBinaryString(f);
};

const generateParam = (data) => {
  const params = [];
  let parse = {};
  console.log(cols);
  cols.forEach((item) => {
    parse[item.labelName] = item.propName;
  });

  parse["照片"] = "picture";

  data.forEach((item) => {
    let obj = {};
    const keys = Object.keys(parse);
    const itemKeys = Object.keys(item);
    console.log(itemKeys);
    itemKeys.forEach((key) => {
      const val = item[key];
      if (keys.includes(key)) {
        obj[parse[key]] = val;
      }
    });
    params.push(obj);
  });
  console.log(params);
  console.log(parse);
  return params;
};
let excelBtn = ref(null);
function exportInMore(e) {
  if (e === "批量导入") {
    excelBtn.value.click();
  }
}
let formDetial;
const getDetail = (row, column, event) => {
  console.log(row);
  formDetial = row;
  emits("openDetial", formDetial);
};
const getDetailVisible = () => {
  console.log("*********");
};

const handleEdit = (index, data) => {
  console.log(data);
  emits("editItem", data);
};
const getRowKeys = (row) => {
  console.log(row.userId);
  if (row.userId === null || row.userId === undefined) {
    return row.id;
  } else {
    return row.userId;
  }
};
</script>
<template>
  <div class="RuralBlock">
    <div style="height: 25px; display: flex; margin-top: -6px">
      <div
        style="
          justify-content: center;
          align-items: center;
          height: 25px;
          display: flex;
          margin-left: 29px;
          margin-top: 5px;
          border-radius: 5px;
        "
        v-if="textTitle.indexOf('导出') !== -1"
      >
        已选{{ selectdata1.selectdata.length }}条,<span
          @click="toggleSelection()"
          style="color: #f3b805"
          >取消</span
        >
      </div>
    </div>

    <div style="font-size: 12px; width: 97%; margin: 0 auto; height: 100%">
      <el-table
        @selection-change="handleSelectionChange"
        ref="tableRow"
        :data="tableData"
        class="deleteline"
        :header-cell-style="{ background: '#F9FAFA' }"
        id="unit"
        :row-key="getRowKeys"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55"
          v-if="textTitle.indexOf('导出') !== -1"
          fixed="left"
        />
        <el-table-column label="序号" width="80" align="left" type="index">
          <template #default="scope">
            <span v-text="getIndexPage(scope.$index)"></span>
          </template>
        </el-table-column>
        <el-table-column
          :prop="item.propName"
          :label="item.labelName"
          show-overflow-tooltip
          v-for="(item, index) in cols"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <div v-if="item.propName !== 'payTime'">
              {{ scope.row[item.propName] }}
            </div>
            <div v-if="item.propName === 'payTime'">
              {{ moment(scope.row.payTime).format(timeFormat) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          v-if="textTitle.indexOf('导出') === -1"
        >
          <template #default="scope">
            <div style="color: #f3b805">
              <span @click="handleDelete(scope.$index, scope.row)" style="color: #f3b805"
                >&nbsp;&nbsp; 删除</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog
        v-model="dialogVisibledelete"
        :title="titleDelete"
        width="30%"
        :before-close="handleClose"
      >
        <div style="font-size: 13px; font-weight: 700">
          {{ titleDeleteDetail }}
        </div>
        <template #footer>
          <span class="dialog-footer" style="justify-content: center; display: flex">
            <el-button @click="backdelete" style="width: 120px">取消</el-button>
            <el-button
              type="primary"
              @click="deleterConfirm"
              style="width: 120px"
              color="#F3B805"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style scoped>
.RuralBlock {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 20px;
  margin-top: 12px;
  position: relative;
}

.el-image-viewer__mask {
  opacity: 0.05;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: rgba(0, 0, 0, 0);
  color: black;
}

.deleteline {
  --el-table-border-color: none;
  font-size: 15px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.titleItem {
  padding-top: 20px;
  margin-left: 20px;
  font-weight: 700;
}

.fontIcon {
  font-size: 12px;
  font-weight: 700;
}
</style>
