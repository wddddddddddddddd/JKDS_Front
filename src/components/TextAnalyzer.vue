<template>
    <div class="ai-analysis">
        <div class="ai-analysis-text">
            <!-- 如果数据为空，显示加载提示 -->
            <div v-if="isLoading">加载中...</div>
            <!-- 否则显示 Typewriter 组件 -->
            <!-- <Typewriter v-else :text="textarea_data" :speed="25" style="margin-bottom:14px;" /> -->
            <div>
                <p class="stream_tt">以下是针对图片的分析</p>
                <span class="streamoutput">{{ output }}</span>
            </div>
        </div>
        <div class="text-icons" style="bottom: 10px;">
            <div class="generate-btn" @click="startStream(currentCard.save_figure_path)">
                <icon-sync /> 重新生成
            </div>
            <div class="copy-btn-ai" @click="copyText">
                <icon-copy /> 复制
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useCardsStore } from '@/store/cardsStore';
import Typewriter from './Typewriter.vue';
import {
    IconCopy,
    IconSync
} from '@arco-design/web-vue/es/icon';

export default {
    name: 'TextAnalyzer',
    components: {
        Typewriter,
        IconCopy,
        IconSync
    },
    data() {
        return {
            textarea_data: '', // 存储返回的文本数据
            isLoading: false, // 控制加载状态
            output: '', // 流式输出内容
        }
    },
    computed: {
        currentCard() {
            const cardsStore = useCardsStore();
            console.log(cardsStore.currentCard);
            return cardsStore.currentCard;
        },
    },
    mounted() {
        // 当组件挂载时，发送请求获取解析数据
        if (this.currentCard && this.currentCard.save_figure_path) {
            this.startStream(this.currentCard.save_figure_path); // 发送请求获取文本数据
        }
    },
    methods: {
        async fetchTextData(imagePath) {
            this.isLoading = true; // 开始加载，显示加载提示
            try {
                const response = await axios.post('http://localhost:5000/api/analyze-image', { imagePath });
                // 假设后端返回的数据包含 textarea_data
                this.textarea_data = response.data.textarea_data; // 更新 textarea_data
                console.log(this.textarea_data); // 打印返回的数据
            } catch (error) {
                console.error('请求失败:', error);
            } finally {
                this.isLoading = false; // 请求完成，关闭加载提示
            }
        },
        async startStream(imagePath) {
            try {
                this.output = ''; // 初始化一下
                const response = await fetch('http://127.0.0.1:5000/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imagePath }),
                });

                if (!response.ok) {
                    throw new Error('Failed to start streaming');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    // 提取流数据并追加到输出
                    const lines = chunk
                        .split('\n')
                        .filter((line) => line.trim().startsWith('data: '))
                        .map((line) => line.replace('data: ', '').trim())
                        .join('');
                    this.output += lines;
                }
            } catch (error) {
                console.error('Error streaming data:', error);
            }
        },
        async copyText() {
            const textarea = document.createElement('textarea');
            textarea.value = this.textarea_data;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.$message.success('复制成功');
        },
        async generateText() {
            this.$message.error("缺少对应方法");
        }
    },
}
</script>

<style scoped>
.ai-analysis {
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

.ai-analysis-text {
    align-self: stretch;
    color: var(---Main-Text, #1B2532);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-bottom: 2px solid rgb(235, 240, 245);
}

.text-icons {
    margin-top: 16px;
    border-top: #4E5969 1px;
    display: flex;
    padding: 0px 8px;
    align-items: center;
    gap: 6px;
}

.ai-analysis-text div {
    font-size: 16px;
    color: #999;
    text-align: left;
}

.streamoutput {
    align-self: stretch;
    color: var(---Main-Text, #1B2532);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.stream_tt {
    align-self: stretch;
    color: var(---Main-Text, #1B2532);
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "PingFang SC";
    font-size: 16px;
    font-style: normal;
}
</style>
