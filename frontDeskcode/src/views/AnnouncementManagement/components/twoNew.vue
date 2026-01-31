<script setup>
import {ref,reactive,watchEffect} from 'vue'
import {useUserStore} from '@/store/userStore'
import {getCurrentInstance} from 'vue'
const cns = getCurrentInstance()
const useStore = useUserStore()
let avatar = ref(null)
avatar.value = useStore.userInfo.user.avatar
let nickName = ref(null)
nickName.value=useStore.userInfo.user.nickName
let props = defineProps({newTwoTable:{}})
let newTwoTable =ref(null)
watchEffect(()=>{
  newTwoTable.value = props.newTwoTable
})
let picUrl = cns.appContext.config.globalProperties.$uploadUrl
let announcementPic = [picUrl+'images/1.jpg',picUrl+'images/2.jpg',picUrl+'images/3.jpg',picUrl+'images/4.jpg']
</script>
<template>
    <div class="trafficBackground1">

            <div style="font-weight:700;font-size:20px;padding:20px;text-align:left">
                最新公告
            </div>
            <el-row :gutter="30" style="width:102%;margin-left:20px">
                <el-col :span="14" style="border-radius:16px">
                    <el-carousel :interval="5000" arrow="always" height="auto">
                        <el-carousel-item v-for="item in announcementPic" :key="item" style="height:230px">
                            <img :src="item" style="object-fit:cover;border-radius:20px;width:100%;height:100%"></img>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
                <el-col :span="9" style="margin-left:10px;margin-top:50px;">
                <el-row :gutter="30">
                    <el-col :span="12" v-for="item in newTwoTable">
                        <div>
                            <div>
                                <img :src="item.picture!==''?item.picture:'/src/assets/ss.png'" class="imgNoticeRight" v-if="item.picture!==''">
                            </div>
                            <div style="display:flex;flex-direction:row;width:100%">
                                <div style="position:relative;height:100%;width:100%">
                                    <div class="spacebe">
                                        <div style="font-size:12px;font-weight:700">{{item.title}}</div>
                                        <div style="font-size:12px;display:flex">
                                            <img src="/src/assets/eye.png"><div style="color:#969BA0">123</div>
                                        </div>
                                    </div>
                                    <div style="font-size:12px;margin-top:5px;text-align:left;width:95%">
                                        {{item.content}}
                                    </div>
                                    <div class="spacebed">
                                        <div style="font-size:12px;display:flex;align-items:center">
                                            <el-avatar :size="30" :src="avatar" />
                                            {{nickName}}
                                        </div>
                                        <img :src="cns.appContext.config.globalProperties.$uploadUrl+'/profile/upload/2023/11/25/1-0_20231125171935A001.jpg'" alt="" style="width:20px;height:10px"> 
                                        <div style="font-size:12px;color:#969BA0;margin-top:7px">{{item.releaseTime}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    </el-row>
                </el-col>
            </el-row>
 </div>
</template>
<style scoped>
.el-row{
    padding-left:10px
}
.spacebe{
    display:flex;
    justify-content:space-between;
}
.spacebed{
    display:flex;
    justify-content:space-between;
    position:absolute;
    top:-195px;
    width:95%;
    padding:2px 5px 4px 5px;
    box-shadow:5px 5px 20px #e6e6e6;
    border:1px solid black;
    border-radius:20px;
}
.trafficBackground1{
    width: 1635px;
    height: 330px;
    background-image:linear-gradient(to right,rgba(239, 247, 255, 1),rgba(242, 249, 255, 1));
    box-shadow:0 12px 23px 0 rgba(62, 73, 84, 0.04);
    border-radius:20px;
    position:relative;
}
.imgNoticeRight{
    width:280px;
    height:140px;
    border-radius:15px;
    object-fit:cover;
    
}
.imgNoticeLeft{
    width:500px;
    height:180px;
    border-radius:15px;
    object-fit:cover;
}
</style>