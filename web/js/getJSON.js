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