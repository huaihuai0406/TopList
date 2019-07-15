$(document).ready(function () {
    allArticle();
    setSlider();
    //addTags();
});

function addTags() {
    $.ajax({
        url:ServerIp+"/ChatRobot/tags",
        type:"POST",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            for (var i in data['data']){
                console.log(i);
                $("#tag").find("a").html(data['data'][i].tag_name)
                $("#tag-ul").append($("#tag").html());
            }
            // console.log(data['data']['0'].tag_name);
            // $("#tag").find("a").html("data")

        },
        error:function () {
            console.log("失败");
        }
    })
}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

//绘制单个div
function setDiv(item){
    var content = item.article_content;
    content = content.replaceAll("!"," ");
    content = content.replaceAll("100%","100%;");
    content = content.replaceAll("30%","30%;");
    content = content.replaceAll("50%","50%;");
    var date = timetrans(item.article_create_at);
    var href = 'single.html?id='+item.article_id+''
    var click = "#"
    // 处理特殊密码访问
    if (item.isSecret === '1') {
        var value = item.article_id+','+'\''+item.question+'\'';
        click = 'needPSW('+value+')';
        href = "#"
    }
    var div = '<article class="post post-1">\n' +
        '\t\t\t\t\t\t\t<header class="entry-header">\n' +
        '\t\t\t\t\t\t\t\t<h1 class="entry-title">\n' +
        '\t\t\t\t\t\t\t\t\t<a onclick="'+click+'" href="'+href+'"><span id="article_title">'+item.article_title+'</span></a>\n' +
        '\t\t\t\t\t\t\t\t</h1>\n' +
        '\t\t\t\t\t\t\t\t<div class="entry-meta">\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-category"><a href="full-width.html?type='+item.type+'">'+item.type+'</a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-date"><a href="time-line.html"><time class="entry-date" datetime="2012-11-09T23:15:57+00:00">'+date+'</time></a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-author"><a href="about.html">'+item.article_author+'</a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="comments-link"><a href="#">'+item.view+' viewed</a></span>\n' +
        '\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t</header>\n' +
        '\t\t\t\t\t\t\t<div class="entry-content clearfix">\n' +
        '\t\t\t\t\t\t\t\t<div class="showLessWord">'+content+'.....'+'\n' +
        '\t\t\t\t\t\t\t\t</div><div class="read-more cl-effect-14">\n' +
        '\t\t\t\t\t\t\t\t\t<a onclick="'+click+'" href="'+href+'" class="more-link">Continue reading <span class="meta-nav">→</span></a>\n' +
        '\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t</article>'
    return div
}
//循环加载到页面
function getnoApplicationData(){
    var html = ''
    for(var i = 0;i<data.length;i++){
        html += setDiv(data[i])
    }
    noApplicationRecord.innerHTML = html
}

var getParam = function(name){
    var search = document.location.search;
    var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    var items = null;
    if(null != matcher){
        try{
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        }catch(e){
            try{
                items = decodeURIComponent(matcher[1]);
            }catch(e){
                items = matcher[1];
            }
        }
    }
    return items;
};

function setPageNumber(currentPage,totalPage,type) {
    var lastPage = currentPage - 1
    var nextPage = currentPage + 1
    var addCode = ''
    if (lastPage <= 0) {
        if (type !== null) {
            addCode = '<li class="next"><a href="index.html?type='+type+'&page='+nextPage+'">&rarr; 下一页</a></li>'
        } else {
            addCode = '<li class="next"><a href="index.html?page='+nextPage+'">&rarr; 下一页</a></li>'
        }
    } else if (nextPage > totalPage) {
        if (type !== null) {
            addCode = '<li class="previous"><a href="index.html?type='+type+'&page='+lastPage+'">&larr; 上一页</a></li>'
        } else {
            addCode = '<li class="previous"><a href="index.html?page='+lastPage+'">&larr; 上一页</a></li>'

        }

    } else {
        if (type !== null) {
            addCode = '<li class="previous"><a href="index.html?type='+type+'&page='+lastPage+'">&larr; 上一页</a></li>\n' +
                '\t\t\t\t\t\t\t\t<li class="next"><a href="index.html?type='+type+'&page='+nextPage+'">下一页 &rarr;</a></li>'
        } else {
            addCode = '<li class="previous"><a href="index.html?page='+lastPage+'">&larr; 上一页</a></li>\n' +
                '\t\t\t\t\t\t\t\t<li class="next"><a href="index.html?page='+nextPage+'">下一页 &rarr;</a></li>'
        }
    }
    var pageHtml = document.getElementById("pageCode")
    pageHtml.innerHTML = addCode
}


function allArticle() {
    var type = getParam("type")
    if (type !== null&&type !== undefined){
        console.log(type)
    } else {
        type = null
    }
    var noApplicationRecord = document.getElementById('mainArticle')
    $.ajax({
        url:ServerIp+"/GetArticles",
        type:"POST",
        async:true,
        data:{page:function () {
                var a = null;
                if (getParam("page") !== null&&getParam("page") !== undefined){
                    a = getParam("page")
                }else {
                    a = 1
                }
                return a;
            },type:type},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            setPageNumber(data['Data']['currentPage'],data['Data']['totalPage'],type)
            if (data['Code']!=0){
                alert("请重试");
            }else {
                var html = ''
                for (var i in data['Data']['rows']){
                    html += setDiv(data['Data']['rows'][i])
                }
                noApplicationRecord.innerHTML = html
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}

// GetCategories
function setSlider() {
    $.ajax({
        url:ServerIp+"/GetCategories",
        type:"POST",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            if (data['Code']!=0){
                alert("请重试");
            }else {
                console.log(data);
                setCategory(data['Data']['articleType']);
                setTopArticle(data['Data']['topArticle']);
                setByTime(data['Data']['byDate']);
                setFriendUrl(data["Data"]['friendURL']);
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}

function setByTime(object) {
    var code = ""
    for (var i in object) {
        code += '<li>\n' +
            '\t\t\t\t\t\t\t\t\t\t<a href="time-line.html#'+object[i].time+'">'+object[i].date+' ('+object[i].num+')</a>\n' +
            '\t\t\t\t\t\t\t\t\t</li>'
    }
    console.log(code)
    var mainBody = document.getElementById("byTime")
    mainBody.innerHTML = code
}

function setCategory(object) {
    var code = "";
    for (var i in object) {
        code += '<li>\n' +
            '\t\t\t\t\t\t\t\t\t<a  href="full-width.html?type='+object[i].type+'">'+object[i].type+' ('+object[i].num+')</a>\n' +
            '\t\t\t\t\t\t\t\t</li>'
    }
    var noApplicationRecord = document.getElementById('categoryUl')
    noApplicationRecord.innerHTML = code

}

function setTopArticle(object) {
    var code = "";
    for (var i in object) {
        console.log(object[i].article_title)
        code += '<li>\n' +
            '\t\t\t\t\t\t\t\t\t<a href="single.html?id='+object[i].article_id+'">'+object[i].article_title+'</a>\n' +
            '\t\t\t\t\t\t\t\t</li>'
    }
    var noApplicationRecord = document.getElementById('topArticle')
    noApplicationRecord.innerHTML = code
}

function hiddenThis() {
    $("#myCollapsibleExample").hide()
}

function setFriendUrl(object) {
    var code = "";
    var hiddenCode = "";
    for (var i in object) {
        if (i < 5) {
            code += '<li>\n' +
                '\t\t\t\t\t\t\t\t\t<a target="_blank" href="'+object[i].url+'">'+object[i].name+'</a>\n' +
                '\t\t\t\t\t\t\t\t</li>'
        } else {
            hiddenCode += '<li>\n' +
                '\t\t\t\t\t\t\t\t\t<a target="_blank" href="'+object[i].url+'">'+object[i].name+'</a>\n' +
                '\t\t\t\t\t\t\t\t</li>'
        }

    }
    var noApplicationRecord = document.getElementById('myFriendUrl')
    noApplicationRecord.innerHTML = code

    var noApplicationRecord = document.getElementById('demo')
    noApplicationRecord.innerHTML = hiddenCode
}

function needPSW(id,question) {
    var code = '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">该篇文章涉及博主私密信息，回答问题可见<form>\n' +
        '  <div class="form-group">\n' +
        '    ' +
        '    <input type="text" class="form-control" id="getSecretToken" placeholder="'+question+'">\n' +
        '  </div>' +
        '</form>' +
        '</div>';
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: true
        ,area: '400px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,resize: false
        ,btn: ['确认访问', '放弃访问']
        ,btnAlign: 'c'
        ,moveType: 1 //拖拽模式，0或者1
        ,content: code
        ,yes: function(index, layero){
            $.ajax({
                url:ServerIp+"/GetToken",
                type:"POST",
                async:true,
                data:{id:id,psw:document.getElementById("getSecretToken").value},
                timeout:5000,
                dataType:'json',
                success:function (data) {
                    if (data['Code']!=0){
                        document.getElementById("getSecretToken").value = "密码错误请重试"
                    }else {
                        window.location.href = 'single.html?id='+id+"&token="+data['Data']
                    }
                },
                error:function () {
                    console.log("失败");
                }
            })
        },
    });
}


