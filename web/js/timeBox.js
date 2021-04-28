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