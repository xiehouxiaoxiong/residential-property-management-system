<script setup>
import { useRoute } from "vue-router";
const useUseRouter = useRoute()
</script>
<template>

    <h1 style="background-color:white">Not Found /{{useUseRouter.params.pathMatch}}页面</h1>
</template>
<style scoped>
</style>