<script setup>
import { ref, reactive, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../../store/userStore";
let router = useRouter();
const route = useRoute();
const useStore = useUserStore();
let avatar = ref(null);
if (useStore.userInfo.user.avatar !== undefined) {
  avatar.value = useStore.userInfo.user.avatar;
}

let list = reactive([
  {
    iconSrc: "../../src/assets/personalInformation.png",
    iconSrcChoose: "../../src/assets/personalInformation.png",
    iconSrced: "../../src/assets/personalInformationed.png",
    textTitle: "个人信息管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/proprietorInfo.png",
    iconSrcChoose: "../../src/assets/proprietorInfo.png",
    iconSrced: "../../src/assets/proprietorInfoed.png",
    textTitle: "业主信息管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/staffInfo.png",
    iconSrcChoose: "../../src/assets/staffInfo.png",
    iconSrced: "../../src/assets/staffInfoed.png",
    textTitle: "员工管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/announcement.png",
    iconSrcChoose: "../../src/assets/announcement.png",
    iconSrced: "../../src/assets/announcemented.png",
    textTitle: "公告信息管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/vehicleManagement.png",
    iconSrcChoose: "../../src/assets/vehicleManagement.png",
    iconSrced: "../../src/assets/vehicleManagemented.png",
    textTitle: "业主车辆管理",
    contentList: [
      {
        name: "车位信息管理",
        pathContent: "",
      },
      {
        name: "车辆信息管理",
        pathContent: "",
      },
      {
        name: "车位申请",
        pathContent: "",
      },
    ],
  },
  {
    iconSrc: "../../src/assets/repairs.png",
    iconSrcChoose: "../../src/assets/repairs.png",
    iconSrced: "../../src/assets/repairsed.png",
    textTitle: "报修信息管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/complain.png",
    iconSrcChoose: "../../src/assets/complain.png",
    iconSrced: "../../src/assets/complained.png",
    textTitle: "投诉信息管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/payment.png",
    iconSrcChoose: "../../src/assets/payment.png",
    iconSrced: "../../src/assets/paymented.png",
    textTitle: "缴费记录",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/people.png",
    iconSrcChoose: "../../src/assets/people.png",
    iconSrced: "../../src/assets/peopled.png",
    textTitle: "访客记录管理",
    contentList: [],
  },
  {
    iconSrc: "../../src/assets/account.png",
    iconSrcChoose: "../../src/assets/account.png",
    iconSrced: "../../src/assets/accounted.png",
    textTitle: "管理员账号管理",
    contentList: [],
  },
]);
console.log(useStore.userInfo.user.role);

function handleOpen(index, indexPath) {
  console.log(index);
  nowIndext.value = index;
  nowIndex.value = index;
  list.forEach((item) => {
    item.iconSrcChoose = item.iconSrc;
  });
  list[index].iconSrcChoose = list[index].iconSrced;
}
function handleClose(index) {
  console.log(index);
  list[index].iconSrcChoose = list[index].iconSrc;
}
let nowIndex = ref(null);
let emit = defineEmits(["clickIndex"]);
function getIndex(e) {
  console.log(e.index);
  emit("clickIndex", e.index);
  list.forEach((item) => {
    item.iconSrcChoose = item.iconSrc;
  });
  if (list[+e.index].iconSrcChoose == list[+e.index].iconSrced) {
    list[+e.index].iconSrcChoose = list[+e.index].iconSrc;
    nowIndex.value = "";
  } else if (list[+e.index].iconSrcChoose == list[+e.index].iconSrc) {
    list[+e.index].iconSrcChoose = list[+e.index].iconSrced;
    nowIndex.value = e.index;
  }
  console.log(nowIndex.value);
}
let nowIndext = ref(null);
function getIndext(e) {
  emit("clickIndex", e.index);
  if (nowIndex.value == e.index) {
    nowIndext.value = "";
  } else {
    nowIndext.value = e.index;
  }
}

function changeTab(name) {
  console.log(name);
  activeTabName = name;
  //  router.replace('/'+name)
}
let activeTabName = reactive("0");
let indexMore = 4;
</script>
<template>
  <div class="layoutSide">
    <div class="boxScroll">
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="changeTab"
        :default-active="activeTabName"
        unique-opened="true"
      >
        <el-menu-item
          @click="getIndex"
          v-show="index < 4"
          v-for="(item, index) in list"
          :index="index"
        >
          <div style="margin-top: -28px">
            <img
              :src="list[index].iconSrcChoose"
              style="width: 30px; fit-cover: contain; padding-top: 10px"
            />
          </div>
          <div
            style="margin-left: 10px; font-size: 20px"
            :class="nowIndex === index ? 'menuClick' : 'menuNotClick'"
          >
            {{ list[index].textTitle }}
          </div>
        </el-menu-item>
        <el-sub-menu :index="indexMore">
          <template #title>
            <div style="margin-top: -28px">
              <img
                :src="list[indexMore].iconSrcChoose"
                style="width: 30px; fit-cover: contain; padding-top: 10px"
              />
            </div>

            <div
              style="margin-left: 10px; font-size: 20px"
              :class="nowIndex === indexMore ? 'menuClick' : 'menuNotClick'"
            >
              {{ list[indexMore].textTitle }}
            </div>
          </template>

          <el-menu-item-group
            v-for="(item, indext) in list[indexMore].contentList"
            class="contenlistmargin"
          >
            <el-menu-item
              :index="indexMore + '-' + indext"
              @click="getIndext"
              :class="
                nowIndext === indexMore + '-' + indext ? 'menuitemClick' : 'menuitem'
              "
              >{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item
          @click="getIndex"
          v-show="index > 4"
          v-for="(item, index) in list"
          :index="index"
        >
          <div style="margin-top: -28px">
            <img
              :src="list[index].iconSrcChoose"
              style="width: 30px; fit-cover: contain; padding-top: 10px"
            />
          </div>
          <div
            style="margin-left: 10px; font-size: 20px"
            :class="nowIndex === index ? 'menuClick' : 'menuNotClick'"
          >
            {{ list[index].textTitle }}
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<style scoped>
.menuClick {
  color: #17abe3;
}
.menuNotClick {
  color: black;
}
.menuitemClick {
  background-color: #96d5ed33;
  font-size: 20px;

  color: #17abe3;
}
.menuitem {
  color: #969ba0;
  font-size: 20px;
}
:root {
  --el-menu-hover-bg-color: #fff9ee;
}
ul {
  width: 225px;
}
.el-menu-item.is-active {
  color: #17abe3;
  width: 225px;
}
.boxScroll {
  margin-top: 50px;
  position: absolute;
  height: 90%;
  width: 210px;
  overflow: hidden;
}
.boxScroll:hover {
  overflow: auto;
  height: 90%;
  margin-top: 50px;
  width: 210px;
}
div::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
div::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background: #e5e5e5;
}
div::-webkit-scrollbar-track:link {
  border-radius: 10px;
  background: black;
}

.el-menu {
  border-right: white;
}
.contenlistmargin {
  margin-left: 10px;
  width: 100%;
  margin-top: -20px;
}
.none {
  display: none;
}
.downup {
  margin-left: -30px;
  margin-top: 15px;
}
.el-collapse-item__arrow {
  display: none;
}
.moveLeft {
  margin-left: -62px;
}
.demo-collapse {
  margin-left: 30px;
}
.el-collapse {
  border-top: 0px;
  --el-collapse-border-color: white;
}
.el-collapse-item__header {
  width: 160px;
  height: 50px;

  &:before {
    content: "";
    display: inline-block;
    background: var(--bgUrl) no-repeat;
    background-size: 60% 70%;
    object-fit: cover;
    width: 35px;
    height: 28px;
    margin-top: 5px;
  }
}

.position {
  font-size: 12px;
  color: #717579;
}
.demo-type {
  display: flex;
  margin-top: 20px;
}
.demo-type > div {
  flex: 1;
  text-align: center;
}

.demo-type > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}

.layoutSide {
  width: 257px;
  height: 992px;
  background-color: white;
  border-radius: 0px 16px 0px 0px;
  position: absolute;
  top: 88px;

  text-align: center;
}
</style>
