<template>
    <div class="layout-header">
        <div class="avatar-nav">
            <img class="generalrobot-icon" alt="" src="/logo_blue.png" @click="this.$router.push('/')">
            <b class="b">财报智析</b>
            <div class="input-container">
                <input v-model="userInput" type="text" class="input-field" placeholder="请上传图片、文件或者输入想要了解的问题" />

                <!-- <button class="button" title="Upload file">
                    <img src="/icons/image.svg" alt="Upload">
                </button>

                <button class="button" title="Search">
                    <img src="/icons/search.svg" alt="Search">
                </button> -->
                <div class="addafterParent">
                    <!-- <div class="addafter">
                        <icon-file-image :style="{ fontSize: '0px' }" />
                    </div> -->
                    <div class="addafter">
                        <icon-file-image :style="{ fontSize: '22px', color: 'black' }" @click="handleClick" />
                        <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
                            <template #title>
                                上传文件
                            </template>
                            <div>
                                <a-upload :limit="1" draggable :custom-request="customRequest" />
                            </div>
                        </a-modal>
                    </div>
                    <div class="addafter">
                        <div class="icon-wrapper" @click="sendTextToFlask">
                            <icon-send :style="{ fontSize: '22px', color: 'black' }" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="gen-yanbao">
                <button>生成研报</button>
            </div>
            <a-space size="large">
                <a-avatar class="user-avatar">
                    <img alt="avatar" src="/Avatar.png" />
                </a-avatar>
            </a-space>
        </div>
        <div class="content-headers">
            <div class="menu-demo" style="width: 100%; display: flex;">
                <a-menu mode="horizontal" :default-selected-keys="['1']" style="display: flex;">
                    <a-menu-item v-for="(route, index) in routes" :key="index" :to="route.path">
                        {{ route.label }}
                    </a-menu-item>
                </a-menu>
            </div>
        </div>

    </div>
</template>

<script>
import IconWrapper from '../components/IconPicture.vue'
import { IconFileImage, IconFolderAdd, IconPlusCircle, IconSend } from '@arco-design/web-vue/es/icon';
import axios from 'axios';
import { useCardsStore } from '@/store/cardsStore';
export default {
    name: 'TopNavbar',
    components: {
        IconWrapper,
        IconFileImage,
        IconFolderAdd,
        IconPlusCircle,
        IconSend,
        axios
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
            xhr.open('post', 'http://101.200.127.68:5000/upload', true);
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
            this.gotoPage('/FinancialDashBoard');
            window.location.reload();
        },
        handleCancel() {
            this.visible = false;
        },
        // 处理文件选择
        handleFileChange(event) {
            this.file = event.target.files[0];
        },
        gotoPage(path) {
            console.log(path);
            this.$router.push(path)
        },
        sendTextToFlask() {
            // 检查文本域是否有内容
            if (!this.userInput.trim()) {
                this.$message.error('请输入一些内容');
                return;
            }

            // 发送文本域中的内容到 Flask 后端
            axios
                .post('http://101.200.127.68:5000/receive_text', { text: this.userInput })
                .then((response) => {
                    console.log('文本已发送到后端', response.data.message);
                    const cardsData = response.data.cards; // 后端返回的 cards 数据
                    const cardsStore = useCardsStore();
                    cardsStore.setCards(cardsData); // 存储 cards 到 Pinia
                    // 成功后跳转到目标页面
                    this.gotoPage('/FinancialDashBoard')
                })
                .catch((error) => {
                    console.error('发送文本失败', error);
                });
        },
    },
    data() {
        return {
            visible: false,
            file: null,
            userInput: '', // 用于绑定文本域的内容
            routes: [
                {
                    path: '/FinancialDashBoard',
                    label: '全部'
                },
                {
                    path: '/',
                    label: '信息科技'
                },
                {
                    path: '/channel',
                    label: '大消费',
                },
                {
                    path: '/news',
                    label: '生命健康'
                },
                {
                    path: '/news',
                    label: '传媒娱乐'
                },
                {
                    path: '/news',
                    label: '先进制造'
                },
                {
                    path: '/news',
                    label: '地产金融'
                },
                {
                    path: '/news',
                    label: '传统行业'
                },
                {
                    path: '/news',
                    label: '电子科技'
                },
                {
                    path: '/news',
                    label: '机械制造'
                },
                {
                    path: '/news',
                    label: '汽车制造'
                },
                {
                    path: '/news',
                    label: '传统能源'
                },
                {
                    path: '/news',
                    label: '新能源'
                },
                {
                    path: '/news',
                    label: '航天航空'
                },
                {
                    path: '/news',
                    label: '高端消费'
                },
            ],
        }
    }
}
</script>


<style scoped>
@font-face {
    font-family: 'ShouhuFont';
    src: url('/360shouhuType-Bold.otf') format('opentype');
}

.layout-header {
    display: flex;
    flex-direction: column;
    justify-content: start;
    color: var(--color-white);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
    height: 98px;
    background: url(/src/assets/icons/image_top.png) no-repeat center bottom;
    background-size: 100% 500%;
    /* 通过增大背景图的尺寸，截取底部 20% */
}

.generalrobot-icon {
    width: 35px;
    height: 35px;
    border-radius: 10cm;
    margin-right: 10px;
}

.avatar-nav {
    border-radius: 2.25px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.b {
    font-size: 30px;
    line-height: 13.5px;
    font-family: 'ShouhuFont', monospace !important;
    color: #fff;
}

.input-container {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    width: 400px;
    margin-left: 40px;
    font-size: 12px;
}

.input-field {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px;
}

.button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
}

.button img {
    width: 20px;
    height: 20px;
    filter: brightness(0) saturate(100%);
    /* Makes SVG icons black */
}

.user-avatar {
    /* position: fixed !important; */
    position: absolute;
    right: 20px;
}


.content-headers {
    display: flex;
    width: 100%;
    position: relative;
    border-bottom: 1px solid #e5e6eb;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    text-align: left;
    font-size: 16px;
    color: #4e5969;
    font-family: 'PingFang SC';
}

.menu-demo {
    width: 100%;
    display: flex;
}

.addafterParent {
    /* position: absolute; */
    display: flex;
}


.addafter {
    width: 22px;
    position: relative;
    height: 22px;
}

.addafter:first-child {
    margin-left: 8px;
}

.addafter:last-child {
    margin-left: 8px;
}

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
    background-color: skyblue;
    /* 设置天蓝色背景 */
    cursor: pointer;
    /* 鼠标悬停效果 */
}

/* 点击效果：微微缩小 */
.icon-wrapper:active {
    transform: scale(0.95);
    /* 点击时缩小 */
    background-color: #a0c4ff;
    /* 点击时的背景色 */
}
</style>