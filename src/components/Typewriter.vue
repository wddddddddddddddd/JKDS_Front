<template>
  <div class="chat">
    <span class="typewriter">
      {{ displayedText }}
      <span v-if="showCursor" class="cursor">|</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Typewriter',
  props: {
    text: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      default: 10 // 控制字符显示速度，单位是毫秒
    }
  },
  data() {
    return {
      displayedText: '', // 用于显示逐渐添加的文字
      index: 0, // 当前显示的字符位置
      currentSpeed: this.speed, // 当前的打字速度
      quickSpeed: 50, // 快速打字速度
      pauseDuration: 500, // 暂停的时间（毫秒）
      randomPauseAfter: this.getRandomPauseInterval(), // 随机的暂停间隔
      showCursor: true, // 控制光标闪烁
      cursorInterval: null // 用于保存光标闪烁的定时器 ID
    };
  },
  mounted() {
    this.startTyping();
    this.blinkCursor(); // 启动光标闪烁效果
  },
  methods: {
    startTyping() {
      this.typingInterval = setInterval(() => {
        if (this.index < this.text.length) {
          this.displayedText += this.text[this.index];
          this.index++;

          // 达到随机字符数后，暂停一会儿再继续
          if (this.index % this.randomPauseAfter === 0) {
            clearInterval(this.typingInterval);
            setTimeout(() => {
              this.currentSpeed = this.quickSpeed; // 设置较快的速度
              this.randomPauseAfter = this.getRandomPauseInterval(); // 生成新的随机间隔
              this.startTyping(); // 继续打字效果
            }, this.pauseDuration);
          }
        } else {
          clearInterval(this.typingInterval); // 完成打字效果后清除计时器
          clearInterval(this.cursorInterval); // 完成打字后清除光标闪烁计时器
          this.showCursor = false; // 隐藏光标
        }
      }, this.currentSpeed);
    },
    getRandomPauseInterval() {
      // 设置随机间隔，例如在5到15之间
      return Math.floor(Math.random() * 11) + 5;
    },
    blinkCursor() {
      this.cursorInterval = setInterval(() => {
        this.showCursor = !this.showCursor; // 切换光标显示状态，形成闪烁效果
      }, 500); // 控制光标闪烁速度
    }
  },
  beforeDestroy() {
    clearInterval(this.typingInterval); // 确保组件销毁时停止打字计时器
    clearInterval(this.cursorInterval); // 确保组件销毁时停止光标闪烁计时器
  }
};
</script>


<!-- V1.0 360守护字体 从中间开始打字的 -->
<!-- <style scoped>
@font-face {
  font-family: 'ShouhuFont';
  src: url('/360shouhuType-Bold.otf') format('opentype');
}

.chat {
  /* max-width: 400px; */
  /* 控制文字显示的最大宽度 */
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  /* margin: 0 auto; */
  font-size: 1.2em;
  line-height: 1.5;
}

.typewriter {
  /* font-family: 'ShouhuFont', monospace;
  font-weight: bold;
  display: inline-block; */
  align-self: stretch;
  color: var(---Main-Text, #1B2532);
  font-feature-settings: 'liga' off, 'clig' off;

  /* 常规/14px */
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
}

.cursor {
  display: inline-block;
  opacity: 1;
  transition: opacity 0.5s;
  /* 光标闪烁的渐变效果 */
}
</style> -->

<style scoped>
@font-face {
  font-family: 'ShouhuFont';
  src: url('/360shouhuType-Bold.otf') format('opentype');
}

/* 去掉居中效果的样式 */
.chat {
  max-width: 100%;
  /* 设置最大宽度适应容器 */
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 1.2em;
  line-height: 1.5;
  text-align: left;
  /* 左对齐 */
  margin: 0;
  /* 去掉自动居中的 margin */
  padding: 10px;
  /* 添加一些内边距，避免文字贴边 */
}

/* Typewriter 样式 */
.typewriter {
  align-self: stretch;
  color: var(---Main-Text, #1B2532);
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

/* 光标样式 */
.cursor {
  display: inline-block;
  opacity: 1;
  transition: opacity 0.5s;
  /* 光标闪烁的渐变效果 */
}
</style>
