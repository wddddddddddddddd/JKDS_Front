<template>
  <div class="layout-demo">
    <a-layout>
      <div class="layout-header">
        <div class="avatar-nav">
          <img class="generalrobot-icon" alt="" src="/logo_blue.png" @click="this.$router.push('/')">
          <b class="b">财报智析</b>
          <div class="input-container-headers">
            <input v-model="userInput" type="text" class="input-field" placeholder="请上传图片、文件或者输入想要了解的问题" />
            <div class="addafterParent">
              <div class="addafter">
                <icon-file-image :style="{ fontSize: '22px', color: 'black' }" @click="handleClick" />
                <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
                  <template #title>
                    上传文件
                  </template>
                  <div>
                    <a-upload :limit="1" draggable :custom-request="customRequest" />
                  </div>
                </a-modal>
              </div>
              <div class="addafter">
                <div class="icon-wrapper" @click="sendTextToFlask">
                  <icon-send :style="{ fontSize: '22px', color: 'black' }" />
                </div>
              </div>
            </div>
          </div>
          <div class="gen-yanbao">
            <div class="actions">
              <button @click="toggleBatchMode">
                {{ isBatchSelecting ? '取消批量选择' : '批量选择' }}
              </button>
              <button v-if="isBatchSelecting" @click="generateReport">生成研报</button>
            </div>
          </div>
          <a-space size="large">
            <a-avatar class="user-avatar">
              <img alt="avatar" src="/Avatar.png" />
            </a-avatar>
          </a-space>
        </div>
        <div class="content-headers">
          <div class="menu-demo" style="width: 100%; display: flex;">
            <a-menu mode="horizontal" :default-selected-keys="['1']" style="display: flex;">
              <a-menu-item v-for="(route, index) in routes" :key="index" :to="route.path">
                {{ route.label }}
              </a-menu-item>
            </a-menu>
          </div>
        </div>
      </div>
      <a-layout>
        <a-layout-content>
          <div class="card-container">
            <!-- 使用 v-for 循环渲染所有卡片，并设置逐个显示的延迟 -->
            <StatisticCard v-for="(card, index) in cardStore.cards" :key="index" :title="card.caption"
              :imgSrc="`http://127.0.0.1:5000/static/yanbao_crop_images/${card.save_figure_path}`"
              :tagList="card.tag_list" :style="{ animationDelay: `${index * 0.2}s` }"
              :isSelected="cardStore.selectedCards.includes(index)"
              @click="isBatchSelecting ? toggleSelection(index) : goToDetail(card)" />
          </div>
        </a-layout-content>
        <!--                <a-layout-sider :width="300" collapsed-width=0 hide-trigger collapsible :collapsed="collapsed"-->
        <!--                    class="chat-sidebar">-->
        <!--                    <AIParse :collapsed="collapsed" @collapsedChrild="collapsedFn" />-->
        <!--                </a-layout-sider>-->
        <div v-show="collapsed">
          <icon-double-left size="20" @click="onCollapse" style="margin-top: 20px " />

        </div>
        <div v-show="collapsed">
          <a-avatar :size="30" style="margin-top: 15px">
            <img alt="avatar" src="../assets/icons/AiBot.jpg" />
          </a-avatar>
        </div>

        <a-layout-sider v-show="!isSidebarHidden" collapsed-width=0 hide-trigger collapsible :collapsed="collapsed"
          :width="300" class="chat-sidebar" style="display: none;">
          <div class="assistant-header">
            <icon-double-right size="20" @click="onCollapse" style="margin-top: 5px " />
            <span style="margin-top: 10px ;margin-left: 5px">
              <a-avatar :size="30">
                <img alt="avatar" src="../assets/icons/AiBot.jpg" />
              </a-avatar>
            </span>
            <span style="margin-left: 3px">财讯小助手</span>
          </div>
          <!-- 聊天助手内容 -->
          <div class="chat-assistant">
            <div class="chatRecordBox">
              <div v-for="(item, index) in chatRecordList" :key="index">
                <RightRole v-if="item.role === '访客'" :type="item.type" :content="item.content"
                  :avatarURL="visitorAvatarURL" />
                <LeftRole v-if="item.role === '客服'" :type="item.type" :content="item.content"
                  :avatarURL="serviceAvatarURL" />
              </div>
              <a-space class="custom-space" direction="vertical">
                <a-button type="outline" size="mini" @click="sendMessage('医药行业股票价格国家？')">医药行业股票价格国家？</a-button>
                <a-button type="outline" size="mini" @click="sendMessage('将我的表格可视化')">将我的表格可视化</a-button>
                <a-button type="outline" size="mini" @click="sendMessage('生成研报摘要')">生成研报摘要</a-button>
              </a-space>



            </div>
            <!-- 输入框和发送按钮 -->
            <div class="input-container">
              <a-textarea :auto-size="{
                minRows: 3,
                maxRows: 5
              }" v-model="inputMessage" placeholder="请输入您的问题" class="message-input" :suffix-icon="shareIcon" />
              <div class="send-button-lsy">
                <a-button type="primary" class="send-button" @click="sendMessage(inputMessage)">
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
    <!--        <div v-if="collapsed" class="collapsedStyle" @click="showAi">-->
    <!--            <div v-show="collapsed">-->
    <!--                <icon-double-left size="20" @click="onCollapse" style="margin-top: 20px " />-->
    <!--            </div>-->
    <!--            <a-avatar :size="30" style="margin-top: 15px">-->
    <!--                <img alt="avatar" src="../assets/icons/AiBot.jpg" />-->
    <!--            </a-avatar>-->
    <!--        </div>-->
  </div>
</template>


<script>
import TopNavbar from '../components/TopNavbar.vue';
import StatisticCard from '../components/StatisticCard.vue';
import FooterCopyRight from '../components/FooterCopyRight.vue';
import AIParse from '../components/AIParse.vue';
import serviceAvatarURL from "../assets/icons/AiBot.jpg";
import visitorAvatarURL from "../assets/icons/Avatar.jpg"
import LeftRole from "../components/leftRole.vue";
import RightRole from "../components/rightRole.vue";
import { IconDoubleRight, IconDoubleLeft } from '@arco-design/web-vue/es/icon';
import {
  IconCaretRight,
  IconCaretLeft,
  IconShareInternal,
} from '@arco-design/web-vue/es/icon';
import { IconFileImage, IconFolderAdd, IconPlusCircle, IconSend } from '@arco-design/web-vue/es/icon';
import { h, ref } from "vue";
import axios from 'axios';
import { useCardsStore } from '@/store/cardsStore';
import { useRouter } from 'vue-router';
import IconWrapper from '../components/IconPicture.vue'

export default {
  name: 'FinancialDashBoard',
  components: {
    IconCaretRight,
    IconCaretLeft,
    IconShareInternal,
    IconDoubleRight,
    IconDoubleLeft,
    TopNavbar,
    StatisticCard,
    FooterCopyRight,
    AIParse,
    LeftRole,
    RightRole,
    serviceAvatarURL,
    visitorAvatarURL,
    IconWrapper,
    IconFileImage,
    IconFolderAdd,
    IconPlusCircle,
    IconSend,
    IconWrapper,
  },
  data() {
    return {
      //headers-data
      visible: false,
      file: null,
      userInput: '', // 用于绑定文本域的内容
      routes: [
        {
          path: '/FinancialDashBoard',
          label: '全部'
        },
        {
          path: '/',
          label: '信息科技'
        },
        {
          path: '/channel',
          label: '大消费',
        },
        {
          path: '/news',
          label: '生命健康'
        },
        {
          path: '/news',
          label: '传媒娱乐'
        },
        {
          path: '/news',
          label: '先进制造'
        },
        {
          path: '/news',
          label: '地产金融'
        },
        {
          path: '/news',
          label: '传统行业'
        },
        {
          path: '/news',
          label: '电子科技'
        },
        {
          path: '/news',
          label: '机械制造'
        },
        {
          path: '/news',
          label: '汽车制造'
        },
        {
          path: '/news',
          label: '传统能源'
        },
        {
          path: '/news',
          label: '新能源'
        },
        {
          path: '/news',
          label: '航天航空'
        },
        {
          path: '/news',
          label: '高端消费'
        },
      ],
      // end
      baseURL: 'http://127.0.0.1:5000', // Flask 服务地址
      messages: [], // 保存流式返回的数据
      eventSource: null, // SSE 实例
      socket: null, // WebSocket 实例
      imgPath: "E:/jike/test/test.jpg", // 本地图片路径
      inputMessage: "",
      chatRecordList: [{
        role: "访客",
        content: "你好",
        type: "text",
      }, {
        role: "客服",
        content: "这个图片是“2019-2023年中国各珠宝品类进出口数据统计”表，显示了黄金、钻石、银、铂、珍珠、宝石或半宝石、人工宝石等商品在2019至2023年的进出口总值（单位为亿美元）和同比变化。具体内容包括： 出口数据（左侧）： 每种商品的年出口总值，从2019年到2023年，以及2023年的同比变化。 比如，黄金的出口额从2019年的8.2亿美元增长到2023年的38.91亿美元，同比增长18.59%。 进口数据（右侧）： 每种商品的年进口总值，从2019年到2023年，以及2023年的同比变化。 比如，黄金的进口额从2019年的437.22亿美元增长到2023年的919.16亿美元，同比增长19.91%。",
        type: "text",
      }],
      serviceAvatarURL,
      visitorAvatarURL,
      cards: [],
      collapsed: true
    }
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
    const collapsed = ref(false);
    const shareIcon = h(IconShareInternal);
    const isSidebarHidden = ref(false);

    const onCollapse = () => {
      collapsed.value = !collapsed.value;
      isSidebarHidden.value = !isSidebarHidden.value; // 切换 sidebar 是否隐藏
    };
    const router = useRouter();

    // 批量选择处理逻辑
    const cardStore = useCardsStore(); // Pinia store
    const isBatchSelecting = ref(false); // 控制批量选择模式

    // 切换批量选择模式
    const toggleBatchMode = () => {
      isBatchSelecting.value = !isBatchSelecting.value;
      console.log(isBatchSelecting.value)
      if (!isBatchSelecting.value) {
        cardStore.clearSelection(); // 退出批量选择时清空选中状态
      }
    };

    // 切换选中状态
    const toggleSelection = (index) => {
      cardStore.toggleCardSelection(index);
    };

    // 跳转到详情页
    const goToDetail = (card) => {
      cardStore.setCurrentCard(card); // 设置当前选中的卡片
      // router.push({ name: '/ReportDetail' }); // 跳转到详情页
      router.push('/ReportDetail/TextAnalyzer');
    };

    // 生成研报
    const generateReport = () => {
      if (cardStore.selectedCards.length === 0) {
        alert('请选择至少一个卡片！');
        return;
      }
      router.push({ name: 'CardsSelected' });
    };
    return {
      collapsed,
      shareIcon,
      onCollapse,
      isSidebarHidden,
      // cards: cardsStore.cards,
      cardStore,
      isBatchSelecting,
      toggleBatchMode,
      toggleSelection,
      goToDetail,
      generateReport,
    };
  },
  // mounted() {
  //   // 页面加载时获取卡片数据
  //   this.fetchCards();
  // },
  methods: {
    // fetchCards() {
    //   axios
    //     .get('http://101.200.127.68:5000/get_cards') // 假设你的后端有这个 API
    //     .then((response) => {
    //       this.cards = response.data.cards; // 将卡片数据存入 cards 数组
    //       console.log('data html')
    //     })
    //     .catch((error) => {
    //       console.error('获取卡片数据失败:', error);
    //     });
    // },
    collapsedFn(value) {
      console.log(value, 'va');

      this.collapsed = value
    },
    showAi() {
      console.log(1111);
      this.collapsed = false
    },
    sendMessage(message) {
      console.log("Message sent:", message);
      this.visitorSend(message)
      this.inputMessage = "";
    },
    // 访客发送消息
    visitorSend(message) {
      let content = message;
      if (!content) {
        this.$message({
          message: "请输入发送内容！",
          type: "warning",
        });
        return;
      }
      this.chatRecordList.push({
        role: "访客",
        content: content,
        type: "text",
      });
      this.startWebSocket()
    },
    async startWebSocket() {
      const response = await fetch('http://101.200.127.68:8080/api/v1/AI-aides/imageParse', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img: this.imgPath,
        }),
      });

      if (!response.body) return;
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      this.chatRecordList.push({
        role: "客服",
        content: "",
        type: "text",
      });
      while (true) {
        let { value, done } = await reader.read();
        if (done) break;
        // 将流数据解析为字符串
        try {
          // 将字符串解析为 JSON 对象
          const parsedData = JSON.parse(value);
          console.log("received data -", parsedData);
          // 提取需要的内容
          const responseData = parsedData.payload?.choices?.text[0]?.content;
          // 更新 chatRecordList 中的最后一条记录
          const lastRecord = this.chatRecordList[this.chatRecordList.length - 1];
          if (lastRecord) {
            // 拼接返回的内容到 content
            lastRecord.content = (lastRecord.content || '') + (responseData?.replace('undefined', '') || '');
          }
        } catch (error) {
          console.error("Error parsing received data:", error);
        }
      }
    },
    // 客服发送消息
    serviceSend() {
      let content = this.$refs.serviceSendContentBox_Ref.innerHTML;
      if (!content) {
        this.$message({
          message: "请输入发送内容！",
          type: "warning",
        });
        return;
      }

      this.chatRecordList.push({
        role: "客服",
        content: content,
        type: "text",
      });

      // 发送后，清空发送框的内容
      this.$refs.serviceSendContentBox_Ref.innerHTML = "";
    }
  }
};
</script>


<style scoped>
@font-face {
  font-family: 'ShouhuFont';
  src: url('/360shouhuType-Bold.otf') format('opentype');
}

.layout-header {
  display: flex;
  flex-direction: column;
  justify-content: start;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
  height: 98px;
  background: url(/src/assets/icons/image_top.png) no-repeat center bottom;
  background-size: 100% 500%;
  /* 通过增大背景图的尺寸，截取底部 20% */
}

.generalrobot-icon {
  width: 35px;
  height: 35px;
  border-radius: 10cm;
  margin-right: 10px;
}

.avatar-nav {
  border-radius: 2.25px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.b {
  font-size: 30px;
  line-height: 13.5px;
  font-family: 'ShouhuFont', monospace !important;
  color: #fff;
}

.input-container-headers {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  width: 400px;
  margin-left: 40px;
  font-size: 12px;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
}

.button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.button img {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%);
  /* Makes SVG icons black */
}

.user-avatar {
  /* position: fixed !important; */
  position: absolute;
  right: 20px;
}


.content-headers {
  display: flex;
  width: 100%;
  position: relative;
  border-bottom: 1px solid #e5e6eb;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  text-align: left;
  font-size: 16px;
  color: #4e5969;
  font-family: 'PingFang SC';
}

.menu-demo {
  width: 100%;
  display: flex;
}

.addafterParent {
  /* position: absolute; */
  display: flex;
}


.addafter {
  width: 22px;
  position: relative;
  height: 22px;
}

.addafter:first-child {
  margin-left: 8px;
}

.addafter:last-child {
  margin-left: 8px;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 可根据需求调整 */
  border-radius: 25%;
  /* 圆形背景 */
  transition: background-color 0.3s;
  /* 平滑过渡效果 */
}

.icon-wrapper:hover,
.icon-wrapper:focus,
.addafter:hover,
.addafter:focus {
  background-color: skyblue;
  /* 设置天蓝色背景 */
  cursor: pointer;
  /* 鼠标悬停效果 */
}

/* 点击效果：微微缩小 */
.icon-wrapper:active {
  transform: scale(0.95);
  /* 点击时缩小 */
  background-color: #a0c4ff;
  /* 点击时的背景色 */
}

/* 批量选择 */
.actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.actions button {
  margin-right: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1e90ff;
  color: white;
  cursor: pointer;
}

.collapsedStyle {
  position: fixed;
  top: 100px;
  right: 10px;
  z-index: 999;
  display: flex;
}

.layout-demo :deep(.arco-layout-sider-children),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  text-align: center;
  font-stretch: condensed;
  flex-direction: column;
  justify-content: flex-start;
  overflow: unset;
  height: 100%;
  overflow: hidden;
}

.layout-demo :deep(.arco-layout-content) {
  overflow: unset;
  margin: 16px;
}

/* .layout-demo :deep(.arco-layout-footer) {
  flex: 1;
} */

.chat-sidebar {
  background: url("../assets/icons/background2.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin-top: 20px;
}

.arco-layout-content:deep(.arco-menu-overflow-wrap) {
  display: flex !important;
}

.card-container {
  /* margin-top: 20px; */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

.statistic-card {
  opacity: 0;
  animation: fadeIn 0.7s ease-in-out forwards;
  border: #4e5969;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
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

.message-input {}

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

.custom-space {
  background-color: #FFFFFF;
  padding: 10px;
  display: flex;
  flex-direction: column;
  /* 垂直排列 */
  align-items: flex-start;
  /* 左对齐 */
  justify-content: flex-end;
  /* 底部对齐 */
  /*height: 100%; !* 确保容器有高度，以便 justify-content 生效 *!*/
  /*padding: 0; !* 移除可能的默认内边距 *!*/
  /*margin: 0; !* 移除可能的默认外边距 *!*/
}

.send-button-lsy {
  height: 90px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 20px;
  align-self: stretch;
}

/* .layout-demo :deep(.arco-layout-sider-light) {
    width: 500px !important;
} */

.arco-layout-footer {
  background-color: #f8f8f8;
}
</style>
