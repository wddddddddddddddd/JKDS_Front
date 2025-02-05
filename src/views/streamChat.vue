<template>
    <div id="app">
        <h1>侧边栏</h1>
        <div class="chat-box">
            <div v-for="(message, index) in messages" :key="index" :class="['chat-message', message.role]">
                <div class="avatar-container">
                    <img :src="message.role === 'user' ? userAvatar : aiAvatar" alt="avatar" class="avatar" />
                </div>
                <div class="message-container"
                    :class="{ 'ai': message.role === 'assistant', 'user': message.role === 'user' }">
                    <p class="message-content">{{ message.content }}</p>
                    <!-- 分割线 -->
                    <hr v-if="message.role === 'assistant' && message.completed" class="divider" />
                    <!-- 复制按钮 -->
                    <div v-if="message.role === 'assistant' && message.completed" class="copy-container">
                        <button class="copy-btn" @click="copyToClipboard(message.content)">
                            复制
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="input-area">
            <input type="text" v-model="userInput" placeholder="Type your message..." @keyup.enter="sendMessage" />
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "streamChat",
    data() {
        return {
            userInput: '', // 用户输入
            messages: [],  // 聊天历史
            userAvatar: '/Avatar.png', // 用户头像地址
            aiAvatar: '/AiBot.jpg', // AI 头像地址
            imagePath: '汽车行业系列深度七：2024Q3：自主崛起加速 智能化盈利领跑/43/crop_images/43_figure_9.png',
        };
    },
    methods: {
        async sendMessage() {
            if (this.userInput.trim() === '') {
                alert('Please enter a message.');
                return;
            }

            // 添加用户消息到聊天记录
            this.messages.push({ role: 'user', content: this.userInput });

            // 初始化一条 AI 消息
            const aiMessage = { role: 'assistant', content: '', completed: false };
            this.messages.push(aiMessage);

            const requestData = { messages: this.messages, imagePath: this.imagePath };

            try {
                const response = await fetch('http://127.0.0.1:5000/stream_chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.body) {
                    throw new Error('ReadableStream not supported!');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                let done = false;
                let partialData = '';
                while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    done = readerDone;
                    partialData += decoder.decode(value, { stream: true });

                    let lines = partialData.split('\n');
                    partialData = lines.pop(); // 保留未完成的行

                    for (const line of lines) {
                        if (line.trim()) {
                            const parsed = JSON.parse(line);

                            // 更新最后一条 AI 消息的内容
                            aiMessage.content += parsed.content;

                            // 确保每次都更新 UI
                            this.$forceUpdate();
                        }
                    }
                }

                // 标记流式输出完成
                aiMessage.completed = true;
                this.$forceUpdate();

            } catch (error) {
                console.error('Error receiving data:', error);
            }

            this.userInput = ''; // 清空输入框
        },
        copyToClipboard(content) {
            navigator.clipboard.writeText(content).then(
                () => alert('Copied to clipboard!'),
                () => alert('Failed to copy.')
            );
        },
    },
};
</script>

<style scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 20px;
}

.chat-box {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    width: 500px;
    margin: 0 auto 20px auto;
    height: 400px;
    overflow-y: auto;
    background: #f9f9f9;
}

.chat-message {
    display: flex;
    align-items: flex-start;
    margin: 10px 0;
}

.chat-message.user {
    flex-direction: row-reverse;
}

.avatar-container {
    flex-shrink: 0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.message-container {
    max-width: 70%;
    margin: 0 10px;
    padding: 10px;
    border-radius: 10px;
    position: relative;
}

.message-container.user {
    background-color: #d0ebff;
    color: #004085;
}

.message-container.ai {
    background-color: #ffffff;
    color: #333;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.message-content {
    margin: 0;
}

.divider {
    border: none;
    border-top: 1px solid #ddd;
    margin: 10px 0;
}

.copy-container {
    display: flex;
    justify-content: flex-start;
    /* 按钮放置在最左侧 */
}

.copy-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
}

.copy-btn:hover {
    text-decoration: underline;
}

.input-area {
    display: flex;
    justify-content: center;
}

input {
    padding: 10px;
    width: 300px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

button {
    padding: 10px;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
