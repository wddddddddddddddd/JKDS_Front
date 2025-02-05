<template>
  <div class="layout-demo">
    <div class="layout-header">
      <div class="avatar-nav">
        <img class="generalrobot-icon" alt="" src="/logo_blue.png" @click="this.$router.push('/')">
        <b class="b-title">财报智析</b>
        <div class="input-container">
          <input v-model="userInput" type="text" class="input-field" placeholder="请上传图片、文件或者输入想要了解的问题" />
          <div class="addafterParent">
            <div class="addafter">
              <icon-file-image :style="{ fontSize: '22px' }" @click="handleClick" />
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
                <icon-send :style="{ fontSize: '22px' }" />
              </div>
            </div>
          </div>
        </div>
        <a-space size="large">
          <a-avatar class="user-avatar-nav">
            <img alt="avatar" src="/Avatar.png" />
          </a-avatar>
        </a-space>
      </div>
      <div class="sub-headers" style="background-color: white;">
        <a-space direction="vertical">
          <a-breadcrumb style="display: flex;height: 16px;padding: 16px;">
            <a-breadcrumb-item>
              <icon-home @click="this.$router.push('/FinancialDashBoard')" />
              搜索结果
            </a-breadcrumb-item>
            <a-breadcrumb-item>生成研报</a-breadcrumb-item>
          </a-breadcrumb>
        </a-space>
      </div>
    </div>
    <div class="layout-content" style="align-items: center;">
      <div class="steps" style="width: 600px;">
        <a-steps :current="1">
          <a-step description="选择用于生成的图表">选择图表</a-step>
          <a-step description="创建成功">查看生成结果</a-step>
        </a-steps>
      </div>
      <div class="report-title-input">
        <p style="color: red;">*</p>
        <p>研报标题</p>
        <a-space>
          <a-input :style="{ width: '320px' }" placeholder="输入汉字、字母或数字，最多20字符 " allow-clear />
        </a-space>
      </div>
      <div class="card-container">
        <StatisticCard v-for="(card, index) in selectedCards" :key="index" :title="card.caption"
          :imgSrc="`http://127.0.0.1:5000/static/yanbao_crop_images/${card.save_figure_path}`" :tagList="card.tag_list"
          :style="{ animationDelay: `${index * 0.2}s` }" />
      </div>
      <div class="btn-list" style="margin-top: 30px;">
        <a-space>
          <a-button @click="goToFinancialDashboard">重新选择</a-button>
          <a-button type="primary" @click="goToReportResult">下一步</a-button>
        </a-space>
      </div>
    </div>

  </div>
</template>

<script>
import { useCardsStore } from '@/store/cardsStore';
import { computed } from 'vue';
import StatisticCard from '../components/StatisticCard.vue';
import { IconHome, IconDoubleLeft } from '@arco-design/web-vue/es/icon';
import IconWrapper from '../components/IconPicture.vue'
import { IconFileImage, IconFolderAdd, IconPlusCircle, IconSend } from '@arco-design/web-vue/es/icon';
import axios from 'axios';
import DetailTopNavbar from '../components/DetailTopNavbar.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CardsSelected',
  components: {
    StatisticCard,
    DetailTopNavbar,
    IconHome,
    IconDoubleLeft,
    IconWrapper,
    IconFileImage,
    IconFolderAdd,
    IconPlusCircle,
    IconSend,
    axios
  },
  setup() {
    const cardStore = useCardsStore();

    console.log(cardStore.selectedCards); // 确认数据
    console.log(cardStore.cards); // 确认数据

    // 使用 computed 保持响应式
    const selectedCards = computed(() =>
      cardStore.selectedCards.map(index => cardStore.cards[index])
    );

    const router = useRouter();
    const goToReportResult = () => {
      router.push({ name: 'ReportResult' });
    };
    const goToFinancialDashboard = () => {
      cardStore.clearSelection(); // 退出批量选择时清空选中状态
      router.push({ name: 'FinancialDashBoard' })
    }
    return { selectedCards, goToReportResult, goToFinancialDashboard };
  },
};
</script>

<style scoped>
.report-title-input {
  display: flex;
  margin-top: 32px;
}

.layout-content {
  display: flex;
  flex-direction: column;
}

.steps {
  align-self: center;
}

.card-container {
  /* margin-top: 20px; */
  width: 80%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
  margin-top: 32px;
}

/* .statistic-card {
  opacity: 0;
  animation: fadeIn 0.7s ease-in-out forwards;
  border: #4e5969;
} */

.sub-headers {
  display: flex;
  width: 100%;
}

/* header styles */
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
  height: 100%;
  /* background-image: linear-gradient(to right, #00e2f2, #00d7f4, #00cbf4, #00bff3, #00b3ef, #00afed, #00abeb, #00a7e9, #00abea, #00aeea, #00b2eb, #00b5eb); */
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.b-title {
  font-size: 30px;
  line-height: 13.5px;
  font-family: 'ShouhuFont', monospace !important;
  color: #fff;
}

.input-container {
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

.user-avatar-nav {
  position: absolute;
  right: 20px;
}

/* .arco-space-item {
    display: flex;
    width: 100%;

} */
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
</style>