<script setup>
import { ref, reactive, watchEffect } from "vue";
let props = defineProps({ url: {}, MonitorPictureVisible: {} });
let url = ref(null);
let dialogVisible = ref(false);
watchEffect(() => {
  url.value = props.url;

  dialogVisible.value = props.MonitorPictureVisible;
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="监控画面"
    width="40%"
    :before-close="handleClose"
  >
    <div style="width: 100%; text-align: center">
      <el-image style="width: 95%; height: 95%" :src="url" fit="cover" />
    </div>
  </el-dialog>
</template>
<style scoped></style>
