<template>
    <div class="chart-convert">
        <!-- 显示加载提示 -->
        <div class="chart-title" v-if="isLoading">{{ ChartTitle }}</div>

        <!-- 显示生成的图像 -->
        <div class="chart-img" v-if="image_url">
            <div>
                <p class="stream_tt">为您生成的图表</p>
                <img :src="`${this.baseURL}/static/images/${encodeURIComponent(this.filename)}`" alt="生成的图片"
                    ref="chartImage" />
            </div>

            <div class="text-icons">
                <div class="generate-btn" @click="generateText">
                    <icon-sync /> 重新生成
                </div>
                <!-- <div class="copy-btn" @click="copyText">
                    <icon-copy /> 复制
                </div> -->
                <div class="download-btn" @click="downloadImage">
                    <icon-download /> 下载
                </div>
            </div>
        </div>

        <!-- 显示错误信息 -->
        <div v-else class="chart-title">{{ errorMessage }}</div>
    </div>
</template>

<script>
import { IconCopy, IconSync, IconDownload } from '@arco-design/web-vue/es/icon';
import axios from 'axios';
import { useCardsStore } from '@/store/cardsStore';

export default {
    name: 'ChartConverter',
    components: {
        IconCopy,
        IconSync,
        IconDownload,
    },
    data() {
        return {
            ChartTitle: '正在为您重新生成图片',
            baseURL: 'http://127.0.0.1:5000', // Flask 服务地址
            isLoading: false, // 控制加载状态
            image_url: '', // 图片 URL
            errorMessage: '', // 错误消息
            filename: ''
        };
    },
    computed: {
        currentCard() {
            const cardsStore = useCardsStore();
            return cardsStore.currentCard;
        },
    },
    mounted() {
        if (this.currentCard?.save_figure_path) {
            this.fetchTextData(this.currentCard.save_figure_path);
        }
    },
    methods: {
        async fetchTextData(imagePath) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await axios.post(`${this.baseURL}/api/generate_image`, { imagePath });
                if (response.data.success) {
                    console.log('服务器返回的响应:', response.data);
                    this.image_url = response.data.image_url;
                    this.filename = response.data.filename;
                } else {
                    this.errorMessage = response.data.message || '未知错误';
                    this.image_url = '';
                }
            } catch (error) {
                console.error('请求失败:', error);
                this.errorMessage = '暂不支持该图表的转换';
            } finally {
                this.isLoading = false;
            }
        },
        async copyText() {
            this.$message.error('复制功能尚未实现');
        },
        async generateText() {
            this.$message.error('重新生成功能尚未实现');
        },
        downloadImage() {
            const link = document.createElement('a');
            console.log(this.filename);
            // 拼接完整路径并对路径进行 URL 编码
            link.href = `${this.baseURL}/images/${encodeURIComponent(this.filename)}`;
            link.download = this.filename; // 提取文件名作为下载名称
            link.click();
        },
    },
};
</script>

<style scoped>
.chart-title {
    color: var(---Main-Text, #1B2532);
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    text-align: center;
}

.chart-convert {
    width: 824px;
    display: flex;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(2px);
}

.chart-img {
    align-self: stretch;
    display: flex;
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    flex-direction: column;
}

.chart-img img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
}

.text-icons {
    margin-top: 16px;
    display: flex;
    gap: 6px;
    justify-content: center;
}

.stream_tt {
    font-weight: 400;
    line-height: 10px;

    align-self: stretch;
    color: var(---Main-Text, #1B2532);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: 16px;
    font-style: normal;
    text-align: left;
}
</style>
