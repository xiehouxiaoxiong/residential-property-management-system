<script setup>
import { ref, watchEffect, reactive } from "vue";
import {
  AddVisitorInfo,
  getVisitorInfoList,
  VisitorInfoDetailById,
  UpdateVisitorInfo,
  deleteVisitorInfo,
} from "@/apis/visitorInfo"; 

import zhCn from "element-plus/es/locale/lang/zh-cn";

zhCn.el.pagination.goto = "前往";
zhCn.el.pagination.pageClassifier = "页";
let emits = defineEmits(["getCurrentPage"]);
const props = defineProps({ fenRow: {}, changePage: {},inputPlod:{},selectText:{} });
let inputPlod = ref(null)
let selectText = ref(null)
let fenRow = ref(null)
let changePage = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
});
watchEffect(()=>{
  inputPlod.value=props.inputPlod
  selectText.value = props.selectText
  fenRow.value = props.fenRow
  console.log(props.fenRow);
  changePage =props.changePage
 
  updateFilterdata(1,fenRow.value)
  
  
})

const handleCurrentChange = (val) => {
  emits("getCurrentPage", val);
};


async function updateFilterdata(val, fenRow1){
  console.log(inputPlod.value,fenRow1, val);
 
  
  await getVisitorInfoList(inputPlod.value,fenRow1, val).then((res) => {
    console.log(res.data);
    let len = res.data.total;
    changePage.total = len;
    console.log(len,fenRow1);
    if (len > 0) {
      changePage.pageCount = Math.ceil(len / fenRow1);
    } else {
      changePage.pageCount = 1;
    }
    console.log(changePage);
  });
};
updateFilterdata(1, fenRow.value);
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
