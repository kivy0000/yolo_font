<script setup lang="ts">

// ai start
import {SuspendedBallChat} from 'ai-suspended-ball-chat'
import {ref} from "vue";
import request from "./request/ajax.ts";

const aiChat = ref()
// const apiUrl = ref('/api/chat/api/unified')
// const apiUrl = ref('/api/chat/api/unified/stream') //流式调用，暂无返回值
const apiUrl = ref('/api/chat/ai/sendMsg') //deepseek
const appName = ref('')
const domainName = ref('')


const welcomeConfig = {
  avatar: '/src/assets/images/ai.png', //欢迎页面头像
  title: '欢迎使用AI小助手',
  description: '我是您的智能助手，有什么可以帮助您的吗？',
}

const assistantConfig = {
  avatar: '/src/assets/images/ai.png', //对话头像
  name: '智能助手',
  description: '您的专属AI助手'
}


const customRequestConfig = ref({
  headers: {
    'Content-Type': 'application/json',
  },
  customParams: {
    systemPrompt: '你是一个指挥场站管理系统的的AI助手',
    question: ''
  },
  requestParamProcessor: (baseParams, customParams) => {
    return {
      ...baseParams,
      ...customParams,
    }
  },
  timeout: 1200000,
  retryCount: 3,
  retryDelay: 1000
})


// 原生ai请求拦截器（底层Fetch拦截）,因为没有相关的动态字段处理方法
// 作用：拦截 apiUrl，自动设置 question = query
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [url, options = {}] = args;

  // 1. 只拦截AI聊天接口请求
  if (typeof url === 'string' && url.includes(apiUrl.value)) {
    try {
      // 2. 解析原始请求体数据
      let requestBody = {};
      if (options.body) {
        requestBody = JSON.parse(options.body);
      }

      // 3.  核心需求：question = query（原生强制修改）
      if (requestBody.query) {
        requestBody.question = requestBody.query;
      }

      // 4. 重新赋值修改后的请求体
      options.body = JSON.stringify(requestBody);
      console.log(' 原生拦截组件的聊天请求成功！修改后请求体：', requestBody);
    } catch (err) {
      console.error('原生请求拦截处理失败,未能成功发送用户问题：', err);
    }
  }

  // 5. 继续发送原始请求（不破坏任何逻辑）
  return originalFetch(url, options);
};


const callbacks = {

  // 用户发送消息时触发
  onUserMessage: (message) => {
  },

  // AI回复时触发
  onAssistantMessage: (message, res) => {
    console.log('AI回复:', message, res)
  },
  //
  // // 图片选择回调（用户选择图片后触发）
  // onImageSelect: (imageData) => {
  //   console.log('图片选择:', imageData)
  // },
  //
  // // 图片移除回调（用户移除已选择图片后触发）
  // onImageRemove: () => {
  //   console.log('图片移除')
  // },
  //
  // 流式响应时触发
  onStreamData: (data) => {
    console.log('流式数据回调函数:', data)
  },

  // 流式(或普通请求)响应结束时触发
  onRequestEnd: (response) => {
    console.log('请求结束:', response)
  },
  //
  // // 发生错误时触发
  // onError: (error) => {
  //   console.error('错误:', error)
  // },
  //
  // // 历史会话已清除时候触发
  // onClearHistory: () => {
  //   console.log('历史会话已清除')
  // },
  //
  // // 预制任务点击时候触发
  // onPresetTaskClick: (task) => {
  //   console.log('预制任务点击:', task)
  // },
  //
  // // 点击AI助理消息"插入含义"按钮时触发
  // clickAssistantMsgCallback: (message, index, messageObj) => {
  //   console.log('插入内容:', { message, index, messageObj })
  //   // 这里可以将消息内容插入到用户的编辑器或其他地方
  //   console.log(`准备插入内容: ${message.substring(0, 100)}...`)
  //   // 去掉思考过程和布局调用提示的内容
  //   let filterContent = message.replace(/<details[\s\S]*?<\/details>/g, '').replace(/<div\s+data-tool[\s\S]*?<\/div>/g, '');
  //   console.log(`准备插入内容(过滤版本): ${filterContent.substring(0, 100)}...`)
  // },

}

const clearHistory = () => {
  aiChat.value.clearHistory()
}


// ai end
</script>

<template>
  <div class="appClass">
    <Router-view></Router-view>
  </div>
    <SuspendedBallChat
        ref="aiChat"
        :url="apiUrl"
        title="AI小助手"
        custom-icon-url="/src/assets/images/ai.png"
        :app-name="appName"
        :domain-name="domainName"
        :enable-streaming="false"
        :enable-context="true"
        :enable-voice-input="false"
        :assistant-config="assistantConfig"
        :welcome-config="welcomeConfig"
        :custom-request-config="customRequestConfig"
        :show-clear-button="true"
        :callbacks="callbacks"
        :enable-local-storage="false"
        size="small"
        location="right-center"
    />
</template>

<style scoped>

.appClass {
  width: 100vw;
  height: 100vh;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:deep(.assistant-toolbar .retry-btn),
:deep(.assistant-toolbar .speak-btn),
:deep(.assistant-toolbar .download-btn) {
  display: none !important;
}

:deep(.chat-bubble .chat-dots) {
  display: none !important;
}
/*右下角小图标*/
:deep(.chat-bubble) {
  top: 20%;
  background: linear-gradient(135deg, #667eea, #409eff) !important;
}

/*对话AI头像*/
:deep(.chat-panel-container .avatar.assistant-avatar) {
  background: linear-gradient(135deg, #409eff, #0056b3) !important;
}

/*对话用户头像*/
:deep(.chat-panel-container .avatar.user-avatar) {
  background: linear-gradient(135deg, #ffffff, #ffffff) !important;
  color: black !important;
  border: 1px solid rgba(0,0,0,0.08) !important;        /* 细边框 */
  /* box-shadow: 0 4px 12px rgba(0,0,0,0.10);     外部阴影 */
}

</style>
