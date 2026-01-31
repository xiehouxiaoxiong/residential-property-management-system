<script setup>
import { ref, reactive, watch, onUpdated, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { selectForm } from "@/store";
import moment from "moment";
let props = defineProps({ addVisible: {}, textTitle: {}, formToEdit: {} });
const timeFormat = "YYYY-MM-DD";
let labelNameArr = ref([
  { label: "用户ID", type: "input" },
  { label: "停车场", type: "select" },
  { label: "车位序号", type: "input" },
  { label: "车位申请开始时间", type: "date" },
  { label: "车位申请结束时间", type: "date" },
  { label: "审核结果", type: "select" },
  { label: "审核意见", type: "textarea" },
]);
let textSwitch = reactive("是");
import { getCurrentInstance } from "vue";
const cns = getCurrentInstance();

let formToEdit = reactive({
  userId: "",
  parkingName: "",
  parkingNumber: "",
  parkingStartTime: "",
  parkingEndTime: "",
  auditResult: "待审核",
  auditOpinion: "",
});
let { addVisible, textTitle } = props;

let form = reactive({
  userId: "",
  parkingName: "",
  parkingNumber: "",
  parkingStartTime: "",
  parkingEndTime: "",
  auditResult: "待审核",
  auditOpinion: "",
});

watch(
  () => props.formToEdit,
  () => {
    if (textTitle.indexOf("审核") !== -1) {
      formToEdit = props.formToEdit;
    } else {
      formToEdit = form;
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
  auditResult: [{ required: true, message: "请选择审核结果", trigger: "blur" }],
  auditOpinion: [{ required: true, message: "请填写审核意见", trigger: "blur" }],
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

function addData() {
  ruleFormRef.value.validate(async (valid) => {
    console.log(valid);

    if (valid) {
      dialogVisible.value = false;

      emits("formGet", formToEdit, textTitle);
    }
  });
}

let selectArr = { auditResult: ["通过", "不通过"] };
</script>
<template>
  <el-dialog
    @close="getVisibleNow"
    v-model="dialogVisible"
    :title="textTitle"
    width="23%"
  >
    <el-form
      :model="formToEdit"
      ref="ruleFormRef"
      :rules="rules"
      label-width="130px"
      :label-position="labelPosition"
    >
      <el-form-item
        :label="item.label"
        v-for="(item, index) in labelNameArr"
        :prop="Object.keys(form)[index]"
        align="left"
      >
        <div
          style="width: 250px"
          v-if="
            Object.keys(form)[index] !== 'parkingStartTime' &&
            Object.keys(form)[index] !== 'parkingEndTime' &&
            index < 5
          "
        >
          {{ formToEdit[Object.keys(form)[index]] }}
        </div>

        <div style="width: 250px" v-if="Object.keys(form)[index] === 'parkingStartTime'">
          {{ moment(formToEdit[Object.keys(form)[index]]).format(timeFormat) }}
        </div>
        <div style="width: 250px" v-if="Object.keys(form)[index] === 'parkingEndTime'">
          {{ moment(formToEdit[Object.keys(form)[index]]).format(timeFormat) }}
        </div>
        <div v-if="index >= 5" style="width: 250px">
          <div v-if="item.type === 'select'">
            <el-select
              v-model="formToEdit.auditResult"
              placeholder="请选择"
              style="width: 250rpx"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="item in selectArr[Object.keys(form)[index]]"
              />
            </el-select>
          </div>
          <div v-if="item.type === 'textarea'">
            <textarea
              v-model="formToEdit[Object.keys(form)[index]]"
              style="width: 100%"
              placeholder="请输入"
            ></textarea>
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
