<script setup lang="ts">

import router from "../../../router";
import {ref} from "vue";

const loginOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenTime')
  router.push('/login')
}

const logoUrl = ref('/src/assets/ai.png')

</script>

<template>
  <div class="head-left">
    <el-image style="width: 30px; height: 30px;background-color: #666666" :src="logoUrl" fit="fill"/>
    <el-text class="left-text" >演示系统</el-text>
  </div>
  <div class="head-right">
    <el-button @click="loginOut">登出</el-button>
  </div>


</template>

<style scoped>
.head-left {
  display: flex;
  justify-content: start;
  align-items: center;

  .left-text{
    color: #000000;
    margin-left: 10px;
    letter-spacing: 1px;
    font-size: large !important;
  }

}

.head-right {
  display: flex;
  justify-content: end;
  align-items: center;
}

</style>