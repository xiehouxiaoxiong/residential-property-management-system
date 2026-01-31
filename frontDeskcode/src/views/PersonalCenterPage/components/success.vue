<script setup>
import { ref,defineProps } from "vue";

let successText 
let imgSrc
let successVisible = ref(false)
  function changeSuccessSate() {
      successVisible.value = true
       console.log(successText);
       successText = "操作成功"
      imgSrc = "/src/assets/success.png"
  }
  function changeFailureSate(params) {
      successVisible.value = true
      successText = "操作失败"
      imgSrc = "/src/assets/failure.png"
  }
  defineExpose({
    changeSuccessSate,
    changeFailureSate
  })
</script>
<template>
     <el-dialog
        v-model="successVisible"
        width="20%"
        :before-close="handleClose"
        :show-close="false"
    >
        <div class="messagebox">
            <div style="justify-content:center;width:100%;display:flex">
            <img :src="imgSrc" class="imgicon"/>
            </div>
            <h3 style="justify-content:center;width:100%;display:flex">{{successText}}</h3>
        </div>
        <template #footer>
        <span class="dialog-footer" style="display:flex;justify-content:center">
         
            <el-button type="primary" @click="successVisible = false" color="#F3B805" style="width:180px">
            确定
            </el-button>
        </span>
        </template>
   </el-dialog>
</template>
<style scoped>
.el-icon svg {
    opacity:0
}
.messagebox{
  display: flex;
  flex-direction: column;
  width:100%;
  margin-top:-20px;
  height:70px;
}
.form{
  margin-top:40px
}
.imgicon{
  width: 68px;
  height: 68px;
  object-fit: cover;

}
.loginsuccess{
  height: 180px;
}
</style>