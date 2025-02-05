<template>
  <div class="leftRoleBox">
    <!-- 左侧的聊天气泡尖角 -->
    <div v-if="type === 'text'" class="triangle-top-left">
      <div class="triangle-top-left2"></div>
    </div>
    <!-- 聊天气泡 -->
    <div @contextmenu.prevent="openMenu($event)" v-html="content"
      :class="type === 'text' ? 'bubble-left' : 'multimediaBox'">
    </div>
    <!--    <a-space>-->
    <!--    <a-button  size="mini" type="text">重新生成</a-button>-->
    <!--    <a-button size="mini">-->
    <!--      <template #icon>-->
    <!--        <icon-copy />-->
    <!--      </template>-->
    <!--    </a-button>-->
    <!--    </a-space>-->

    <div class="main">
      <div class="view-common view">
        <span class="tag"> <icon-sync />重新生成</span>
      </div>
      <div class="view-common view-1">
        <span class="copy"> <icon-copy /> 复制</span>
      </div>
    </div>
  </div>
  <div>




  </div>


</template>

<script>

import { IconSync, IconCopy } from '@arco-design/web-vue/es/icon';


export default {
  components: { IconSync, IconCopy },
  props: {
    type: String,
    content: String,
    avatarURL: String,
  },
  methods: {
    openMenu(e) {
      this.$emit("openMenu", e);
    },
    regenerateContent() {
      // 这里放置重新生成内容的逻辑
      // 例如，可以随机生成一些文本或更新 `content` 的值
      this.content = '这是重新生成后的内容。';
      // 或者调用其他函数来更新内容
    }
  },
};
</script>

<style scoped>
.avatar {
  width: 30px;
}

.triangle-top-left {
  position: relative;
  border-left: 4px solid transparent;
  margin-top: 20px;
  margin-left: 2px;
}

.triangle-top-left2 {
  top: -2px;
  left: 0px;
  position: absolute;
  border-top: 4px solid #ffffff;
  border-left: 4px solid transparent;
}

.bubble-left {
  text-align: justify;
  border-radius: 4px;
  padding: 10px;
  font-size: 10px;
  line-height: 16px;
  color: #000;
  margin-top: 5px;
  background-color: #ffffff;
}

.multimediaBox {
  padding: 5px;
}

.custom-space {
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

.regenerate-button-container {
  margin-top: 10px;
  /* 根据需要调整间距 */
  text-align: left;
  /* 根据布局需求调整对齐方式 */
}

.view-common {
  display: flex;
  justify-content: space-between;
  align-self: center;
  height: 20px;
}

.mod {
  display: flex;
  justify-content: flex-start;
  width: 360px;
  height: 373px;
  font-family: PingFang SC;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  padding: 12px 12px 15px;
  border: 1px solid;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.03999999910593033);
  border-radius: 8px;
  box-sizing: border-box;
}

.article {
  align-self: center;
  overflow: hidden;
  width: 336px;
  height: 308px;
  font-size: 14px;
  color: rgba(27, 36, 50, 1);
  text-align: left;
  white-space: break-spaces;
  text-overflow: ellipsis;
  webkit-line-clamp: 14;
  webkit-box-orient: vertical;
}

.main {
  border-radius: 4px;


  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-start;
  align-self: center;
  width: 100%;
}

.view {
  width: 68px;
}

.icon-sync {
  align-self: center;
  width: 16px;
  height: 16px;
}

.tag {
  align-self: center;
  margin-left: 10px;
  font-size: 10px;
  text-align: left;
  white-space: nowrap;
}

.view-1 {
  width: 44px;
  margin-left: 20px;
}

.icon-copy {
  align-self: center;
  width: 16px;
  height: 16px;
}

.copy {
  align-self: center;
  font-size: 10px;
  text-align: left;
  white-space: nowrap;
}
</style>
