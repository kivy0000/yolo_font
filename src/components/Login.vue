<script setup lang="ts" name="login">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 表单绑定数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单引用（用于校验）
const loginFormRef = ref(null)

// 手动登录方法（你自己控制提交）
const handleLogin = async () => {
  // 先做表单校验
  const valid = await loginFormRef.value?.validate()
  if (!valid) return

  // ======================
  // 在这里写你自己的登录逻辑
  // ======================
  console.log('手动提交登录：', loginForm)

  ElMessage.success('手动登录成功！')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧 -->
      <div class="left-box">
        <h1>智慧卡口管理系统</h1>
      </div>

      <!-- 右侧登录表单 -->
      <div class="right-box">
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="({
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
          })"
            class="login-form"
        >
          <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 登录按钮 → 点击才提交，无自动提交 -->
          <el-button
              type="primary"
              class="login-btn"
              @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体背景（与你图片保持一致） */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #fff, #1d2d58);
}

/* 登录卡片 */
.login-container {
  width: 700px;
  height: 380px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 左侧 */
.left-box {
  flex: 1;
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-box h1 {
  color: #fff;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 2px;
}

/* 右侧表单 */
.right-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 50px;
  background: #ffffff;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.login-btn {
  height: 38px;
  font-size: 15px;
  letter-spacing: 1px;
}
</style>