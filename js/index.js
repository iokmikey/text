

let con = document.querySelector(".conversion")
let mainbox = document.querySelector(".mainbox")
let menu = document.querySelector(".menu")

//默认index样式
con.children[0].classList.add("change_be")
con.children[0].classList.add("change_af")
con.children[0].children[0].classList.add("change_be")
con.children[0].children[0].classList.add("change_af")
con.children[0].children[0].style.color = '#f4e925'


//点击切换界面
con.onclick = function (e) {
    if (e.target.nodeName.toLowerCase() == 'a') {

        // 重置样式
        for (let c = 0; c < con.children.length; c++) {
            con.children[c].classList.remove("change_be")
            con.children[c].classList.remove("change_af")
            con.children[c].children[0].classList.remove("change_be")
            con.children[c].children[0].classList.remove("change_af")
            con.children[c].children[0].style.color = '#fff'
        }


        for (let i = 0; i < mainbox.children.length; i++) {
            // console.log(mainbox.children[i]);
            if (mainbox.children[i].getAttribute("name") == e.target.name) {
                e.target.classList.add("change_be")
                e.target.classList.add("change_af")
                e.target.parentNode.classList.add("change_be")
                e.target.parentNode.classList.add("change_af")
                e.target.style.color = "#f4e925"



                mainbox.children[i].style.display = 'block'
            } else {
                mainbox.children[i].style = ''
                mainbox.children[i].style.display = 'none'
            }
        }

    }
}














var appNamelist = document.querySelector("#selectElem")
let body = document.querySelector("body")

// // 切换模型    全局
var label = []   //类别
var statistics = []  //数量 key:value

var OriginalImage = []   //存储原图  即使更换模型也不重置 除关闭程序

var DetectedItem = []   //存储违禁物品信息 即使更换模型也不重置 除关闭程序

var flages = 0   //有违禁物品就是1  反之0

window.onload = function () {


    // ani  切换模型等待加载    以及首先进入的加载

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let res = JSON.parse(xhr.responseText)
            let model = res.args.ModelNames

            for (let i = 0; i < model.length; i++) {
                let option = document.createElement("option")
                option.value = model[i]
                option.innerHTML = model[i]
                appNamelist.appendChild(option)

            }
        }
    }
    xhr.open("get", getQueryDataUrl())
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.setRequestHeader("cmd", "Init");
    xhr.send();

};




// 动画  
var ani = document.querySelector(".ani")
setTimeout(() => {
    ani.style.transition = '1s'
    ani.style.opacity = 0
    setTimeout(() => {
        ani.style.display = 'none'
        banner();
    }, 1000)
}, 3000);








// 警告
let vi_back = document.querySelector(".vi_back")


// 是否有违禁物品显示相应图片
let tds = document.querySelector(".tds")



//违禁物品信息
let statusList = document.querySelectorAll(".statusList")

//违禁物品截图
let right_top = document.querySelector(".right_top");





//模型选择 
var sortedStatistics = null
var titlename = []
var titlenum = []

let data_pie = []   //统计
appNamelist.onchange = function () {


    let index = appNamelist.selectedIndex
    let ModelName = appNamelist.options[index].value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let res = JSON.parse(xhr.responseText)
            label = res.args.label
            statistics = res.args.statistics

            // 违禁物品类别   数据    主页面和设置界面
            sortedStatistics = Object.entries(statistics).sort((a, b) => b[1] - a[1]); //用于主页面和统计界面

            //    进行排序分割  //用于主页面和统计界面

            titlename = []
            titlenum = []
            for (let n = 0; n < sortedStatistics.length; n++) {
                titlename[n] = sortedStatistics[n][0]
                titlenum[n] = sortedStatistics[n][1]
            }

            data_type()

            // 统计界面  制作数据
            data_pie = []
            for (let p = 0; p < titlename.length; p++) {
                data[p] = { "name": titlename[p], "value": titlenum[p] }
            }
            echarts_1()
            echarts_3()
        }


    }
    xhr.open("get", getQueryDataUrl())
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.setRequestHeader("cmd", "SwitchModel");
    xhr.setRequestHeader("ModelName", ModelName);
    xhr.send()

    ju_model()
};



// var filter=null  //过滤

//点击类别事件效果 两个分别是主界面和设置    之后过滤
let lefttime_text = document.querySelectorAll(".lefttime_text ul")

for (let g = 0; g < lefttime_text.length; g++) {
    for (let d = 0; d < lefttime_text[g].children.length; d++) {
        lefttime_text[g].children[d].onclick = function () {
            lefttime_text[0].children[d].classList.toggle("active")
            lefttime_text[1].children[d].classList.toggle("active")
            // filter=lefttime_text[g].children[d].innerHTML
        }
    }
}





var data_type = function () {

    var data_type = label

    for (let g = 0; g < lefttime_text.length; g++) {
        while (lefttime_text[g].firstChild) {  //清空
            lefttime_text[g].removeChild(lefttime_text[g].firstChild);
        }
        for (let i = 0; i < data_type.length; i++) {
            li = document.createElement("li")
            li.innerHTML = data_type[i]
            li.classList.add("bg")
            li.classList.add("active")
            lefttime_text[g].appendChild(li)
        }
    }



    echarts_2()

    function echarts_2() {

        // 基于准备好的dom，初始化echarts实例   左下
        var myChart = echarts.init(document.getElementById('echart2'));

        option = {
            grid: {
                left: '0%',
                top: '0',
                right: '20%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                show: false
            },
            yAxis: [{
                show: true,
                data: titlename,


                inverse: true,
                animationDuration: 300,
                animationDurationUpdate: 300,

                axisLabel: {

                    textStyle: {
                        color: '#fff'
                    },
                },

            }, {
                // 限制不要超出
                show: false,

                data: titlenum,

                axisLabel: { textStyle: { color: '#fff' } },

            }
            ],
            dataZoom: [{   //滚动体
                type: 'slider',
                yAxisIndex: 0,
                startValue: 0, // 数据窗口范围的起始数值
                endValue: 8, // 数据窗口范围的结束数值（可以根据需要进行调整）


            }],
            series: [{
                realtimeSort: true,

                name: '条',
                type: 'bar',

                data: titlenum,

                barWidth: 15,
                barGap: '60%',

                // barCategoryGap:'60%',
                itemStyle: {
                    normal: {
                        barBorderRadius: 50,
                        color: '#1089E7',
                    }
                },
                // 柱子上数据
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{c}',
                        textStyle: { color: 'rgba(255,255,255,1)' }
                    }
                },
            },]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
};

data_type();









// 判断是否有违禁物   显示对应图片      
(function warn() {

    let img = ""
    let t = null
    if (flages == 1) {
        img = 'img/false.png'  //  true   false medium 切换  
        red()
        t = setInterval(red, 2000)

        function red() {
            tds.classList.add("tds_add")

            setTimeout(() => {
                tds.classList.remove("tds_add")
            }, 1000)
        }
    } else {
        img = 'img/true.png'
        tds.classList.remove("tds_add")
        clearInterval(t)
    }

    tds.children[0].src = img

    // if (img == 'img/false.png' || img == 'img/medium.png') 



})();



// banner
let box_center_banner = document.querySelector(".box_center")
let box_center_ul = document.querySelector(".box_center_banner ul")
let jt_left = document.querySelector(".box_center_left")
let jt_right = document.querySelector(".box_center_right")
let max_img = document.querySelector(".max_img")
let box_center_span = document.querySelector(".max_img span")
let index = 0
let timer = null
let flag = 1   //1可以动  0不动
let jl = true  //节流器


// // banner
function banner() {




    let bw = box_center_ul.children[0].clientWidth + 1

    box_center_ul.style.width = box_center_ul.children.length + 1 + "00%"

    function play() {
        if (!jl) return
        index++
        box_center_ul.style.transition = '1.5s'
        box_center_ul.style.left = index * -bw + 'px'
        jl = false
        setTimeout(() => {
            jl = true
        }, 1500)
    }

    timer = setInterval(play, 2000)

    box_center_banner.addEventListener("mouseenter", () => {
        clearInterval(timer)

    })
    box_center_banner.addEventListener('mouseleave', () => {
        if (flag == 1) {
            timer = setInterval(play, 2000)
        }
    })

    jt_left.onclick = function () {
        if (!jl) return
        index--
        box_center_ul.style.transition = '1.5s'
        box_center_ul.style.left = index * -bw + 'px'
        flag = 1
        jl = false
        setTimeout(() => {
            jl = true
        }, 1500)
    }
    jt_right.onclick = play


    setInterval(() => {
        if (index >= box_center_ul.children.length - 1) {
            jt_right.style.display = 'none'
            clearInterval(timer)
            flag = 0
        } else {
            jt_right.style.display = 'block'
        }

        if (index > 1) {
            jt_left.style.display = 'block'
        } else if (index <= 1) {
            jt_left.style.display = 'none'
        }
    }, 100)




    // 且双击放大了变红色
    box_center_banner.ondblclick = function () {
        max_img.children[0].src = OriginalImage[index - 1]
        max_img.style.display = 'block'
        flag = 0
        clearInterval(timer)
        vi_back.style.display = 'block'
    }
    box_center_span.onclick = function () {
        max_img.style.display = 'none'
        max_img.children[0].src = ""
        flag = 1
        timer = setInterval(play, 2000)
        vi_back.style.display = 'none'
    }



    // 图片滚轮局部放大缩小


    let all_li = box_center_ul.children

    let scale = 1; // 初始缩放比例
    // 监听鼠标滚动事件
    box_center_banner.addEventListener("wheel", function (e) {
        e.preventDefault();

        // 根据滚动方向调整缩放比例
        if (e.deltaY > 0) {  // >0 向下滚动   反之
            scale -= 0.1; // 缩小
            if (scale < 1) scale = 1; // 最小缩放比例限制
        } else {
            scale += 0.1; // 放大
            if (scale > 5) scale = 5;//最多不超过5倍大小 
        }

        // 获取鼠标在图片中的相对位置（偏移量） 鼠标相对于窗口的left或者top - 图片的距离窗口边缘的left或top   index*bw是因为会往左移动轮播，
        // 所以需要计算往左移动的图片个数 * 每一个图片宽度      -500  这个微调
        let mouseX = e.clientX - all_li[index].children[0].offsetLeft + index * bw - 500;
        let mouseY = e.clientY - all_li[index].children[0].offsetTop;



        // 应用缩放和偏移变换     鼠标相对于图片的距离偏移量/   获取图片的宽度 得到比值后转化为百分比
        let transformOriginX = mouseX / all_li[index].children[0].offsetWidth * 100;
        let transformOriginY = mouseY / all_li[index].children[0].offsetHeight * 100;
        // console.log(ul_child[index])
        // 设置图片的样式属性，实现局部放大效果
        all_li[index].children[0].style.transform = 'scale(' + scale + ')'; //放大缩小比例
        all_li[index].children[0].style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`; //放大缩小的局部相对位置  百分比格式
    });

};




// let all_ba_matrix=[]
// 实时发送请求 获取  OriginalImage DetectedItem 以及更新 违禁物品数量
function ju_model() {

    if (label.length > 0) {

        // setInterval(() => {

        //     let xhr = new XMLHttpRequest()
        //     xhr.onreadystatechange = function () {
        //         if (xhr.status === 200 && xhr.readyState === 4) {
        //             let res = JSON.parse(xhr.responseText)
        //             if (res) {  //有数据
        //                 let ba_matrix = []  //矩阵重置

        //                 OriginalImage.appendChild(res.args.OriginalImage) //获取主图片


        //                 if (res.args.DetectedItem.length > 0) {  //违禁物品信息添加
        //                     flages = 1;   //显示 true  medine false
        //                     for (let i = 0; i < res.args.DetectedItem.length; i++) {
        //                         DetectedItem.appendChild(res.args.DetectedItem[i])
        //                         let date = new Date()
        //                         let ul = document.createElement('ul')
        //                         ul.classList.add("add_info")
        //                         let id = document.createElement("li")
        //                         let name = document.createElement("li")
        //                         let position = document.createElement("li")
        //                         let confidence = document.createElement("li")
        //                         let time = document.createElement("li")

        //                         id.innerHTML = DetectedItem.length
        //                         name.innerHTML = res.args.DetectedItem[i].label
        //                         position.innerHTML = res.args.DetectedItem[i].coordinate
        //                         confidence.innerHTML = res.args.DetectedItem[i].confidence
        //                         time.innerHTML = date.getFullYear() + "\\" + (date.getMonth() + 1) + "\\" + date.getDate() + "\\" + date.getHours() + "\\" + date.getMinutes() + "\\" + date.getSeconds()
        //                         ul.appendChild(id)
        //                         ul.appendChild(name)
        //                         ul.appendChild(position)
        //                         ul.appendChild(confidence)
        //                         ul.appendChild(time)
        //                         statusList[1].prepend(ul)



        //                         // 获取坐标画矩阵    
        //                         // ba_matrix.appendChild(res.args.DetectedItem[i].coordinate)
        // // all_ba_matrix.appendChild(res.args.DetectedItem[i].coordinate)




        //                     }
        //                 } else {
        //                     flages = 0
        //                 }
        //                 warn()


        //                 // 每有一张新的OriginalImage就创建一次 

        //                 let li = document.createElement('li')
        //                 li.style.border = '1px solid #fff'
        //                 li.style.position = 'absolute'
        //                 let img = document.createElement("img")
        //                 img.src = OriginalImage[OriginalImage.length - 1]
        //                 for (let m = 0; m < ba_matrix.length; m++) {     //框线矩阵  违禁物品
        //                     let div = document.createElement("div")
        //                     div.style.position = 'absolute'
        //                     let [a, b, c, d] = [ba_matrix[m][0], ba_matrix[m][1], ba_matrix[m][2], ba_matrix[m][3]]
        //                     div.style.left = a + 'px'
        //                     div.style.top = b + 'px'
        //                     div.style.width = c - a + 'px'
        //                     div.style.height = d - b + 'px'
        //                     div.style.border = '1px solid red'
        //                     li.appendChild(div)
        //                 }
        //                 li.appendChild(img)
        //                 box_center_ul.appendChild(li)
        //                 box_center_ul.style.width = box_center_ul.children.length + 1 + "00%"
        //             } else {
        //                 console.log("无返回数据");
        //             }
        //         }
        //     }
        //     xhr.open("get", getQueryDataUrl())
        //     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        //     xhr.setRequestHeader("cmd", "SendResult");
        //     xhr.send()

        // }, 1000)
    } else {
        console.log("选择模型后无返回的label");
    }
}








// settings设置界面js

let confidence_sub = document.querySelector("#confidence")
let confidence_span = document.querySelector(".confidence_span")
let accuracy_sub = document.querySelector("#accuracy")
let accuracy_span = document.querySelector(".accuracy_span")


// change back
let back_color = document.querySelectorAll(".back_color div")
for (let j = 0; j < back_color.length; j++) {
    back_color[j].onclick = function () {

        background_color = back_color[j].style.background
        body.style.background = background_color
    }
}

// 粗细
let range = document.querySelector("#range")
let range_span = document.querySelector(".range_span")
let value = 1
range.addEventListener("input", function () {
    value = range.value / 10

    range_span.innerHTML = value
    ser.style.border = value + "px solid " + color


});


// 线框颜色
let linear_color_div = document.querySelectorAll(".linear_color div")
let ser = document.querySelector(".ser")
let color = linear_color_div[0].style.background
//    col()
for (let i = 0; i < linear_color_div.length; i++) {

    linear_color_div[i].onclick = function () {

        for (let z = 0; z < linear_color_div.length; z++) {
            linear_color_div[z].className = ''
        }
        linear_color_div[i].className = 'zt_on'
        ser.style.border = value + "px solid " + linear_color_div[i].style.background

        // col()
        color = linear_color_div[i].style.background

    }
}

//   confidence

confidence.addEventListener("input", function () {
    const value = confidence.value;
    confidence_span.innerHTML = value


});


//   iou  accuracy
accuracy.addEventListener("input", function () {
    const value = accuracy.value;
    accuracy_span.innerHTML = value

});


// 提交设置
// let xhr = new XMLHttpRequest()
// xhr.onreadystatechange = function () {
//     if (xhr.status === 200 && xhr.readyState === 4) {
//         let res = JSON.parse(xhr.responseText)
//         console.log(res);
//         // label= res.args.label
//         // statistics = res.args.statistics

//     }
// }
// xhr.open("get", `http://localhost:7899/QueryData`)
// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
// xhr.setRequestHeader("cmd", "UpdateSettings");
// xhr.setRequestHeader("confidence", confidence_sub.value);
// xhr.setRequestHeader("iou", accuracy_sub.value);
// xhr.setRequestHeader("BoxColor", color);
// xhr.setRequestHeader("BoxLineSize", value);
// xhr.send()



// 统计界面
(function () {

    // time
    let time_start = document.querySelector("#time_start")
    let time_end = document.querySelector("#time_end")

    time_start.onchange = function () {
        console.log(time_start.value);
    }
    time_end.onchange = function () {
        console.log(time_end.value);
    }
})();








echarts_1()
function echarts_1() {





    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));

    option = {

        grid: {
            left: '0%',
            top: '20px',
            right: '0%',
            bottom: '0',
            containLabel: true
        },
        xAxis: [{
            name: "类别",
            type: 'category',
            data: titlename,




            axisLabel: {
                interval: 0,
                // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
                    color: "rgba(255,255,255,.9)",
                    fontSize: '12',
                },
            },
        }],
        yAxis: [{

            name: "数量",
            type: 'value',
            axisLabel: {
                //formatter: '{value} %'
                // show: true,
                textStyle: {
                    color: "rgba(255,255,255,.9)",
                    fontSize: '12',
                },
            },


            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                }
            }
        }],
        series: [
            {

                type: 'bar',
                data: titlenum,
                data: [34, 55],
                barWidth: '35%', //柱子宽度
                // barGap: 1, //柱子之间间距
                itemStyle: {
                    normal: {
                        color: '#27d08a',
                        opacity: 1,
                        barBorderRadius: 5,

                    }
                },
                label: {
                    show: true,
                    position: 'top', // 设置标签显示在柱形顶部
                    textStyle: {
                        color: "#fff" // 设置标签文本颜色为白色
                    }
                }
            }

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
};







echarts_3()
function echarts_3() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart3'));
    option = {
        legend: {
            //orient: 'vertical',
            top: '20',
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            data: titlename,
            textStyle: {
                color: 'rgba(255,255,255,.5)',
                fontSize: '12',
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 500,
            max: 600,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series: [{
            name: '分布',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '60%'],
            color: ['#0086e5', '#30c5ed', '#9fe7b8', '#fedb5b', '#ff9f7d', '#fb7293', '#e7bcf2'], //'#FBFE27','rgb(11,228,96)','#FE5050'
            data: data_pie,    //此处为数据 格式为 { "name": 类别, "value": 值 }
            roseType: 'radius',

            label: {
                normal: {
                    formatter: ['{d|{d}%}', '{b|{b}}'].join('\n'),
                    rich: {
                        d: {
                            color: 'rgb(241,246,104)',
                            fontSize: 14,
                            fontWeight: 'bold',

                        },
                        b: {
                            color: 'rgb(98,137,169)',
                            fontSize: 12,

                        },
                    },
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgb(98,137,169)',
                    },
                    smooth: 0.2,
                    length: 5,
                    length2: 9,

                }
            },
            itemStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 50,
                }
            }
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.addEventListener("resize", function () {
        myChart.resize();
    });
}










