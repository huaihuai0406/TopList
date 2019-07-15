$(document).ready(function () {
    allArticle();
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
    var div = '<article class="post post-1">\n' +
        '\t\t\t\t\t\t\t<header class="entry-header">\n' +
        '\t\t\t\t\t\t\t\t<h1 class="entry-title">\n' +
        '\t\t\t\t\t\t\t\t\t<a href="single.html?id='+item.article_id+'"><span id="article_title">'+item.article_title+'</span></a>\n' +
        '\t\t\t\t\t\t\t\t</h1>\n' +
        '\t\t\t\t\t\t\t\t<div class="entry-meta">\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-category"><a href="#">'+item.type+'</a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-date"><a href="#"><time class="entry-date" datetime="2012-11-09T23:15:57+00:00">'+date+'</time></a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="post-author"><a href="#">'+item.article_author+'</a></span>\n' +
        '\n' +
        '\t\t\t\t\t\t\t\t\t<span class="comments-link"><a href="#">'+item.view+' viewed</a></span>\n' +
        '\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t</header>\n' +
        '\t\t\t\t\t\t\t<div class="entry-content clearfix">\n' +
        '\t\t\t\t\t\t\t\t<div class="showLessWord">'+content+"....."+'\n' +
        '\t\t\t\t\t\t\t\t</div><div class="read-more cl-effect-14">\n' +
        '\t\t\t\t\t\t\t\t\t<a href="single.html?id='+item.article_id+'" class="more-link">Continue reading <span class="meta-nav">→</span></a>\n' +
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
            addCode = '<li class="next"><a href="full-width.html?type='+type+'&page='+nextPage+'">&rarr; 下一页</a></li>'
        } else {
            addCode = '<li class="next"><a href="full-width.html?page='+nextPage+'">&rarr; 下一页</a></li>'
        }
    } else if (nextPage > totalPage) {
        if (type !== null) {
            addCode = '<li class="previous"><a href="full-width.html?type='+type+'&page='+lastPage+'">&larr; 上一页</a></li>'
        } else {
            addCode = '<li class="previous"><a href="full-width.html?page='+lastPage+'">&larr; 上一页</a></li>'

        }

    } else {
        if (type !== null) {
            addCode = '<li class="previous"><a href="full-width.html?type='+type+'&page='+lastPage+'">&larr; 上一页</a></li>\n' +
                '\t\t\t\t\t\t\t\t<li class="next"><a href="full-width.html?type='+type+'&page='+nextPage+'">下一页 &rarr;</a></li>'
        } else {
            addCode = '<li class="previous"><a href="full-width.html?page='+lastPage+'">&larr; 上一页</a></li>\n' +
                '\t\t\t\t\t\t\t\t<li class="next"><a href="full-width.html?page='+nextPage+'">下一页 &rarr;</a></li>'
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
    $.ajax({
        url:ServerIp+"/GetArticles",
        type:"POST",
        async:true,
        data:{page:function () {
                var a = null;
                var page = getParam("page");
                console.log(page);
                if (getParam("page") !== null&&getParam("page") !== undefined){
                    a = getParam("page")
                }else {
                    a = 1
                }
                return a;
            },
            type:type
        },
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
                var noApplicationRecord = document.getElementById('mainArticle')
                noApplicationRecord.innerHTML = html
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}


