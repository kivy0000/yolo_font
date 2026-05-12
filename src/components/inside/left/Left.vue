<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import * as Icons from '@element-plus/icons-vue'
import router from "../../../router";

import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = ref('1') // 默认选中

// 刷新/路由变化时自动选中
const setActiveByRoute = () => {
  const item = menuItems.find(m => m.path === route.path)
  if (item) activeIndex.value = item.index
}

// 页面加载 + 路由变化都执行
onMounted(setActiveByRoute)
watch(() => route.path, setActiveByRoute)

// 动态获取图标方法
const getIcon = (iconName: string) => {
  return Icons[iconName as keyof typeof Icons]
}

const menuItems = reactive([
  { index: '1', title: '首页', path: '/', icon: 'House' },
  { index: '2', title: '基于YOLOV8的目标检测', path: '/yolo', icon: 'Monitor' },
  { index: '3', title: '数据分析案例', path: '/data', icon: 'DataAnalysis' },
])

const goRouter = (path:string) => {
  router.push(path)
}

</script>

<template>
  <el-menu

      class="menu-left"
      background-color="#f5f5f5"
            text-color="#333333"
            active-text-color="#409EFF"
      :default-active="activeIndex"
  >
    <el-menu-item v-for="item in menuItems" :index="item.index" @click="goRouter(item.path)">
      <el-icon>
        <component :is="getIcon(item.icon)" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

.menu-left {
height: 95vh;

}

</style>