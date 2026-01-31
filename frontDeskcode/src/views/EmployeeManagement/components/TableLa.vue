<script setup>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";
import ExportDialog from "./ExportDialog.vue";
import { selectExcelData } from "../../../store";
import { ref, reactive, defineProps, nextTick, watch, watchEffect } from "vue";

const timeFormat = "YYYY-MM-DD HH:mm:ss";
let selectdata1 = selectExcelData();
let props = defineProps({
  cols: { type: Array, default: [] },
  fenRow: { type: String, default: "" },
  colors: { type: String, default: "" },
  textTitle: {},
  tableData: {},
  changePage: {},
  Pagebottom: {},
});
let { textTitle, colors, cols, fenRow, Pagebottom } = props;
let changePage = ref(null);
let tableData = ref(null);
let emits = defineEmits(["openDetial", "deleteNoteId", "editId", "getCurrentPage"]);
watchEffect(() => {
  tableData.value = props.tableData;
  changePage = props.changePage;
  Pagebottom = props.Pagebottom;
});
let title = ref(null);
let dialogexport = ref(null);
let selectdata = selectExcelData();
let flagExport1;
let showMutil = ref(false);
let tableRow = ref(null);

let inputFirst = ref("");

const currentPage = ref(4);
const pageSize = ref(100);
const small = ref(true);
const background = ref(true);
const disabled = ref(false);
let len = 0;

const handleCurrentChange = (val) => {
  changePage.currentPage = val;
  emits("getCurrentPage", val);
};
function getIndexPage(index) {
  return (changePage.currentPage - 1) * fenRow + index + 1;
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
  index = index;
};
const deleterConfirm = async () => {
  emits("deleteNoteId", deleteId);
  dialogVisibledelete.value = false;
};
const backdelete = () => {
  dialogVisibledelete.value = false;
};
let bottom = ref("-10px");
if (textTitle.indexOf("导出") !== -1) {
  bottom.value = "-120px";
}

async function getSelectContent() {
  let enterpriseName = inputFirst.value;
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

const MonitorPictureVisible = ref(false);
const showImg = (e) => {
  showImageViewer.value = true;
  urlList.value = e;
  MonitorPictureVisible.value = true;
};
const close = () => {
  showImageViewer.value = false;
};

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
      const result = generateParam(outdata);
      result.forEach(async (item) => {
        await AddCompany(item).then((res) => {});
      });
      let t = 0;
      getCompanyList(14, 1).then((res) => {
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
  cols.forEach((item) => {
    parse[item.labelName] = item.propName;
  });

  parse["照片"] = "picture";

  data.forEach((item) => {
    let obj = {};
    const keys = Object.keys(parse);
    const itemKeys = Object.keys(item);
    itemKeys.forEach((key) => {
      const val = item[key];
      if (keys.includes(key)) {
        obj[parse[key]] = val;
      }
    });
    params.push(obj);
  });
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
  formDetial = row;
  emits("openDetial", formDetial);
};
const getDetailVisible = () => {};

const handleEdit = (index, data) => {
  let editId = data.id;
  console.log(data);
  emits("editId", editId);
};
let selectType = {
  招聘: {
    image: 'url("/src/assets/advertise.png")',
    color: "rgba(0, 150, 215, 1)",
  },
  活动: {
    image: 'url("/src/assets/activity.png")',
    color: "rgba(36, 154, 56, 1)",
  },
  提醒: {
    image: 'url("/src/assets/notice.png")',
    color: "rgba(193, 39, 23, 1)",
  },
  通知: {
    image: 'url("/src/assets/notice1.png")',
    color: "rgba(236, 127, 0, 1)",
  },
};
let selectStatus = {
  待审核: "rgba(236, 127, 0, 1)",
  已审核: "rgba(36, 154, 56, 1)",
  未通过: "rgba(193, 39, 23, 1)",
};

function toggleSelection() {
  tableRow.value.clearSelection();
}
</script>
<template>
  <div style="font-size: 16px; width: 98%; height: 100%">
    <div style="height: 25px; display: flex" v-if="textTitle.indexOf('导出') !== -1">
      <div
        style="
          justify-content: center;
          align-items: center;
          height: 25px;
          display: flex;
          margin-left: 5px;
          margin-top: 5px;
          border-radius: 5px;
        "
      >
        已选{{ selectdata1.selectdata.length }}条,<span
          @click="toggleSelection"
          style="color: #f3b805"
          >取消</span
        >
      </div>
    </div>

    <el-table
      @selection-change="handleSelectionChange"
      @row-click="getDetail"
      ref="tableRow"
      row-key="id"
      :data="tableData"
      class="deleteline"
      :header-cell-style="{ background: '#F9FAFA' }"
      id="unit"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
        v-if="textTitle.indexOf('导出') !== -1"
        fixed="left"
      />
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
        v-if="textTitle.indexOf('导出') === -1"
      >
        <template #default="scope">
          <span v-text="getIndexPage(scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.propName"
        :label="item.labelName"
        show-overflow-tooltip
        v-for="(item, index) in cols"
      >
        <template #default="scope">
          <div v-if="item.propName !== 'leavingStatus'">
            {{ scope.row[item.propName] }}
          </div>
          <div v-if="item.propName === 'leavingStatus'">
            <div v-if="scope.row.leavingStatus === '待审核'" style="color: yellow">
              {{ scope.row[item.propName] }}
            </div>
            <div v-if="scope.row.leavingStatus === '通过'" style="color: green">
              {{ scope.row[item.propName] }}
            </div>
            <div v-if="scope.row.leavingStatus === '打回'" style="color: red">
              {{ scope.row[item.propName] }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="120"
        v-if="textTitle.indexOf('导出') === -1 && textTitle.indexOf('出勤') == -1"
      >
        <template #default="scope">
          <div style="color: #f3b805">
            <span
              @click="handleEdit(scope.$index, scope.row)"
              style="color: #f3b805"
              v-if="textTitle.indexOf('请假') === -1"
            >
              修改</span
            >
            <span
              @click="handleEdit(scope.$index, scope.row)"
              style="color: #f3b805"
              v-if="textTitle.indexOf('请假') !== -1"
            >
              审核</span
            >
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
      <div style="font-size: 13px; font-weight: 700">{{ titleDeleteDetail }}</div>
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
</template>
<style scoped>
.statusAnnouncement {
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 5px;
  width: 50px;
  height: 20px;
  color: var(--modalColor);
  border: 1px solid var(--modalColor);
}
.typeAnnouncement {
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  width: 50px;
  height: 20px;
  margin-left: 8px;
  color: var(--modalColor);
  &:before {
    content: var(---modalImage);
    display: inline-block;
    left: 12px;
    top: 10px;
    position: absolute;
  }
}
.el-image-viewer__mask {
  opacity: 0.05;
}
::v-deep(.is-active) {
  background-color: #f3b805;
  border-radius: 30px;
}
::v-deep(li.is-active) {
  color: white;
}

.deleteline {
  --el-table-border-color: none;
  font-size: 15px;
  width: 100%;
}
.titleTrafficc {
  margin-left: 18px;
  margin-top: 20px;
  justify-content: space-between;
  width: 93%;
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
  margin-top: -3px;
  font-weight: 700;
}
</style>
