<template>
    <div id="pdf-container" style="height: 100vh;">
        <!-- 使用 100vh 填满视口高度 -->
        <iframe :src="completeUrl" id="iframeBox" ref="iframeRef" frameborder="0"
            style="width: 100%; height: 100%;"></iframe>
    </div>
</template>

<script>
import { useCardsStore } from '@/store/cardsStore'; // 引入 Pinia store

export default {
    name: 'PdfPreview',
    data() {
        return {
            local_pdf_path: '', // 动态文件路径
            pdf_page_index: 1, // 默认页码
        };
    },
    computed: {
        completeUrl() {
            // 拼接带页码的 PDF 文件链接
            return `${this.local_pdf_path}#page=${this.pdf_page_index}`;
        },
    },
    created() {
        const cardsStore = useCardsStore();
        if (cardsStore.currentCard) {
            // Decode the path to fix double-encoding issues
            this.local_pdf_path = decodeURIComponent(cardsStore.currentCard.local_pdf_path);
            this.pdf_page_index = cardsStore.currentCard.pdf_page_index;
        }
    },
};

</script>

<style scoped>
html,
body,
#pdf-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    /* 使用视口高度 */
    overflow: hidden;
}
</style>