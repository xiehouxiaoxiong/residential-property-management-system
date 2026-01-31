<script setup>
import { defineProps, ref, reactive, watch } from "vue";
let props = defineProps({
  textTitle: {},
  inputPlod: {},
  select: {},
  editIconn: {},
  exportVisible: {},
  editIcon: {},
});
let { textTitle, inputPlod, select, editIconn, exportVisible, editIcon } = props;
import { selectExcelData } from "../../../store";
let selectdata1 = selectExcelData();
watch(
  () => props,
  selectdata1.selectdata,
  () => {
    textTitle = props.textTitle;
    exportVisible = props.exportVisible;
  }
);
let selectText = ref(new Array(select.length).fill(""));
let inputFirst = ref("");
let emits = defineEmits([
  "getInputText",
  "clearInputText",
  "exportExcel",
  "addForm",
  "clearSelection",
]);

async function getSelectContent() {
  emits("getInputText", inputFirst, selectText);
}

function clearSelectContent() {
  inputFirst.value = undefined;
  selectText.value = [undefined, undefined, undefined];
  emits("clearInputText");
}

let operate = ref();
function opearteSelect(e, textTitle) {
  if (e == "导出") {
    emits("exportExcel", true);
  } else if (e === "新增") {
    emits("addForm", true);
  }
}
</script>
<template>
  <div style="justify-content: space-between; width: 100%; display: flex">
    <div class="titleItem">{{ textTitle }}</div>
    <div style="margin-top: 22px; display: flex">
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
          width: 72px;
          height: 30px;
          justify-content: center;
          align-items: center;
        "
        v-for="item in editIcon"
      >
        <img :src="item.imgIcon" />
        <div class="fontIcon" @click="exportInMore(item.name)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>

  <div style="display: flex; justify-content: center; width: 100%">
    <div style="width: 98%; justify-content: center; display: flex">
      <div style="display: flex" class="headerStyleTable">
        <div style="display: flex">
          <el-input
            v-model="inputFirst"
            :placeholder="inputPlod"
            style="width: 120px; margin-left: 0px; height: 30px"
          />
          <div v-for="(item, index) in select" style="display: flex">
            <el-select
              v-model="selectText[index]"
              class="m-2"
              :placeholder="item.placeholder"
              style="width: 120px; margin-left: 10px"
              @change="getoptions"
              v-if="index !== select.length - 1"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div style="display: flex; margin-left: 10px">
            <el-date-picker
              v-model="selectText[2]"
              type="date"
              placeholder="时间"
              style="width: 100px; height: 30px"
            />
          </div>
          <el-button
            color="#F3B805"
            :dark="isDark"
            style="margin-left: 10px; height: 30px; font-size: 14px"
            @click="getSelectContent"
            ><text style="color: white">筛选</text></el-button
          >
          <el-button
            color="#F1F1F5"
            :dark="isDark"
            style="margin-left: 10px; height: 30px; font-size: 14px"
            @click="clearSelectContent"
            ><text style="color: #717579">清除</text></el-button
          >
        </div>

        <div style="height: 25px; display: flex; margin-top: -6px">
          <div
            style="
              justify-content: center;
              align-items: center;
              height: 30px;
              display: flex;
              margin-left: 5px;
              width: 70px;
              margin-top: 5px;
              background-color: #fdf1cd;
              border-radius: 5px;
            "
            v-for="item in editIconn"
          >
            <img :src="item.imgIcon" />
            <div class="fontIcon" @click="opearteSelect(item.name, textTitle)">
              {{ item.name }}
            </div>
          </div>
          <Dialog ref="operate" @formGet="getForm"></Dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-select__wrapper) {
  min-height: 30px;
}
.titleItem {
  padding-top: 20px;
  margin-left: 20px;
  font-weight: 700;
  font-size: 20px;
}
.fontIcon {
  font-size: 14px;
  font-weight: 700;
}
.headerStyleTable {
  margin-top: 20px;
  justify-content: space-between;
  width: 100%;
  height: 30px;
}
</style>
