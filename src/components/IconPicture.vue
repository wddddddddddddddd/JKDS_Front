<template>
    <a-space size="large">
      <icon-plus :style="{fontSize:'32px'}" />
      <icon-check-circle :style="{fontSize:'32px'}" />
    </a-space>
  </template>
  
  <script>
  import { IconPlus, IconCheckCircle } from '@arco-design/web-vue/es/icon';
  
  export default {
    components: { IconPlus, IconCheckCircle }
  }
  </script>