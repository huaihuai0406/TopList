$(document).ready(function () {
    setTimeLine()
});

//绘制单个div
function setDiv(item,year){
    console.log(year + "this" +item.year)
    var node = '<li class="title">\n' +
        '                            '+item.year+'\n' +
        '                        </li>';
    var single = ' <li id="'+item.time+'"><span class="time"> '+item.date+'</span><span class="dot bg-success"></span>\n' +
        '                            <div class="content"><h3 class="subtitle"><a href="single.html?id='+item.article_id+'">'+item.article_title+'</a></h3>\n' +
        '                                <p>'+item.article_content+'.....</p></div>\n' +
        '                        </li>';
    if (year === null || year === undefined) {
        return node + single
    }
    if (year !== item.year) {
        return node + single
    } else {
        return single
    }
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


function setTimeLine() {
    var type = getParam("type")
    if (type !== null&&type !== undefined){
        console.log(type)
    } else {
        type = null
    }
    $.ajax({
        url:ServerIp+"/GetTimeLine",
        type:"POST",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
           // setPageNumber(data['Data']['currentPage'],data['Data']['totalPage'],type)
            if (data['Code']!=0){
                alert("请重试");
            }else {
                var html = ''
                var oldYear = undefined
                for (var i in data['Data']){
                    var lastData = data['Data'][i -1 ]
                    if (lastData !== undefined) {
                       oldYear = lastData.year
                    }
                    html += setDiv(data['Data'][i],oldYear)
                }
                var noApplicationRecord = document.getElementById('myTimeLine')
                noApplicationRecord.innerHTML = html
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}


