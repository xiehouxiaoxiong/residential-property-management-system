<script setup>
import employeeBlock1 from "./components/employeeBlock1.vue";
import employeeBlock2 from "./components/employeeBlock2.vue";
import employeeBlock3 from "./components/employeeBlock3.vue";
</script>
<template>
  <div style="height: 100%; width: auto">
    <div style="width: 100%; height: 100%; display: flex">
      <div
        style="
          width: 807px;
          background-color: white;
          height: 972px;
          border-radius: 16px;
          position: relative;
        "
      >
        <employeeBlock1></employeeBlock1>
      </div>
      <div style="wdith: 100%; display: flex; flex-direction: column" class="colW">
        <div
          style="
            width: 807px;
            height: 506px;
            background-color: white;
            border-radius: 16px;
            position: relative;
          "
        >
          <employeeBlock2></employeeBlock2>
        </div>
        <div
          class="marginTop"
          style="
            width: 807px;
            height: 446px;
            background-color: white;
            border-radius: 16px;
          "
        >
          <employeeBlock3></employeeBlock3>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.colW {
  margin-left: 20px;
}

@media screen and (min-width: 1330px) and (max-width: 1920px) {
  .colW .marginTop {
    margin-top: 20px;
    height: 45%;
    position: relative;
  }
}
</style>
