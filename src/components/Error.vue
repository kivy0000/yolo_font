<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const count = ref(5) // 倒计时 5 秒
let timer = null

// 倒计时逻辑
onMounted(() => {
  timer = setInterval(() => {
    count.value--
    if (count.value <= 0) {
      clearInterval(timer)
      router.push('/') // 跳首页
    }
  }, 1000)
})

// 清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误标题 -->
      <h1 class="error-title">出错了</h1>
      <p class="error-desc">页面不存在或访问异常</p>

      <!-- 倒计时提示（腾讯云风格） -->
      <div class="countdown-box">
        <span>{{ count }}</span>
        <span> 秒后自动返回首页</span>
      </div>

      <!-- 立即返回按钮 -->
      <button class="home-btn" @click="router.push('/')">
        立即返回首页
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体居中 */
.error-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

/* 卡片容器 */
.error-container {
  text-align: center;
  padding: 60px 80px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

/* 标题 */
.error-title {
  font-size: 22px;
  color: #333;
  margin: 0 0 12px 0;
  font-weight: 500;
}

/* 描述 */
.error-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 30px 0;
}

/* 倒计时数字 */
.countdown-box {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.countdown-box span:first-child {
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
}

/* 返回首页按钮 */
.home-btn {
  height: 36px;
  padding: 0 24px;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.home-btn:hover {
  background-color: #66b1ff;
}
</style>