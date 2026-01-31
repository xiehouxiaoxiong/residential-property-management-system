<script setup>
import { ref, watchEffect, reactive } from "vue";
import {
  getLeaveInfoList,
  AddLeaveInfo,
  leaveInfoDetailById,
  deleteLeaveInfo,
  updateLeaveInfo,
} from "@/apis/leavingInfo";

import zhCn from "element-plus/es/locale/lang/zh-cn";
import moment from "moment";
const timeFormatSelect = "YYYY-MM-DD";

zhCn.el.pagination.goto = "前往";
zhCn.el.pagination.pageClassifier = "页";
let emits = defineEmits(["getCurrentPage"]);
const props = defineProps({
  fenRow: {},
  changePage: {},
  selectText: {},
  inputText: {},
  inputText2: {},
});
let { fenRow } = props;
let selectText = ref(null);
let inputText = ref(null);
let inputText2 = ref(null);
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
watchEffect(() => {
  selectText.value = props.selectText;
  inputText.value = props.inputText;
  inputText2.value = props.inputText2;
  console.log(props);
  changePage = props.changePage;
  updateFilterdata(1, fenRow);
});

const handleCurrentChange = (val) => {
  emits("getCurrentPage", val);
};

async function updateFilterdata(val, fenRow) {
  let userName = inputText.value;
  let number = inputText2.value;
  let leavingStatus = selectText.value[0];

  await getLeaveInfoList(userName, number, leavingStatus, fenRow, val).then((res) => {
    console.log(res.data);
    let len = res.data.total;
    console.log(len);
    changePage.total = len;
    if (len > 0) {
      changePage.pageCount = Math.ceil(len / fenRow);
    } else {
      changePage.pageCount = 1;
    }
  });
}
updateFilterdata(1, fenRow);
</script>
<template>
  <div class="demo-pagination-block position">
    <el-config-provider :locale="zhCn">
      <el-pagination
        :page-count="changePage.pageCount"
        :page-size="1"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total,prev, pager, next, jumper,slot"
        :total="changePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page="changePage.currentPage"
      />
    </el-config-provider>
  </div>
</template>
<style scoped>
.position {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  overflow: hidden;
  zoom: 1;
}
</style>
