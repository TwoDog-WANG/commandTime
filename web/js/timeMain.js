//以后点击导航栏不同区域，进行不同区域的展示时，通过who这个属性来确定现在在那一个区域
const asideBtn = document.querySelector('#asideImg');
asideBtn.who = 'thing';

//同一运行各个函数
window.addEventListener('load', getJson);
window.addEventListener('load', addTime);