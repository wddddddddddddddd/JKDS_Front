<template>
  <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div class="statistic-card" :class="{ selected: isSelected }" @click="toggleSelection">
      <div class="title">{{ title }}</div>
      <img :src="imgSrc" alt="Statistic Image" class="image" />
      <div class="tags">
        <span v-for="(tag, index) in tagList" :key="index" class="tag">{{ tag }}</span>
      </div>
      <div v-if="isSelected" class="card-checkmark">✔</div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'StatisticCard',
  props: {
    title: String,
    imgSrc: String,
    tagList: Array,
    isSelected: Boolean,
  },
  methods: {
    toggleSelection() {
      this.$emit('toggle-selection');
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'none';
    },
    enter(el, done) {
      el.offsetHeight; // 强制重排
      el.style.transition = 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
      el.style.opacity = 0;
      el.style.transform = 'translateY(30px)';
      done();
    }
  }
};
</script>

<style scoped>
.statistic-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 325px;
  /* width: 303px; */
  /* opacity: 0; */
}

.statistic-card:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  /* Center the text horizontally */
  display: flex;
  justify-content: center;
  /* Center the content horizontally */
  align-items: center;
  /* Center the content vertically */
  align-self: stretch;
  padding: 16px;
  border-bottom: 1px solid var(--border-2, #E5E6EB);
  font-family: PingFang SC;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-self: stretch;
  margin-top: 16px;
}

.tag {
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

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.card-checkmark {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #1e90ff;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
