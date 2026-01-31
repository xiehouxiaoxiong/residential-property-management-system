<script setup>
import { ref, reactive, watch, onUpdated, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "@/store";
let props = defineProps({ addVisible: {}, textTitle: {}, formToEdit: {} });
let labelNameArr = ref([
  { label: "用户ID", type: "" },
  { label: "报修地址", type: "" },
  { label: "预约报修时间", type: "" },
  { label: "报修细节图片", type: "image" },
  { label: "维修进展", type: "" },
  { label: "维修项目", type: "" },
  { label: "维修详情", type: "" },
  { label: "申请时间", type: "" },
  { label: "维修师傅", type: "repairEmployeeId" },
  { label: "审核状态", type: "select" },
]);
let textSwitch = reactive("是");
import { getCurrentInstance } from "vue";
const cns = getCurrentInstance();
let formToEdit = reactive({
  userId: "",
  repairAddress: "",
  repairDate: "",
  repairPicture: "",
  repairProgress: "",
  repairEvent: "",
  repairDetail: "",
  applicationtime: "",
  repairEmployeeId: "",
  auditStatus: "",
});
let { addVisible, textTitle } = props;
let form = reactive({
  userId: "",
  repairAddress: "",
  repairDate: "",
  repairPicture: "",
  repairProgress: "",
  repairEvent: "",
  repairDetail: "",
  applicationtime: "",
  repairEmployeeId: "",
  auditStatus: "",
});

watch(
  () => props.formToEdit,
  () => {
    console.log(props.formToEdit);
    if (textTitle.indexOf("修改") !== -1) {
      formToEdit = props.formToEdit;
    } else {
      formToEdit = form;
    }
    if (props.textTitle.indexOf("修改") !== -1 && props.formToEdit.face !== null) {
      formToEdit = props.formToEdit;
    }
  },
  {
    deep: true,
  }
);

watch(
  () => props,
  () => {
    dialogVisible.value = props.addVisible;
    console.log(dialogVisible.value);
    if (props.addVisible === true) {
      VehicleInformation();
    }
    textTitle = props.textTitle;
  },
  {
    deep: true,
  }
);

let selectForm1 = selectForm();
let labelPosition = ref("left");

let emits = defineEmits(["formGet"]);

let dialogVisible = ref(false);
let select = reactive([]);

let ruleFormRef = ref(null);
let rules = reactive({
  repairEmployeeId: [{ required: true, message: "选择维修师傅", trigger: "blur" }],
  auditStatus: [{ required: true, message: "请选择审核状态", trigger: "blur" }],
});
let form1;
let formFilter;
function VehicleInformation() {
  dialogVisible.value = true;

  select = ["1", "2"];
}

function handelCancel() {
  if (textTitle.indexOf("新增") === -1) {
    console.log(form1);
    if (form1 !== undefined) {
      emits("formGet", form1, textTitle);
    }
  }
  dialogVisible.value = false;
}

const getVisibleNow = () => {
  emits("closeAddDialog");
};

let getChange = (res) => {
  console.log(res);
  if (res == 0) {
    textSwitch = "否";
  } else {
    textSwitch = "是";
  }
  console.log(formToEdit.isResident);
  console.log(formToEdit.isResident === 0);
  labelNameArr.value = formToEdit.isResident === 0 ? labelNameArrNo : labelNameArrYes;
  form = formToEdit.isResident === 0 ? formNo : formYes;
};
function addData() {
  ruleFormRef.value.validate(async (valid) => {
    console.log(valid);

    if (valid) {
      dialogVisible.value = false;
      console.log(formToEdit);

      emits("formGet", formToEdit, textTitle);
    }
  });
}
import {
  getEmployeeList,
  AddEmployee,
  EmployeeDetail,
  deleteEmployee,
  updateEmployee,
} from "@/apis/employee";
let auditStatusArr = ["通过", "不通过"];
let repairEmployeeIdArr = ref(null);
let repairEmployeeIdArrValue = ref(null);
getEmployeeList("", "", "", 1, 1).then((res) => {
  console.log(res);
  let total = res.data.total;
  getEmployeeList("", "维修工", "", total, 1).then((ress) => {
    console.log(ress);
    repairEmployeeIdArr.value = ress.data.data.rows.map((item) => {
      return "工号" + item.number + "    姓名" + item.userName;
    });
    repairEmployeeIdArrValue.value = ress.data.data.rows.map((item) => {
      return item.number;
    });
  });
});
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
    custom-class="classDialog"
    align="left"
  >
    <el-form
      :model="formToEdit"
      ref="ruleFormRef"
      :rules="rules"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-form-item
        :label="item.label"
        v-for="(item, index) in labelNameArr"
        :prop="Object.keys(form)[index]"
      >
        <div v-if="item.type === ''" style="width: 250px">
          {{ formToEdit[Object.keys(form)[index]] }}
        </div>
        <div v-if="item.type === 'repairEmployeeId'" style="width: 250px">
          <el-select
            v-model="formToEdit[Object.keys(form)[index]]"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              :label="item"
              :value="repairEmployeeIdArrValue[index]"
              v-for="(item, index) in repairEmployeeIdArr"
            />
          </el-select>
        </div>
        <div v-if="item.type === 'select'" style="width: 250px">
          <el-select
            v-model="formToEdit[Object.keys(form)[index]]"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option :label="item" :value="item" v-for="item in auditStatusArr" />
          </el-select>
        </div>
        <div v-if="item.type === 'image'" style="width: 50px">
          <div style="width: 50px; height: 50px">
            <img
              :src="formToEdit[Object.keys(form)[index]]"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span style="display: flex; justify-content: center">
        <el-button @click="handelCancel" style="width: 110px">取 消</el-button>
        <el-button color="#F3B805" @click="addData" style="width: 110px">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped></style>
