<template>
  <el-container>
    <el-header class="header">
      <Header/>
    </el-header>
    <el-container>
      <el-aside class="aside">
       <Left/>
      </el-aside>
      <el-main class="center">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import router from "../router";
import {ElMessage} from "element-plus";
import Left from "./inside/left/Left.vue";
import Header from "./inside/header/Header.vue";
import {onBeforeMount} from "vue";



onBeforeMount(() =>
    checkTokenExpire()
)

// 检查 token 是否过期（2小时有效期）
const checkTokenExpire = () => {
  const tokenTime = localStorage.getItem('tokenTime')
  const token = localStorage.getItem('token')

  if (!token || !tokenTime) {
    ElMessage.warning('登录已过期，请重新登录')
    localStorage.removeItem('token')
    localStorage.removeItem('tokenTime')
    router.push('/login')
    return false
  }

  // 当前时间
  const now = new Date().getTime()
  // 存入的时间
  const createTime = parseInt(tokenTime)
  // 2小时 换算成毫秒
  const maxAge = 2 * 60 * 60 * 1000

  // 过期判断
  if (now - createTime > maxAge) {
    ElMessage.warning('登录已过期，请重新登录')
    localStorage.removeItem('token')
    localStorage.removeItem('tokenTime')
    router.push('/login')
    return false
  }

  return true
}

</script>


<style scoped>
.header {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 5vh;
  align-content: start;
  background-color: #fff;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /*一个最左，一个最右 */
  border-bottom: 1px solid #f5f5f5;
}

.aside {
  width: 230px;
  height: 95vh;
  background-color: #f5f5f5;
}

.center{
  background-color: #f5f5f5;
}
</style>