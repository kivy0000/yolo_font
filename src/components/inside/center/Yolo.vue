<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElImage, ElButton, ElDialog, ElTable, ElTableColumn, ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 左侧上传区
const originalImage = ref<string | null>(null)
const imageInfo = ref('')

// 右侧结果区
const resultImage = ref<string | null>(null)
const fitRate = ref('')
const otherInfo1 = ref('')
const otherInfo2 = ref('')

// loading
const loading = ref(false)

// 历史记录
const historyDialogVisible = ref(false)
const historyList = ref<any[]>([])

// 页面初始化清空
const resetPage = () => {
  originalImage.value = null
  imageInfo.value = ''
  resultImage.value = null
  fitRate.value = ''
  otherInfo1.value = ''
  otherInfo2.value = ''
}

// 图片上传
const handleUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    originalImage.value = event.target?.result as string
    imageInfo.value = `文件名：${file.name} | 大小：${(file.size / 1024).toFixed(2)} KB`
  }
  reader.readAsDataURL(file)
}

// 开始目标检测
const startDetection = async () => {
  if (!originalImage.value) {
    ElMessage.warning('请先上传文件')
    return
  }
  loading.value = true
  // 模拟后端请求
  setTimeout(() => {
    // 模拟返回结果（实际项目替换为后端接口）
    resultImage.value = originalImage.value // 模拟结果图，实际应替换为后端返回的检测结果
    fitRate.value = '95.2%'
    otherInfo1.value = '检测目标：person ×3'
    otherInfo2.value = '耗时：120ms'

    // 记录到历史
    historyList.value.push({
      id: Date.now(),
      original: originalImage.value,
      result: resultImage.value,
      fitRate: fitRate.value,
      info1: otherInfo1.value,
      info2: otherInfo2.value,
      time: new Date().toLocaleString()
    })

    loading.value = false
  }, 2000)
}

// 点击历史记录
const loadHistory = (row: any) => {
  originalImage.value = row.original
  resultImage.value = row.result
  fitRate.value = row.fitRate
  otherInfo1.value = row.info1
  otherInfo2.value = row.info2
  historyDialogVisible.value = false
}

// 下载结果图片
const downloadResult = () => {
  if (!resultImage.value) return
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = `yolo_result_${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onMounted(() => {
  resetPage()
})
</script>

<template>
  <div class="yolo-page">
    <!-- 蓝色框：技术信息区 -->
    <div class="tech-bar">
      <div class="tech-info">
        <div class="title">基于YOLOV8的目标检测</div>
        <div class="params">
          参数列: 算法：yolov8 &nbsp;&nbsp; 框架：pytorch &nbsp;&nbsp; 数据集： &nbsp;&nbsp; xxx： &nbsp;&nbsp; xxx： &nbsp;&nbsp; xxx：
        </div>
      </div>
      <div class="history-btn">
        <el-button @click="resetPage" type="primary">重置</el-button>
        <el-button @click="historyDialogVisible = true">目标检测历史记录</el-button>
      </div>
    </div>

    <!-- 左右两个绿色框 -->
    <div class="content-wrap">
      <!-- 左侧：上传区 -->
      <div class="left-panel">
        <!-- 黄色框：上传区域 -->
        <div class="upload-box" v-if="!originalImage">
          <input type="file" accept="image/*" @change="handleUpload" class="upload-input" />
          <div class="upload-tip">请上传图片</div>
        </div>
        <div class="uploaded-box" v-else>
          <!-- 信息区放最上面 -->
          <div class="image-info-box">
            <div class="image-info">{{ imageInfo }}</div>
            <el-button type="primary" @click="startDetection" class="detect-btn">开始目标检测</el-button>
          </div>
          <!-- 图片放下面 -->
          <el-image :src="originalImage" fit="contain" class="preview-img" />
        </div>
      </div>

      <!-- 右侧：结果区 -->
      <div class=" right-panel">
        <!-- 红色框：结果信息区 -->
        <div class="result-info-box" v-if="resultImage">
          <div class="info-row">拟合度：{{ fitRate }}</div>
          <div class="info-row">xxx：{{ otherInfo1 }}</div>
          <div class="info-row">xxx：{{ otherInfo2 }}</div>
          <div class="info-row">xxx：{{ otherInfo1 }}</div>
          <div class="info-row">xxx：{{ otherInfo2 }}</div>
          <el-button type="success" @click="downloadResult" class="download-btn">下载结果图片</el-button>
        </div>
        <!-- 剩余区域：检测图片 -->
        <el-image :src="resultImage" fit="contain" class="result-img" v-if="resultImage" />
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <el-dialog v-model="historyDialogVisible" title="目标检测历史记录" width="600px">
      <el-table :data="historyList" @row-click="loadHistory">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="fitRate" label="拟合度" width="100" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button link @click="loadHistory(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 全局loading -->
    <div v-if="loading" class="loading-mask">
      <div class="loading-spinner">处理中...</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.yolo-page {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  box-sizing: border-box;
  padding: 10px;
}

// 蓝色技术栏
.tech-bar {
  background-color: #ffffff;
  border: 2px solid #409EFF;
  border-radius: 4px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .params {
    font-size: 14px;
    color: #666;
  }
}

// 内容区（左右两列）
.content-wrap {
  flex: 1;
  display: flex;
  gap: 10px;
}


// 左侧上传区
.upload-box {
  flex: 1;
  border: 2px solid #E6A23C;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .upload-tip {
    font-size: 16px;
    color: #999;
  }
}

.uploaded-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .image-info {
    font-size: 14px;
    color: #666;
  }
  // 新增：和右侧 result-info-box 样式完全一致的信息框
  .image-info-box {
    border: 2px solid #F56C6C;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 160px;
  }

  .preview-img {
    flex: 1;
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
  }

  .detect-btn {
    align-self: flex-end;
    margin-top: auto; /* 关键：把按钮固定在底部，和右侧下载按钮位置对齐 */
  }
}

.left-panel{
  flex: 1;
  background-color: #ffffff;
  border: 2px solid #67C23A;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;
}

// 右侧结果区
.right-panel {
  flex: 1;
  background-color: #ffffff;
  border: 2px solid #67C23A;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;

  .result-info-box {
    border: 2px solid #F56C6C;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    height: 160px;

    /* ======  Grid 核心代码  ====== */
    display: grid;
    /* 一行两列 */
    grid-template-columns: 1fr 1fr;
    /* 行列间距 */
    align-items: center;
  }

  .result-img {
    flex: 1;
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
  }
}

// 全局loading遮罩
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .loading-spinner {
    background-color: #fff;
    padding: 20px 40px;
    border-radius: 4px;
    font-size: 16px;
    color: #333;
    opacity: 0.8;
  }
}
</style>