const yapiurl = 'https://yapi.test.shopee.io/mock/7422/mmdata/api/v1/collect/rawdata'
const url = 'https://crawler-admin.i.sv.test.shopee.co.id/api/mmdata/api/v1/collect/rawdata'

chrome.contextMenus.create({
    type: 'normal',
    title: '投放种子',
    id: 'crawl_seeds',
    contexts: ["all"],
})
chrome.contextMenus.onClicked.addListener(parameter => {
    const {  pageUrl,linkUrl, mediaType } = parameter
    console.log('parameter', parameter)
    getCurrentTabId().then((tabId) => {
        console.log('tabId', tabId)
        if (pageUrl.includes('instagram')) {
            chrome.tabs.sendMessage(tabId, { from: 'ins' }, (srcUrl) => {
                srcUrl && debounce(fetchUrl(url, [{ video_url: srcUrl, location_url: pageUrl }], tabId), 1000, true)
            });
        }
        if (pageUrl.includes('tiktok') && (mediaType === "video")) {
            fetchUrl(url, [{ video_url: linkUrl || pageUrl, location_url: pageUrl }], tabId)
        }
    })
})

const fetchUrl = function (url, params, tabId) {
    postData(url, params)
        .then(response => {
            console.log('response', response)
            if (!response.ok || (response.status !== 200)) {
                handleWrongTips(tabId)
                throw error('请求失败')
            }
            const res = response.json()
            console.log('res', res);
            return res
        })
        .then(data => {
            console.log('Success:', data);
            if (data.code !== 0) {
                chrome.tabs.sendMessage(tabId, { text:data.msg,time:1500});
                return
            }
            chrome.tabs.sendMessage(tabId, { text: 'Success (～￣▽￣)～', time: 1000 });
        })
        .catch((error) => {
            handleWrongTips(tabId)
            console.error('Error:', error);
        });
    return true;
}
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            active: true, currentWindow: true
        }, function (tabs) {
            resolve(tabs.length ? tabs[0].id : null)
        });
    })
}
const debounce = (fn, delay, immediate) => {
    let timer = null;
    const _this = this;
    return function () {
        if (immediate && timer === null) {
            fn.apply(_this, arguments)
        }
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(_this, arguments);
        }, delay)
    }
}

const handleWrongTips = (tabId) => {
    chrome.tabs.sendMessage(tabId, { text: 'Something was wrong, please try again ヽ(。>д<)ｐ', time: 2000 });
}