//被添加到timeBox里img生成的时候的click时间监听内
function deleteTime() {
    let father = this.parentNode;
    let id = father.getAttribute('index');
    fetch('/deleteTime', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },//定位，哪个区域，第几个
        body: JSON.stringify({"id": id, "who": asideBtn.who})
    })
    .then(() => {
        father.parentNode.removeChild(father);
    })
}