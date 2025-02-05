<template>
  <div class="layout-demo">
    <a-layout>
      <DetailTopNavbar />
      <a-layout>
        <a-layout-content>
          <div class="container">
            <div class="container-title">
              <h1>{{ currentCard.caption }}</h1>
            </div>
            <div class="container-image">
              <!-- <img src="/image.png" alt=""> -->
              <!-- <img :src="currentCard.save_figure_path" alt="Image" class="download-image" /> -->
              <img :src="`${baseURL}/static/yanbao_crop_images/${currentCard.save_figure_path}`" :alt="image"
                ref="chartImage" />
              <div class="img-icons">
                <icon-download font-size=36 @click="downloadImage(currentCard.save_figure_path)" />
                <icon-location font-size=36 @click="this.$router.push('/PdfPreview')" />
              </div>
            </div>
            <div class="container-keywords">
              <div class="keyword-header" style="margin-top:16px">
                关键词
              </div>
              <div class="words">
                <span v-for="(tag, index) in currentCard.tag_list" :key="index" class="word">
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="directory" style="margin-top:16px; margin-bottom: 16px;">
              <div class="menu-item" :class="{ active: activeTab === 'aiChart' }" @click="navigateToAI('aiChart')">
                AI图表解析
                <div v-if="activeTab === 'aiChart'" class="underline"></div>
              </div>
              <div class="menu-item" :class="{ active: activeTab === 'chartConvert' }"
                @click="navigateToChart('chartConvert')">
                图表转换
                <div v-if="activeTab === 'chartConvert'" class="underline"></div>
              </div>
            </div>
            <router-view></router-view>
          </div>
        </a-layout-content>
        <div v-show="collapsed">
          <icon-double-left size="20" @click="onCollapse" style="margin-top: 20px " />
        </div>
        <div v-show="collapsed">
          <a-avatar :size="30" style="margin-top: 15px">
            <img alt="avatar" src="../assets/icons/AiBot.jpg" />
          </a-avatar>
        </div>
        <a-layout-sider v-show="isSidebarHidden" collapsed-width=0 hide-trigger collapsible :collapsed="collapsed"
          :width="300" class="chat-sidebar">
          <div class="assistant-header">
            <icon-double-right size="20" @click="onCollapse" style="margin-top: 5px " />
            <span style="margin-top: 10px ;margin-left: 5px">
              <a-avatar :size="30">
                <img alt="avatar" src="../assets/icons/AiBot.jpg" />
              </a-avatar>
            </span>
            <span class="chat-sider-title-ds" style="margin-left: 3px">财讯小助手</span>
          </div>
          <!-- 聊天助手内容 -->
          <div class="chat-assistant">
            <div class="chatRecordBox">
              <div v-for="(message, index) in messages" :key="index" :class="['chat-message', message.role]">
                <div class="avatar-container">
                  <img :src="message.role === 'user' ? userAvatar : aiAvatar" alt="avatar" class="avatar-user" />
                </div>
                <div class="message-container"
                  :class="{ 'ai': message.role === 'assistant', 'user': message.role === 'user' }">
                  <span class="message-content">{{ message.content }}</span>
                  <!-- 复制按钮 -->
                  <div v-if="message.role === 'assistant' && message.completed" class="copy-btn-ai"
                    @click="copyToClipboard(message.content)">
                    <icon-copy /> 复制
                  </div>
                </div>
              </div>
            </div>
            <!-- 输入框和发送按钮 -->
            <div class="input-container">
              <a-textarea :auto-size="{ minRows: 3, maxRows: 5 }" v-model="userInput" placeholder="请输入您的问题"
                class="message-input" @keyup.enter="sendMessage" />
              <div class="send-button-lsy">
                <a-button type="primary" class="send-button" @click="sendMessage">
                  发送
                </a-button>
              </div>
            </div>
          </div>
        </a-layout-sider>
      </a-layout>
      <a-layout-footer>
        <div class="footer-wrapper">
          <FooterCopyRight />
        </div>
      </a-layout-footer>
    </a-layout>

  </div>
</template>


<script>
import DetailTopNavbar from '../components/DetailTopNavbar.vue';
import StatisticCard from '@/components/StatisticCard.vue';
import FooterCopyRight from '@/components/FooterCopyRight.vue';
import AIParse from '../components/AIParse.vue';
import { IconDoubleRight, IconDoubleLeft } from '@arco-design/web-vue/es/icon';
import Typewriter from '../components/Typewriter.vue';
import serviceAvatarURL from "../assets/icons/AiBot.jpg";
import visitorAvatarURL from "../assets/icons/Avatar.jpg"
import LeftRole from "../components/leftRole.vue";
import RightRole from "../components/rightRole.vue";
import {
  IconCaretRight,
  IconCaretLeft,
  IconShareInternal,
  IconDownload,
  IconLocation,
  IconCopy,
  IconSync
} from '@arco-design/web-vue/es/icon';
import { h, ref } from "vue";
import { useCardsStore } from '@/store/cardsStore';

export default {
  name: 'FinancialDashBoard',
  components: {
    IconCaretRight,
    IconCaretLeft,
    IconShareInternal,
    IconDoubleRight,
    IconDoubleLeft,
    DetailTopNavbar,
    StatisticCard,
    FooterCopyRight,
    IconDownload,
    IconLocation,
    AIParse,
    IconCopy,
    IconSync,
    Typewriter,
    LeftRole,
    RightRole,
    serviceAvatarURL,
    visitorAvatarURL
  },
  data() {
    const cardsStore = useCardsStore();
    return {
      userInput: '', // 用户输入
      messages: [
        {
          role: 'assistant',
          content: '您好我是您专属的财讯小助手，您可以向我提问关于这张图片的相关内容',
          completed: true, // 表示此条消息已经完成
        },
      ],
      userAvatar: '/Avatar.png', // 用户头像地址
      aiAvatar: '/AiBot.jpg', // AI 头像地址
      inputMessage: "",
      baseURL: 'http://127.0.0.1:5000', // Flask 服务地址
      currentCard: cardsStore.currentCard || {},
      serviceAvatarURL,
      visitorAvatarURL,
      activeTab: 'aiChart', // 默认选中 'AI图表解析'
      save_figure_path: '', // 这里替换为你的图片URL

    };
  },
  computed: {
    // 解码路径，确保显示正确的图片地址
    decodedFigurePath() {
      return decodeURIComponent(this.currentCard.save_figure_path || "");
    },
  },
  watch: {
    quickMenuVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    collapsed: {
      handler(value) {
        console.log('watch', value);
      },
      immediate: true
    }
  },
  setup() {
    const collapsed = ref(true);
    const inputMessage = ref("");
    const shareIcon = h(IconShareInternal);
    const isSidebarHidden = ref(false);
    const onCollapse = () => {
      collapsed.value = !collapsed.value;
      isSidebarHidden.value = !isSidebarHidden.value; // 切换 sidebar 是否隐藏
    };

    return {
      collapsed,
      inputMessage,
      shareIcon,
      onCollapse,
      // sendMessage,
      isSidebarHidden,
      // currentCard: cardsStore.currentCard,
    };
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() === '') {
        alert('Please enter a message.');
        return;
      }

      // 添加用户消息到聊天记录
      this.messages.push({ role: 'user', content: this.userInput });

      // 初始化一条 AI 消息
      const aiMessage = { role: 'assistant', content: '', completed: false };
      this.messages.push(aiMessage);
      const requestData = { messages: this.messages, imagePath: this.currentCard.save_figure_path };

      try {
        const response = await fetch('http://127.0.0.1:5000/stream_chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.body) {
          throw new Error('ReadableStream not supported!');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let done = false;
        let partialData = '';
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          partialData += decoder.decode(value, { stream: true });

          let lines = partialData.split('\n');
          partialData = lines.pop(); // 保留未完成的行

          for (const line of lines) {
            if (line.trim()) {
              const parsed = JSON.parse(line);

              // 更新最后一条 AI 消息的内容
              aiMessage.content += parsed.content;

              // 确保每次都更新 UI
              this.$forceUpdate();
            }
          }
        }

        // 标记流式输出完成
        aiMessage.completed = true;
        this.$forceUpdate();

      } catch (error) {
        console.error('Error receiving data:', error);
      }

      this.userInput = ''; // 清空输入框
    },
    copyToClipboard(content) {
      navigator.clipboard.writeText(content).then(
        () => alert('Copied to clipboard!'),
        () => alert('Failed to copy.')
      );
    },

    downloadImage(imagePath) {
      const link = document.createElement('a');
      console.log(imagePath);
      // 拼接完整路径并对路径进行 URL 编码
      link.href = `${this.baseURL}/images/${encodeURIComponent(imagePath)}`;
      link.download = imagePath.split('/').pop(); // 提取文件名作为下载名称
      link.click();
    },
    navigateToAI(tab) {
      this.activeTab = tab;
      this.$router.push({ name: 'TextAnalyzer' });  // 跳转到AI解析页面
    },
    navigateToChart(tab) {
      this.activeTab = tab;
      this.$router.push({ name: 'ChartConverter' });  // 跳转到图表转换页面
    },
    collapsedFn(value) {
      console.log(value, 'va');

      this.collapsed = value
    },
    showAi() {
      console.log(1111);
      this.collapsed = false
    },
  }
};
</script>


<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  /* 隐藏水平滚动条 */
  width: 100%;
  /* 确保内容不超出页面宽度 */
}

.layout-demo {
  /* height: 1080px !important; */
  width: 100%;
}

.collapsedStyle {
  position: fixed;
  top: 100px;
  right: 10px;
  z-index: 999;
  display: flex;
}

.layout-demo :deep(.arco-layout-content) {
  width: 100%;
  /* height: 1080px; */
  display: flex;
  text-align: center;
  font-stretch: condensed;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
}

.layout-demo :deep(.arco-layout-content) {
  background-color: #f8f8f8;
}


.chat-sidebar {
  background: url("../assets/icons/background2.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0px;
}

.arco-layout-content:deep(.arco-menu-overflow-wrap) {
  display: flex !important;
}

/* .layout-demo :deep(.arco-layout-sider-light) {
  width: 500px !important;
} */
.container {
  padding: 16px;
  display: flex;
  width: 824px;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  flex-wrap: wrap;
}

.container-image {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  /* 水平居中图片和图标 */
}

.container-image img {
  height: 549px;
  width: auto;
  max-width: 1024px;
  margin-right: 16px;
}

.img-icons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  border-radius: 16px;
  background: var(--bg-3, #FFF);
  margin-top: 416px;
  width: 36px;
  padding: 14px;

}

.container-keywords {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  /* 水平居中关键词 */
  width: 100%;
  margin-right: 43px;
  align-items: flex-start;
}

.keyword-header {
  color: #4E5969;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.words {
  display: flex;
  justify-content: center;
  /* 水平居中关键词 */
}

.word {
  color: #3491FA;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  border-radius: 4px;
  border: 1px solid var(--Light-blue-blue-6, #3491FA);
  display: flex;
  padding: 5px 8px;
  align-items: center;
  margin-right: 8px;
}

.directory {
  display: flex;
  justify-content: flex-start;
  gap: 40px;
  /* 两个选项之间的间距 */
  font-family: Arial, sans-serif;
  font-size: 18px;
  width: 100%;
  background-color: #f8f8f8;
}

.menu-item {
  position: relative;
  padding: 8px 16px;
  cursor: pointer;
  color: #000;
  font-weight: 500;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: #3491FA;
  /* 悬停时字体颜色变蓝 */
}

.menu-item.active {
  color: #3491FA;
  /* 选中时字体颜色为蓝色 */
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #3491FA;
  /* 蓝色横杠 */
  border-radius: 2px;
}

.layout-demo {
  height: 100%;

  background: #f0f2f5;
}

.chat-sidebar {
  background: url("../assets/icons/background2.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0px;
}

.chat-sider-title-ds {
  color: var(---Main-Text, #1B2532);

  /* 16/CN-Medium */
  font-family: "PingFang SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  /* 150% */
}

.assistant-header {
  padding: 10px;
  font-size: 16px;
  font-family: PingFang SC;
  color: rgb(27, 37, 50);
  text-align: left;
  margin-bottom: 20px;
}

.assistant-message {
  padding: 10px;
  background-color: #f6f9fc;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;

}

/* .message-input {} */

.parent-container {
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
}

.input-container {
  position: absolute;
  /* 使用绝对定位 */
  bottom: 20px;
  /* 根据需要调整距离底部的距离 */
  left: 20px;
  /* 根据需要调整距离左侧的距离，或使用right属性 */
  right: 20px;
  /* 如果希望右侧也有一定距离，可以同时设置left和right，并适当调整宽度或使用flex布局 */
  display: flex;
  align-items: center;
  /* 垂直方向上居中对齐 */
  padding: 10px;
  border-radius: 10px;
  background: #fff;
  /* 如果希望input-container具有固定宽度，可以添加width属性 */
  /* 如果希望子元素水平方向上分布更均匀，可以移除left和right，并添加justify-content属性 */
}

.container-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.message-input {
  width: 100%;
  margin-top: 10px;

  flex: 1;
  margin-right: 10px;
  border: none;
  outline: none;
  background: #fff;
}

.message-input:hover {
  border-color: #ff6347;
  /* 改变边框颜色 */
  background-color: #f0f0f0;
  /* 改变背景色 */
}

.send-button {

  width: 60px;
  border-radius: 19px;
  background: var(--1, linear-gradient(152deg, #85E9FF -13.81%, #3190FF 34.67%, #7D4FFF 139.35%));
  color: #fff;
}

.chatRecordBox {
  padding: 10px;
  height: 100%;
  border-radius: 10px;
  overflow: auto;
}

.send-button-lsy {
  height: 90px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 20px;
  align-self: stretch;
}

.arco-layout-footer {
  background-color: #f8f8f8;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar-user {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.message-container {
  max-width: 70%;
  margin: 0 10px;
  padding: 10px;
  border-radius: 10px;
  position: relative;
}

.message-container.user {
  background-color: #d0ebff;
  color: #004085;
}

.message-container.ai {
  background-color: #ffffff;
  color: #333;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.message-content {
  color: var(---Main-Text, #1B2532);
  /* 14/CN-Regular */
  font-family: "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  float: left;
  /* 157.143% */

}


.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

.input-area {
  display: flex;
  justify-content: center;
}

input {
  padding: 10px;
  width: 300px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.layout-demo :deep(.arco-layout-sider-light) {
  width: 480px !important;
}

.copy-btn-ai {
  margin-top: 16px;
  border-top: #4E5969 1px;
  display: flex;
  padding: 6px 1px;
  align-items: center;
  gap: 6px;
  border-top: 2px solid rgb(235, 240, 245);
}
</style>