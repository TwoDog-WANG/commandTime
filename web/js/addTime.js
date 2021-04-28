//后端生成form模板需要的数据
class formData {
    constructor(who, one, two, three, four, five) {
        //who表示但前区域，表单在后端渲染的时候会在form标签的id属性上代上这个值
        this.who = who;
        this.one = one;
        this.two = two;
        this.three = three;
        this.four = four;
        this.five = five;
    }
}
//设置form需要的数据
function setFormData() {
    let data = null;
    //不同的区域，form需要的数据不一样
    if(asideBtn.who === 'thing'){
        data = new formData("thing", "事情", "时间", "位置", "持续时间", "描述");
    }
    return data
}

function addTime() {
    //添加按钮点击后
    asideBtn.addEventListener('click', function(){
        let mainDiv = document.querySelector('.main');
        //防止多次点击后多次生成表单区域，这里没有考虑到表单无法生成的时候，表单区域的关闭，可以加上点击其他区域后关闭表单区域
        if(mainDiv.children.length < 3){
            let formDiv = document.createElement('div');
            formDiv.setAttribute('class', 'tempDivByForm');
            mainDiv.appendChild(formDiv);
            //获取表单
            getForm(formDiv);
        }
    })
}
function getForm(formdiv) {
    let data = setFormData();
    fetch('/getForm', {
        method: 'POST',
        headers: {
            //data时json类型的数据
            'content-type': 'application/json'
        },
        //以json字符串的形式传递，必须这样
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then((text) => {
        formdiv.innerHTML = text;
        //insertAdjacentHTML可以在父元素内的元素后，以字符串的形式插入html
        //formdiv.insertAdjacentHTML('beforeend', text);
        //关闭表单区域
        closeBtnAddListen();
        //发送表单
        sendForm();
        //以上的几个行为必须卸载.then里面，如果写在外面，那么很大程度上后续函数执行的时候回读取不到form元素。
    })
}

function closeBtnAddListen() {
    //表单内部有一个关闭按钮
    let btn = document.querySelector('#close');
    btn.addEventListener('click', function() {
        let mainDiv = document.querySelector('.main');
        mainDiv.removeChild(mainDiv.children[2]);
    })
}

function sendForm() {
    let form = document.querySelector('form');
    //后端会在表单内的一个隐藏input上写入一个值，以此表示当前区域内的数据量
    let addId = document.querySelector('#index').value;
    form.addEventListener('submit', function(event) {
        //组织表单提交这一个事件
        event.preventDefault();
        //以formdata的形式得到表单数据
        let data = new FormData(form);
        //添加who属性，表示当前在哪个区域，id属性，表示当前数据是当前区域的第几个数据
        data.append("who",form.getAttribute("id"));
        data.append("id", addId);
        fetch('/sendForm', {
            //此时headers里不能设置content-type属性，或者设置为multipart/form-data，否则后端无法识别
            method: 'POST',
            body: data
        })
        //后端解析后得到的是一个json数据，处理后放回该数据，以此来更新左侧栏的盒子数据
        .then(res => res.json())
        .then((json) => {
            if(asideBtn.who === 'thing'){
                var whoDiv = document.querySelector('#thing');
            };
            let arg = [];
            let key = Object.keys(json);
            for(let index = 0; index < key.length; index++){
                let name = key[index];
                arg.push(json[name]);
            }
            let boxox = new ThingBox(arg[0],arg[1],arg[2],arg[3],arg[4],arg[5]);
            boxox.creatBox();
            boxox.fillBox();
            boxox.setP();
            boxox.setListener();
            boxox.addBox(whoDiv);
        })
    })
}
