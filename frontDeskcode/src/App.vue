<script setup>
import * as echarts from "echarts";
import { provide, onMounted } from "vue"; 
provide("echarts", echarts);
import devPixelRatio from "@/utils/devicePixelRatio.js";
</script>
<template>
  <div>
    <header></header>

    <main>
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style scoped>
.myconfirmBtn {
  color: #ffffff;
  border: 1px solid #cfcfcf;
  background: linear-gradient(180deg, #f3b805 0%, #f3b805 100%);
}
.el-row {
  padding-left: 0 !important;
}
.el-dialog {
  --el-dialog-border-radius: 15px;
}
.el-pager li.is-active {
  color: white !important;
  background-color: rgba(243, 184, 5, 1);
  border-radius: 15px;
}
div::-webkit-scrollbar {

  width: 10px; 
  height: 1px;
  display: none;
}
div::-webkit-scrollbar-thumb {

  border-radius: 10px;

  background: #e5e5e5;
}
div::-webkit-scrollbar-track:link {
  border-radius: 10px;
  background: black;
}
</style>
