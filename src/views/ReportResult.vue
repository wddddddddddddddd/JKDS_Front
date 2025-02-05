<template>
    <div>
      <h2>Markdown 渲染示例</h2>
      <div v-html="renderedMarkdown" class="markdown-content"></div>
    </div>
  </template>
  
  <script>
  import { marked } from "marked";
  
  export default {
    data() {
      return {
        markdownContent: `# 迪桑  
  ## 发生的变化发  
  这是 **加粗**，这是 *斜体*，这是 \`代码块\`。  
  - 列表项 1  
  - 列表项 2  
  [百度](https://www.baidu.com)`,
      };
    },
    computed: {
      renderedMarkdown() {
        return marked(this.markdownContent);
      },
    },
  };
  </script>
  
  <style>
  .markdown-content {
    max-width: 600px;
    margin: auto;
  }
  .markdown-content h1 {
    color: #2c3e50;
  }
  .markdown-content h2 {
    color: #34495e;
  }
  .markdown-content p {
    font-size: 16px;
    line-height: 1.6;
  }
  </style>
  