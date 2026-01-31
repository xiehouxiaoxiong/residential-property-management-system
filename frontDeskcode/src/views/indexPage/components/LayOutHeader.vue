<script setup>
import {useUserStore} from '../../../store/userStore'
import {ElMessage} from 'element-plus'
import {getCurrentInstance,computed} from 'vue'
import {ref} from 'vue'
import {
  Addannouncenment,
  getAnnouncenmentList,
  announcenmentDetail,
  updateAnnouncenment,
  deleteAnnouncenment,
} from "@/apis/announcementNodejs.js";
import { useRouter } from 'vue-router'
 const useStore = useUserStore()
 const content = getCurrentInstance()
 const api = content.appContext.config.globalProperties.$uploadUrl

useStore.userInfo.user.avatar = useStore.userInfo.user.avatar
let tableData =ref({title:''})
const router = useRouter()
const getNewest = async()=>{   
    let len = ref(null)
    getAnnouncenmentList('','','','',1,1).then((res)=>{
              let len = res.data.data.total
              getAnnouncenmentList('','','','',len,2).then((res)=>{
                 
                  tableData.value = res.data.data.rows[0]
                  console.log(tableData.value);
              })
    })
   
}
getNewest()
const deleteToken = ()=>{
   const userInfoStore = useUserStore()
   userInfoStore.clearUserInfo()
   ElMessage.success('退出成功')
  
}
const goToContent = ()=>{
   router.push("/index/3")
}
</script>
<template>
  <div class="layoutHeader">
    <div style="display:flex;margin-left:30px">
      
        
       
      <div>
               <img src="../../../assets/Maskgroup.png" class="imgMask" />
      </div>
      <div class="title"><h5>小区物业管理系统</h5></div>
       <div class="rightNotice">
        <div
          style="
            color: red;
            font-weight: 700;
            margin: auto 0;
            margin-left: 10px;

            font-size: 14px;
 
           
          "
        >
          公告
        </div>
        <div style="margin: auto 0 auto 10px; width:370px;margin-top:11px;text-align:left">
         <el-text class="w-190px mb-2" truncated size="default" v-if="tableData!==undefined&&tableData.title!=null">
            {{tableData.title}}
          </el-text> 
     
        </div>
        <div class="search" @click="goToContent">查看详情</div>
      </div>
    </div>
    <div style="display: flex; height: 100%; margin-right: 20px;align-items:center">
          <el-popover
          placement="top-start"
          :title="useStore.userInfo.user.userName"
          :width="200"
          trigger="hover"
          :content="useStore.userInfo.user.role"
        >
          <template #reference>
              <div class="demo-type">
            
            <div>
            <el-avatar
                :src="useStore.userInfo.user.avatar"
                style="width:56px;height:56px"
            />

            </div>
           
            
        </div>
          </template>
        </el-popover>
          
      
      <div style="border:1px solid #E3E5E6;width:100px;height:30px;margin-left:20px;border-radius:5px;display:flex;justify-content:center;align-items:center;">
         <div class="exit" @click="deleteToken">退出</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search {
  color:#17abe3;
  font-size: 12px;
  margin: auto 0;
}
.exit {
  font-size: 14px;
  margin: auto;
  width: 40px;
  min-width:40px;
  height:20px;
  position: relative;
  margin-left:30px;
  &:before {
    content: url("../../../src/assets/quit.png");
    position: absolute;
    top: 1px;
    left: -15px;
  }
}
.rightNotice {
  display: flex;
  width: 480px;
  height: 40px;
  margin:auto 20px;
  border-radius: 10px;
  border: 1px solid #17abe3;
  background-color:#c7e3f1;
}
.layoutHeader {
  width: 100vw;
  height:68px;
  min-height: 55px;
  max-height:100px;
  background-color: white;
  border-radius:0px 0px 16px 16px;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,.08);
}
.imgMask {
  object-fit: cover;
  margin-top: 11px;
  width:40px;
  margin-top:15px;
}
.title {
  margin: auto 0;
  font-size:30px;
}
</style>
