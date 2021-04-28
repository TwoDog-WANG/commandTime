











# 一. 概括

<img src="C:\Users\TwoDogWANG\Desktop\LianXi\web\Command-TIME\项目文档\image-20210428110037312.png" alt="image-20210428110037312" style="zoom:50%;" />

现状图如上所示，添加，删除事项的基础逻辑已经完成，以后只需要根据待办这一个事项来扩展后续的标签。

# 二. 项目位置

<img src="C:\Users\TwoDogWANG\Desktop\LianXi\web\Command-TIME\项目文档\image-20210428110523429.png" alt="image-20210428110523429" style="zoom:70%;" />

如图，web文件夹与koa2服务器的nodeServerByKoa2文件夹处于同一文件夹下。主要包括Command-TIME文件夹，用于储存主页面main.html。js、css、img、json分别储存相应的文件。

# 三. 基础逻辑

## 1. main.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Command-TIME</title>
    <!--主页面css和表单css-->
    <link rel="stylesheet" href="../css/timeMain.css">
    <link rel="stylesheet" href="../css/form.css">
</head>
<body>
    <div class="main">
        <!--左栏右栏，右栏为完成-->
        <div id="leftShow">
            <!--img用于点击后生成提交事项的表单-->
            <img src="../imgs/add.png" id="asideImg">
            <nav id="navInLeft">
                <ul>
                    <li>待办</li>
                    <li>ACG</li>
                    <li>书籍</li>
                    <li>音乐</li>
                </ul>
            </nav>
            <!--aside设置多于内容影藏，通过container移动来展示不同的区域-->
            <aside id="aside">
                <div id="container">
                    <div id="thing"></div>
                    <div id="ACG"></div>
                    <div id="book"></div>
                    <div id="music"></div>
                </div>
            </aside>
        </div>
        <div id="rightShow"></div>
    </div>
    <!--timeMain.js最后导入，程序主如口-->
    <script src="../js/deleteTime.js"></script>
    <script src="../js/timeBox.js"></script>
    <script src="../js/getJSON.js"></script>
    <script src="../js/addTime.js"></script>
    <script src="../js/timeMain.js"></script>
</body>
</html>
```

## 2. timeMain.css

```css

* {
    padding: 0px;
    margin: 0px;
}
/*高宽：700，900，居中，相对定位是为了在后续添加的表单可以随main定位*/
.main {
    height: 700px;
    width: 900px;
    margin: 20px auto;
    position: relative;
}

#leftShow {
    height: 700px;
    width: 330px;
    float: left;
}
/*img的父元素leftShow没有定位，所以此时定位是相对main*/
#leftShow #asideImg {
    width: 30px;
    position: absolute;
    z-index: 9999;
    left: 280px;
    top: 90px;
}

/*导航栏各个元素位置问题以后解决*/
#leftShow #navInLeft {
    height: 60px;
    width: 316px;
    margin-top: 20px;
    background-color: #edf4ed;
    border-radius: 6px;
}
#leftShow #navInLeft ul li{
    list-style-type: none;
    float: left;
    width: 70px;
    margin: 0 5px;
    background-color: #edf4ed;
    font-size: 20px;
    text-align: center;
    line-height: 60px;
}
#leftShow #navInLeft ul li:first-child{
    margin-left: 3px;
}
#leftShow #navInLeft ul li:last-child{
    margin-left: 3px;
}

/*aside相对，container绝对*/
#leftShow #aside {
    height: 600px;
    width: 330px;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
}
#leftShow #aside #container {
    width: 1320px;
    position: absolute;
    /*left的移动来改变展示区域*/
    top: 0px;
    left: 0px;
}
#leftShow #aside #container > div {
    float: left;
    height: 600px;
    width: 328px;
    overflow-y: scroll;
}
/*设定滚动条的宽度*/
#leftShow #aside #container > div::-webkit-scrollbar{
    width: 8px;
}
/*滚动条轨道的样式和滚动条滑块的样式*/
#leftShow #aside #container > div::-webkit-scrollbar-track {
    border-radius: 6px;  
    background: #f2f7f6;  
}
#leftShow #aside #container > div::-webkit-scrollbar-thumb {
    border-radius: 6px;  
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background: #dbd9d9;  
}

#rightShow {
    height: 700px;
    width: 490px;
    margin-right: 20px;
    float: right;
    border: solid 1px;
}

```

## 3. time.json

json格式为

```json
{
	"thing": [
		{具体事情1},
		{具体事情2},
		{具体事情3},
		...
	],
	"ACG": [
		{...},
		{...},
        ...
	],
	...
}
```

## 4. timeMain.js

各个函数在文件下运行，去报函数运行顺序

```javascript
//以后点击导航栏不同区域，进行不同区域的展示时，通过who这个属性来确定现在在那一个区域
const asideBtn = document.querySelector('#asideImg');
asideBtn.who = 'thing';

//通一运行各个函数
window.addEventListener('load', getJson);
window.addEventListener('load', addTime);
```

## 5. timeBox.js

展示区域内盒子的生成，定义了盒子的所有行为

```js
//基本类
class Box {
    constructor() {
        //容纳生成的盒子
        this.box = null;
    };
    creatBox() {
        this.box = document.createElement('div');
        this.box.style.padding = '16px 8px 16px 18px';
        this.box.style.margin = '10px 5px 0px';
        this.box.style.backgroundColor = '#dcf5f0';
        this.box.style.borderRadius = '15px';
        this.box.style.position = 'relative';
        //盒子内部设置一个index属性，来放置盒子内容在json文件内的位置
        this.box.setAttribute('index', this.id);
    }
    fillBox() {
        for(let name in this){
            //读取实例内前三个属性来生成内容
            if(name !== 'box' && this.box.children.length < 3){
                let p = document.createElement('p');
                p.innerText = name + ':  ' + this[name];
                this.box.appendChild(p);
            }
        }
        //用于删除盒子
        let img = document.createElement('img');
        img.setAttribute('src', '../imgs/close.png');
        img.setAttribute('class', 'boxDelete');
        img.style.cssText = 'width: 24px;position: absolute; bottom: 3px; right: 3px; display: none'
        this.box.appendChild(img);
        //至此，每个盒子内部有三个p，用来存放json数据，一个img用来删除盒子
    }
    setP() {
        //设置p的样式
       let children = this.box.children;
       children[0].style.cssText = 'font: 20px Arial, Helvetica, sans-serif;color: #072;margin: 0 0 12px 0;';
       children[1].style.cssText = 'font: Arial, Helvetica, sans-serif;color: #37a';
       children[2].style.cssText = 'font: Arial, Helvetica, sans-serif;color: #37a';
    }
    //设置盒子的行为
    setListener() {
        //原本打算做一个显示阴影的动画，太low了，改为透明度
        {/*let time = null;
        let shadowDownDistance = 0;
        let shadowLeftDistance = 0;*/}
        this.box.addEventListener('mouseenter', () => {
            //鼠标移入，降低透明度，删除按钮出现
            this.box.style.opacity = '0.7';
            this.box.children[3].style.display = 'block';
            {/*clearInterval(time);
            time = setInterval(() => {
                if(shadowDownDistance === 6 && shadowLeftDistance === 6){
                    clearInterval(time);
                }
                else{
                    shadowDownDistance += 6;
                    shadowLeftDistance += 6;
                }
                this.box.style.boxShadow = -shadowLeftDistance + 'px ' + shadowDownDistance + 'px rgba(0, 0, 255, .2)';
            },100)*/}
        });
        this.box.addEventListener('mouseleave', () => {
            //盒子透明，删除按钮消失
            this.box.style.opacity = '1';
            this.box.children[3].style.display = 'none  ';
            {/*clearInterval(time);
            time = setInterval(() => {
                if(shadowDownDistance === 0 && shadowLeftDistance === 0){
                    clearInterval(time);
                }
                else{
                    shadowDownDistance -= 3;
                    shadowLeftDistance -= 3;
                }
                this.box.style.boxShadow = -shadowLeftDistance + 'px ' + shadowDownDistance + 'px rgba(0, 0, 255, .2)';
            },50)*/}
        })
        //对删除按钮监听click事件，使用删除函数deleteTime
        this.box.children[3].addEventListener('click', deleteTime);
    }
    //将盒子插入到父元素内
    addBox(father) {
        father.appendChild(this.box);
    }
}
//待办事项的盒子，
class ThingBox extends Box{
    constructor(thing, time, site, continueTime, describe, id) {
        super();
        this.事情 = thing;
        this.时间 = time;
        this.位置 = site;
        this.持续时间 = continueTime;
        this.描述 = describe;
        this.id = id;
    }
}
```

**注：**对于一个盒子实例，需要传入六个参数，前三个用于左侧小盒子的显示，前五个用于 **以后** 右侧内容的展示，第六个参数，配合aside.who这个变量用于表示该盒子的内容在json内部的位置。

## 6. getJSON.JS

用于读取json文件，并且在第一次载入后生成左侧需要的盒子。

```javascript
function getJson() {
    //定位读取json文件中的那个数据
    let who;
    //接口./json/time.json
    fetch('./json/time.json')
    //response数据流转JSON
    .then((res) => res.json())
    .then((myJson) => {
        //待办区域生成盒子
        getThing(myJson, who);
    })
}

function getThing(myJson, who) {
    //设置区域为待办区域
    who = 'thing';
    for(let name in myJson){
        //得到待办区域数据
        if(name === 'thing'){
            setBoxByArr(myJson[name], who);
        }
    }
};

function setBoxByArr(arr, who) {
    //根据who来得到区域的div
    if(who === 'thing'){
        var boxDiv = document.querySelector('#thing');
    }
    for(let i of arr){
        //历便数组，得到对象的属性名后生成盒子实例
        let arg = [];
        let key = Object.keys(i);
        for(let index = 0; index < key.length; index++){
            let name = key[index];
            arg.push(i[name]);
        }
        let thingBox = new ThingBox(arg[0],arg[1],arg[2],arg[3],arg[4],arg[5]);
        thingBox.creatBox();
        thingBox.fillBox();
        thingBox.setP();
        thingBox.setListener();
        thingBox.addBox(boxDiv);
    }
}
```

## 7. addTime.js

在点击添加按钮后，生成表单，发送表单，更新数据，更新左侧盒子

```javascript
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

```

## 8. deleteTime.js

```javascript
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
```



## 9. commandTime.js

后端文件，处理主页面的返回，json数据的修改，表单的渲染

```javascript
const fs = require('fs');

//主页面放回
const fn_commandTimeMain = async (ctx, next) => {
    //console.log(ctx.request);
    //读取，utf-8格式，否则会以buffer形式放回，转态码200，响应格式html
    let data = fs.readFileSync('../web/Command-TIME/main.html', 'utf-8');
    ctx.response.statue = 200;
    ctx.response.type = 'text/html';
    ctx.response.body = data;
}
//获得表单格式，渲染表单
const fn_getForm = async (ctx, next) => {
    let data = ctx.request.body;
    let timeData = JSON.parse(fs.readFileSync('../web/json/time.json','utf-8'));
    if(ctx.request.body.who === 'thing') {
        //获取json数据内当前区块的数据量，然后在渲染的时候加到表单中
        var index = timeData.thing.length;
    }
    data.index = index;
    ctx.response.statue = 200;
    //渲染表单，ctx.render是在app.js中手动添加的函数。
    ctx.render('form.njk', data);
}

const fn_addTime = async (ctx, next) => {
    //取得数据，去掉表单数据内的who，将时间与日之间的T改为-，将数据加入到但前区域，重新写入数据
    let timeData = JSON.parse(fs.readFileSync('../web/json/time.json','utf-8'));
    if(ctx.request.body.who === 'thing'){
        delete ctx.request.body.who;
        ctx.request.body.时间 = ctx.request.body.时间.replace('T', '-');
        let data = timeData.thing;
        data.push(ctx.request.body);
        fs.writeFileSync('../web/json/time.json', JSON.stringify(timeData,null,4));
    }
    ctx.response.statue = 200;
    ctx.response.type = 'application/json';
    //将修改后的数据放回
    ctx.response.body = ctx.request.body;
}
//删除数据
const fn_deleteTime = async (ctx, next) => {
    let index = ctx.request.body.id;
    let timeData = JSON.parse(fs.readFileSync('../web/json/time.json','utf-8'));
    if(ctx.request.body.who === 'thing'){
        let data = timeData.thing;
        data.splice(index,1);
        //将后续数据的id值减1
        for(index; index < data.length; index++){
            data[index].id = index + "";
        }
    }
    fs.writeFileSync('../web/json/time.json', JSON.stringify(timeData,null,4));
    ctx.response.body = "ok";
}

//暴露函数
module.exports = {
    "GET /": fn_commandTimeMain,
    "POST /getForm": fn_getForm,
    "POST /sendForm": fn_addTime,
    "POST /deleteTime": fn_deleteTime
}


```

## 10. letAppUseNunjuncks.js及form.njk

```javascript
const nunjuncks = require('nunjucks');
//环境设置，将默认地址设为模板所在地址
nunjuncks.configure(__dirname + '/viewsTemplate');
//生成一个异步函数，让app来调用
const fn_useNunjucks = async (ctx, next) => {
    //给ctx.render设置一个函数，返回渲染后的html
    ctx.render = function(view, data) {
        ctx.response.type = 'text/html';
        ctx.response.body = nunjuncks.render(view, data);
    }
    await next();
}

module.exports = fn_useNunjucks;

```

```
<form id={{who}}>
    <div>
        <label for="1">{{one}}:</label>
        <input type="text" id="1" name={{one}}>
    </div>
    <div>
        <label for="2">{{two}}:</label>
        {% if who === 'thing' %}
            <input type="datetime-local" id="2" name={{two}}>
        {% else %}
            <input type="date" id="2" name={{two}}>
        {% endif %}
    </div>
    <div>
        <label for="3">{{three}}:</label>
        <input type="text" id="3" name={{three}}>
    </div>
    <div>
        <label for="4">{{four}}:</label>
        <input type="text" id="4" name={{four}}>
    </div>
    <div>
        <label for="5">{{five}}:</label>
        <input type="text" id="5" name={{five}}>
    </div>
    <input type="hidden" id="index" value={{index}}>
    <div class="button">
        <button type="submit">添加</button>
        <button type="reset">重置</button>
        <button type="button" id="close">关闭</button>
    </div>
<form>
```













































