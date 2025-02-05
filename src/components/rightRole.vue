<template>
  <div class="rightRoleBox">

    <!-- 左侧的聊天气泡尖角 -->
    <div v-if="type === 'text'" class="triangle-top-right">
      <div class="triangle-top-right2"></div>
    </div>
    <!-- 聊天气泡 -->
    <div @contextmenu.prevent="openMenu($event)" v-html="content"
      :class="type === 'text' ? 'bubble-right' : 'multimediaBox'"></div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    content: String,
    avatarURL: String,
  },
  methods: {
    openMenu(e) {
      this.$emit("openMenu", e);
    },
  },
};
</script>

<style scoped>
.rightRoleBox {
  display: flex;
  align-items: flex-start;
  flex-direction: row-reverse;
}

.avatar {
  width: 30px;
}

.triangle-top-right2 {
  top: -2px;
  right: 0px;
  position: absolute;
  border-top: 4px solid #ffffff;
  border-right: 4px solid transparent;
}

.bubble-right {
  text-align: justify;
  border-radius: 4px;
  padding: 10px;
  font-size: 10px;
  color: #ffffff;
  line-height: 16px;
  margin-top: 5px;
  background-color: rgb(64, 128, 255);
}

.multimediaBox {
  padding: 10px;
}
</style>
