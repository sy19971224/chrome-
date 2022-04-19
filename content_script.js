const toast = {
    hideTimeout: null,
    init: function () {
        const toastNode = document.createElement('div');
        toastNode.innerHTML = '<span class="text">默认提示</span>';//设置HTML模板，可以根据需求设计
        toastNode.id = 'crawl_shopee_test_toast';//设置id，一个页面有且仅有一个toast
        toastNode.style.display = 'none';//设置隐藏，默认隐藏
        document.body.appendChild(toastNode);//添加到body下面
        console.log('init--toastNode', toastNode)
    },
    show: function (text, time) {
        if (this.hideTimeout) {//判断当前是否有弹出框，有的话先关闭当前
            clearTimeout(this.hideTimeOut);
            this.hideTimeOut = null;
        }
        if (!text) {//判断传入提示文本是否为空，是的话返回
            console.log('text为空');
            return;
        }
        const toastNode = document.getElementById('crawl_shopee_test_toast');
        if (!toastNode) {//判断toast是否初始化
            console.log('未初始化');
            return;
        }
        const toastText = toastNode.querySelector('.text');
        toastText.innerHTML = text || '';//找到toast设置显示文本
        toastNode.style.display = 'block';//设置toast为显示状态
        this.hideTimeout = setTimeout(function () {//timeout设置多久后隐藏
            toastNode.style.display = 'none';
            toast.hideTimeout = null;
        }, time);
    },
    hide: function () {
        if (this.hideTimeout) {//如果当前存在toast，就关闭当前toast
            clearTimeout(this.hideTimeOut);
            this.hideTimeOut = null;
        }
        const toastNode = document.getElementById('crawl_shopee_test_toast');
        if (toastNode) {
            toastNode.style.display = 'none';//移除toastDOM
            document.body.removeChild(toastNode);
        }
    }
}

let divBox = null;
const contextMenu = () => {
    document.getElementsByTagName('body')[0].addEventListener('contextmenu', (e) => {
        const ele = e.target;
        divBox = ele;
    })
    console.log('Seed tool loaded~~')
}
contextMenu()

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('request', request)
    if (request.from === 'ins') {
        if (divBox.className === 'fXIG0') {
            const videoBox = divBox.parentElement.children[0].children[0].children[0].children[0];
            sendResponse(videoBox.src);
        }
        else if(document.getElementsByTagName('video').length === 1){
            sendResponse(document.getElementsByTagName('video')[0].src);
        }
    }
    if (request.text) {
        toast.init();
        toast.show(request.text, request.time);
        setTimeout(toast.hide, request.time);
    }
    return true
});