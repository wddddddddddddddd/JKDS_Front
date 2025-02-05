<template>
  <a-layout class="layout-demo">
    <a-layout-content :width="0"></a-layout-content>
    <div v-show="collapsed">
      <icon-double-left size="20" @click="onCollapse" style="margin-top: 20px " />

    </div>
    <div v-show="collapsed">
      <a-avatar :size="30" style="margin-top: 15px">
        <img alt="avatar" src="../assets/icons/AiBot.jpg" />
      </a-avatar>
    </div>
    <a-layout-sider collapsed-width=0 hide-trigger collapsible :collapsed="collapsed" :width="300" class="chat-sidebar">
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
</template>

<script>
import { defineComponent, ref, h } from 'vue';
import serviceAvatarURL from "../assets/icons/AiBot.jpg";
import visitorAvatarURL from "../assets/icons/Avatar.jpg"
import LeftRole from "../components/leftRole.vue";
import RightRole from "../components/rightRole.vue";
import { IconDoubleRight, IconDoubleLeft } from '@arco-design/web-vue/es/icon';
import {
  IconCaretRight,
  IconCaretLeft,
  IconShareInternal
} from '@arco-design/web-vue/es/icon';

export default defineComponent({
  components: {
    IconCaretRight,
    IconCaretLeft,
    IconShareInternal,
    IconDoubleRight,
    IconDoubleLeft,
    LeftRole,
    RightRole
  },
  watch: {
    quickMenuVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  setup() {
    const collapsed = ref(false);
    const inputMessage = ref("");
    const shareIcon = h(IconShareInternal);
    const onCollapse = () => {
      collapsed.value = !collapsed.value;
    };

    const sendMessage = (message) => {
      console.log("Message sent:", message);
      inputMessage.value = "";
    };

    return {
      collapsed,
      inputMessage,
      shareIcon,
      onCollapse,
      sendMessage,
    };
  },
  data() {
    return {
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
      visitorAvatarURL
    }
  },
  methods: {
    // 访客发送消息
    visitorSend() {
      let content = this.$refs.visitorSendContentBox_Ref.innerHTML;
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

      // 发送后，清空发送框的内容
      this.$refs.visitorSendContentBox_Ref.innerHTML = "";
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
});
</script>

<style scoped>
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
</style>
