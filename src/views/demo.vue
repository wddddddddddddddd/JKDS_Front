<template>
    <div>
        <h1>Image Analysis</h1>
        <div>
            <p>Streamed Output:</p>
            <span>{{ output }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgUrl: './cake4.png', // 预定义图片URL
            output: '', // 流式输出内容
        };
    },
    mounted() {
        // 页面加载后立即开始流式输出
        this.startStream();
    },
    methods: {
        async startStream() {
            try {
                const response = await fetch('http://127.0.0.1:5000/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ img_url: this.imgUrl }),
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
    },
};
</script>

<style scoped>
h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

p {
    margin: 0;
    font-weight: bold;
}

span {
    white-space: pre-wrap;
    /* 保留换行和空白 */
    font-family: monospace;
}
</style>