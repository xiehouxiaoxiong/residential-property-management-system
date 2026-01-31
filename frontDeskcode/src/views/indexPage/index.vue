<script setup>
import LayOutHeader from "./components/LayOutHeader.vue";
import LayOutSide from "./components/LayOutSide.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
let router = useRouter();
let routeKey;
function getIndex(e) {
  console.log(router.options.routes);
  let estring = e + "";
  if (e) {
    estring = e + "";
  } else {
    estring = "0";
  }

  if (estring.indexOf("4") == 0) {
    router.replace("/index/" + e);
    routeKey = computed(() => router.path + Math.random());
  } else {
    router.replace("/index/" + e);
    routeKey = computed(() => router.path + Math.random());
  }
}
</script>
<template>
  <div class="comprehensiveBackground">
    <div class="common-layout">
      <el-container style="height: 100%">
        <el-header>
          <LayOutHeader style="z-index: 1002"></LayOutHeader>
        </el-header>
        <el-container>
          <el-aside>
            <LayOutSide class="layoutside" @clickIndex="getIndex"></LayOutSide>
          </el-aside>
          <el-main class="mainContent">
            <div class="positionContent">
              <router-view />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<style scoped>
.positionContent {
  height: 972px;
  left: 261px;
  min-height: 980px;
  top: 88px;
  overflow: hidden;
  position: absolute;
  width: 1920px;
  min-width: 1100px;
}
.mainContent::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
.mainContent::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background: #e5e5e5;
}
.mainContent::-webkit-scrollbar-track:link {
  border-radius: 10px;
  background: black;
}
.el-main {
  --el-main-padding: 0px;
}

.el-aside {
  width: 235px !important;
}
.layoutside {
  width: 237px;
  height: 992px;
}
.comprehensiveBackground {
  width: 100vw;
  height: 100vh;

  overflow: hidden;
}
.el-header {
  --el-header-padding: 0;
}
</style>
