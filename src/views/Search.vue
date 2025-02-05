<template>
    <div class="layout">
        <div class="container">
            <div class="title-header">
                <!-- <img class="logo" src="/logo_blue.png" alt=""> -->
                <div class="title">
                    财报智析
                </div>
            </div>
            <div class="searchBox">
                <div style="width: 100%; flex: 1;">
                    <a-textarea v-model="userInput" placeholder="请上传图片、文件或者输入想要了解的问题" :auto-size="{
                        minRows: 2,
                        maxRows: 5
                    }" class="textareaClass" />
                </div>

                <div class="addafterParent">
                    <!-- <div class="addafter">
                        <icon-file-image :style="{ fontSize: '0px' }" />
                    </div> -->
                    <div class="addafter">
                        <icon-file-image :style="{ fontSize: '22px' }" @click="handleClick" />
                        <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
                            <template #title>
                                上传图片
                            </template>
                            <div>
                                <a-upload :limit="1" draggable :custom-request="customRequest" />
                            </div>
                        </a-modal>
                    </div>
                    <div class="addafter">
                        <div class="icon-wrapper" @click="sendTextToFlask">
                            <icon-send :style="{ fontSize: '22px' }" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="messageList">
                <div class="listItems" v-for="(item, index) in messageList" :key="index">{{ item }}</div>
                <!-- <div class="tag9">
                    <icon-plus-circle :style="{ fontSize: '14px', paddingRight: '2px' }" />
                    <div class="tag-text">查看更多</div>
                </div> -->
            </div>
        </div>
        <div class="slider">
            <div class="menu-item" v-for="(item, index) in menuList" :key="index" style="height: 64px;width: 64px;">
                <img class="sidebar-icon" :src="`/icons/${item.icon}.svg`" alt="" :title="item.name"
                    @click="gotoPage(item.path)">
            </div>
        </div>
    </div>


</template>


<script>
import IconWrapper from '../components/IconPicture.vue'
import { IconFileImage, IconFolderAdd, IconPlusCircle, IconSend } from '@arco-design/web-vue/es/icon';
import Typewriter from '../components/Typewriter.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useCardsStore } from '@/store/cardsStore';

export default {
    name: 'Search',
    components: {
        IconWrapper,
        IconFileImage,
        IconFolderAdd,
        IconPlusCircle,
        IconSend,
        Typewriter,
        axios
    },
    data() {
        return {
            messageList: [
                '2024年新能源汽车财报', '2024年腾讯财报', '2024年中国银行业展望报告', '全球经济环境及政策和商业行动的见解',
                '2024年国际财务报告会计准则变化', '国际财务报告准则第18号', '2024年ESG报告的实施', '新国际财务报告会计准则IFRS 18',
                '新国际财务报告会计准则IFRS 18'
            ],
            visible: false,
            fileList: [],
            userInput: '', // 用于绑定文本域的内容
            menuList: [
                {
                    name: '用户',
                    icon: 'user',
                    path: 'login'
                },
                {
                    name: 'history',
                    icon: 'history',
                    path: "history"
                },
                {
                    name: 'home',
                    icon: 'home',
                    path: '/'
                }
            ]
        }
    },
    setup() {
        const customRequest = (option) => {
            const cardsStore = useCardsStore(); // 获取 Pinia Store 实例
            const { onProgress, onError, onSuccess, fileItem, name } = option
            const xhr = new XMLHttpRequest();
            if (xhr.upload) {
                xhr.upload.onprogress = function (event) {
                    let percent;
                    if (event.total > 0) {
                        // 0 ~ 1
                        percent = event.loaded / event.total;
                    }
                    onProgress(percent, event);
                };
            }
            xhr.onerror = function error(e) {
                onError(e);
            };
            xhr.onload = function onload() {
                if (xhr.status < 200 || xhr.status >= 300) {
                    return onError(xhr.responseText);
                }
                const response = JSON.parse(xhr.response); // 后端返回 JSON 数据
                // 将返回的 cards 数据存储到 Pinia
                console.log(response)
                if (response.cards) {
                    cardsStore.setCards(response.cards); // 将 cards 存储到全局状态
                }
                console.log(response.message); // 输出 'File uploaded successfully'
                console.log(response.file_path); // 输出文件路径 '/path/to/file'
                onSuccess(xhr.response);
            };

            const formData = new FormData();
            formData.append(name || 'file', fileItem.file);
            console.log(fileItem.name);
            xhr.open('post', 'http://localhost:5000/search/image', true);
            xhr.send(formData);

            return {
                abort() {
                    xhr.abort()
                }
            }
        };

        return {
            customRequest
        }
    },
    methods: {
        // 打开 modal
        handleClick() {
            this.visible = true;
        },
        // 关闭 modal
        handleOk() {
            this.visible = false;
            console.log('if end')
            this.gotoPage('/FinancialDashBoard')
        },
        handleCancel() {
            this.visible = false;
        },
        gotoPage(path) {
            console.log(path);
            this.$router.push(path)
        },
        sendTextToFlask() {
            // 检查文本域是否有内容
            // 《指出我的问题！》《这是我的问题？》《我有什么问题？》《你怎么这么多问题？》《给你脸了》
            if (!this.userInput.trim()) {
                this.$message.error('请输入一些内容');
                return;
            }

            // 发送文本域中的内容到 Flask 后端
            axios
                .post('http://localhost:5000/search/text', { text: this.userInput })
                .then((response) => {
                    console.log('完整响应对象:', response);
                    const responseData = response.data;
                    console.log(responseData)
                    console.log(responseData.message)
                    const cardsData = responseData.cards; // 后端返回的 cards 数据
                    const cardsStore = useCardsStore();
                    cardsStore.setCards(cardsData); // 存储 cards 到 Pinia
                    console.log(cardsData);
                    // 成功后跳转到目标页面
                    this.gotoPage('/FinancialDashBoard')
                })
                .catch((error) => {
                    console.error('发送文本失败', error);
                });
        },
    },
};
</script>

<style scoped>
@font-face {
    font-family: 'ShouhuFont';
    src: url('/360shouhuType-Bold.otf') format('opentype');
}

.title-header {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    flex-wrap: nowrap;
}

.logo {
    width: 64px;
    height: 64px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* 根据需要调整阴影颜色和透明度 */
    border-radius: 10cm;
    margin-right: 10px;
}

.layout {
    height: 100%;
    width: 100%;
}

.container {
    padding-top: 250px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.title {
    font-family: 'ShouhuFont', monospace !important;
    margin-bottom: 14px;
    font-family: '360shouhu Type';
    font-size: 64px;
    font-weight: 700;
    height: 64px;
    line-height: 64px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #4080FF
}

.searchBox {
    width: 770px;
    height: 130px;
    position: relative;
    border-radius: 8px;
    background-color: #FFFFFF;
    border: 1px dashed #94bfff;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 8px 16px;
    gap: 4px;
    text-align: left;
    font-size: 14px;
    color: #86909c;
    font-family: 'PingFang SC';

}

.addafterParent {
    /* position: absolute; */
    display: flex;
}


.addafter {
    width: 22px;
    position: relative;
    height: 22px;
    padding: 2px 4px;
}

.addafter:first-child {
    margin-right: 8px;
}

/* .addafter:last-child {
    margin-left: 8px;
} */

.icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* 可根据需求调整 */
    border-radius: 25%;
    /* 圆形背景 */
    transition: background-color 0.3s;
    /* 平滑过渡效果 */
}

.icon-wrapper:hover,
.icon-wrapper:focus,
.addafter:hover,
.addafter:focus {
    /* background-color: skyblue; */
    /* 设置天蓝色背景 */
    cursor: pointer;
    /* 鼠标悬停效果 */
    border-radius: 4px;
    background: var(--fill-2, #F2F3F5);
}

/* 点击效果：微微缩小 */
.icon-wrapper:active {
    transform: scale(0.95);
    /* 点击时缩小 */
    background-color: #a0c4ff;
    /* 点击时的背景色 */
}

.textareaClass {
    height: 100%;
    width: 100%;
    background-color: transparent !important;
}

.arco-textarea-wrapper,
.arco-textarea-wrapper:focus-within,
.arco-textarea-wrapper:hover,
.arco-textarea-wrapper:focus-visible {
    border: none !important;
    outline: none !important;
}

.messageList {
    margin-top: 24px;
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.listItems,
.tag9 {
    border-radius: 4px;
    margin: 2px;
    border: 1px solid #3491fa;
    box-sizing: border-box;
    overflow: hidden;
    align-items: center;
    padding: 5px 8px;
    text-align: left;
    font-size: 14px;
    color: #3491fa;
    font-family: 'PingFang SC';
}

.tag9 {
    display: flex;
    border-radius: 4px;
    background-color: #e8f3ff;
    border: 1px solid #165dff;
    box-sizing: border-box;
    padding: 5px 8px;
    gap: 4px;
    font-size: 14px;
    color: #165dff;
    font-family: 'PingFang SC';
}

.slider {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
}

.menu-item {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: #f2f3f5;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.sidebar-icon {
    font-size: 36px;
}

/* 悬停效果：改变背景色并缩放 */
.menu-item:hover {
    background-color: #d0e7ff;
    /* 鼠标悬停时的背景色 */
    transform: scale(1.1);
    /* 缩放效果 */
}

/* 点击效果：微微缩小 */
.sidebar-icon:active {
    transform: scale(0.95);
    /* 点击时缩小 */
    background-color: #a0c4ff;
    /* 点击时的背景色 */
}

.listItems,
.tag9 {
    opacity: 0;
    animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
        /* 可以添加位移动画 */
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>