<script setup>
import { defineProps, ref, reactive, watch } from "vue";

import FileSaver from "file-saver";
import * as XLSX from "xlsx";
let props = defineProps({
  textTitle: {},
  inputPlodFirst: {},
  inputPlodSencond: {},
  select: {},
  editIconn: {},
  exportVisible: {},
  editIcon: {},
  inputPlod: {},
  cols: {},
});
let {
  textTitle,
  inputPlodFirst,
  inputPlodSencond,
  inputPlod,
  select,
  editIconn,
  exportVisible,
  editIcon,
  cols,
} = props;
import { selectExcelData } from "@/store";
let selectdata1 = selectExcelData();
console.log(selectdata1.selectdata);
watch(
  () => props,
  selectdata1.selectdata,
  () => {
    console.log(props.textTitle === "");
    textTitle = props.textTitle;
    exportVisible = props.exportVisible;
    console.log(exportVisible);
  }
);

console.log(select);
let selectText = ref(new Array(select.length).fill(""));
let inputFirst = ref("");

let emits = defineEmits(["getInputText", "clearInputText", "exportExcel", "addForm"]);

async function getSelectContent() {
  console.log(inputFirst);
  emits("getInputText", inputFirst, selectText);
}

function clearSelectContent() {
  inputFirst.value = "";
  selectText.value = [];
  emits("clearInputText");
}

let operate = ref();

function opearteSelect(e, textTitle) {
  console.log(e);
  console.log(e == "导出");
  if (e == "导出") {
    console.log(e == "导出");
    emits("exportExcel", true);
  } else if (e === "新增") {
    emits("addForm", true);
  }
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
      emits("importDataExcel", result);
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
</script>

<template>
  <div class="backgroundTop">
    <div class="titleItem">{{ textTitle }}</div>
    <div style="margin-top: 32px; display: flex" v-if="textTitle.indexOf('导出') === -1">
      <el-upload
        v-show="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        action
        :auto-upload="false"
        :show-file-list="false"
        :on-change="importData"
      >
        <span ref="excelBtn"></span>
      </el-upload>
      <div
        style="
          display: flex;
          margin-left: 5px;
          background-color: #fdf1cd;
          border-radius: 5px;
          width: 100px;
          height: 30px;
          justify-content: center;
          align-items: center;
        "
        v-for="item in editIcon"
      >
        <div>
          <img :src="item.imgIcon" />
        </div>
        <div class="fontIcon" @click="exportInMore(item.name)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>

  <!-- 筛选行 -->
  <div style="width: 100%; justify-content: center; display: flex">
    <div class="headerStyleTable">
      <div style="display: flex">
        <el-input
          v-model="inputFirst"
          :placeholder="inputPlodFirst"
          style="width: 120px; margin-left: 0px; height: 30px"
        />
        <div v-for="(item, index) in select" style="display: flex">
          <el-select
            v-model="selectText[index]"
            :placeholder="item.placeholder"
            style="width: 120px; margin-left: 10px"
            @change="getoptions"
          >
            <el-option
              v-for="itemm in item.options"
              :key="itemm.value"
              :label="itemm.label"
              :value="itemm.value"
            />
          </el-select>
        </div>

        <el-button
          color="#F3B805"
          :dark="isDark"
          style="margin-left: 10px; height: 30px; width: 52px"
          @click="getSelectContent"
          ><text style="color: white">筛选</text></el-button
        >
        <el-button
          color="#F1F1F5"
          :dark="isDark"
          style="margin-left: 10px; height: 30px; width: 52px"
          @click="clearSelectContent"
          ><text style="color: #717579">清除</text></el-button
        >
      </div>
      <!-- 筛选框右侧按钮 -->
      <div style="height: 25px; display: flex; margin-top: -6px">
        <div
          style="
            justify-content: center;
            align-items: center;
            height: 30px;
            display: flex;
            margin-left: 5px;
            width: 72px;
            margin-top: 5px;
            background-color: #fdf1cd;
            border-radius: 5px;
          "
          v-for="item in editIconn"
        >
          <div>
            <img :src="item.imgIcon" />
          </div>
          <div class="fontIcon" @click="opearteSelect(item.name, textTitle)">
            {{ item.name }}
          </div>
        </div>
        <Dialog ref="operate" @formGet="getForm"></Dialog>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-select__wrapper) {
  min-height: 30px;
}
</style>
<style scoped>
.backgroundTop {
  justify-content: center;
  width: 96.9%;
  display: flex;
  margin: 0 auto;
}
.titleItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  padding-top: 30px;
  margin-top: 0px !important;

  margin-left: 0px;
  font-size: 20px;
}
.fontIcon {
  font-size: 14px;
  margin-top: -3px;
  font-weight: 700;
}
.headerStyleTable {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  width: 96.9%;
  height: 30px;
}
</style>
