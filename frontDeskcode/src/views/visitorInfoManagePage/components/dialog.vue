<script setup>
import { ref, reactive, watch, onUpdated, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "@/store";
let props = defineProps({ addVisible: {}, textTitle: {}, formToEdit: {} });
let labelNameArr = ref([
  { label: "姓名", type: "input" },
  { label: "性别", type: "select" },
  { label: "联系方式", type: "input" },
  { label: "欠费", type: "input" },
]);
let textSwitch = reactive("是");
import { getCurrentInstance } from "vue";
const cns = getCurrentInstance();

let formToEdit = reactive({
  userName: "",
  sex: "",
  phoneNumber: "",
  arrearage: "",
});
let { addVisible, textTitle } = props;

let form = reactive({
  userName: "",
  sex: "",
  phoneNumber: "",
  arrearage: "",
});

watch(
  () => props.formToEdit,
  () => {
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
  phoneNumber: [{ required: true, message: "请填写联系方式", trigger: "blur" }],
  sex: [{ required: true, message: "请填写性别", trigger: "blur" }],
  userName: [{ required: true, message: "请填写姓名", trigger: "blur" }],
  arrearage: [{ required: true, message: "请填写欠费金额", trigger: "blur" }],
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

      emits("formGet", formToEdit, textTitle);
    }
  });
}

let selectArr = { sex: ["男", "女"] };
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
    custom-class="classDialog"
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
        <div v-if="item.type === 'switch'">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="rgba(164, 169, 182, 0.20)"
            v-model="formToEdit.isResident"
            @change="getChange"
            style="--el-switch-on-color: #f3b805"
          />
          {{ textSwitch }}
        </div>
        <div v-if="item.type === 'input'" style="width: 250px">
          <el-input
            v-model="formToEdit[Object.keys(form)[index]]"
            style="width: 100%"
            placeholder="请输入"
          ></el-input>
        </div>
        <div v-if="item.type === 'select'" style="width: 250px">
          <el-select
            v-model="formToEdit[Object.keys(form)[index]]"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              :label="item"
              :value="item"
              v-for="item in selectArr[Object.keys(form)[index]]"
            />
          </el-select>
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
