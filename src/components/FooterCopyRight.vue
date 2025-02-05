<template>
  <footer class="footer">
    <p class="copyright">
      Copyright &copy; 2024 极客大赛 - 财讯小灵通 | 团队：赢了冠军开派对
    </p>
    <p class="members">
      成员：康力予、范武华、鲁晨希、孙琳、刘士源、曹纬东、金湛
    </p>
  </footer>
</template>

<script>
export default {
  name: 'FooterCopyRight',
};
</script>


<style scoped>
@font-face {
  font-family: 'ShouhuFont';
  src: url('/360shouhuType-Bold.otf') format('opentype');
}

.footer {
  font-family: 'ShouhuFont', monospace;
  background-color: #f8f8f8;
  opacity: 0.8;
  padding: 20px;
  text-align: center;
  /* 确保文本居中 */
  font-size: 0.9em;
  /* color: #555; */
  /* width: 100%; */
  margin-top: 50px;
}

.footer .copyright {
  margin-bottom: 5px;
}

.footer .members {
  font-family: 'ShouhuFont', monospace;
  margin-top: 5px;
  font-size: 0.8em;
  color: #777;
}
</style>
