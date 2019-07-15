$(document).ready(function () {
    singleArticle();
});

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

function singleArticle(){
    $.ajax({
        url:ServerIp+"/GetArticleDetail",
        type:"POST",
        async:true,
        data:{id:getParam("id"),token:getParam("token")},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            if (data['Code'] == 0){
                var date = timetrans(data['Data'][0]['article_create_at']);
                $(".entry-title").html(data['Data'][0]['article_title'])
                $(".post-date").html(date)
                $(".post-category").html(data['Data'][0]['type'])
                $(".post-author").html(data['Data'][0]['article_author'])
                $(".comments-link").html(data['Data'][0]['view']+" viewed")
                $("#articleId").val(data['Data'][0]['article_id'])
                // !;(MISSING)
                var content = data["Data"][0]['article_content'];
                content = content.replaceAll("!"," ");
                content = content.replaceAll("100%","100%;");
                content = content.replaceAll("30%","30%;");
                content = content.replaceAll("50%","50%;");
                $(".entry-content").html(content)
                $(".entry-meta").show()
                getComments();
            }else {
                needReadPSW(getParam("id"),data['Message'])
            }
        },
        error:function () {
            layer.msg('网络延迟，请重试', {icon:7,time:2000});
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
                layer.msg('网络延迟，请重试', {icon:7,time:2000});
            }else {
                setCategory(data['Data']['articleType']);
                setTopArticle(data['Data']['topArticle']);
            }
        },
        error:function () {
            layer.msg('网络延迟，请重试', {icon:7,time:2000});
        }
    })
}

function setCategory(object) {
    var code = "";
    for (var i in object) {
        code += '<li>\n' +
            '\t\t\t\t\t\t\t\t\t<a href="full-width.html?type='+object[i].name+'">'+object[i].name+'</a>\n' +
            '\t\t\t\t\t\t\t\t</li>'
    }
    var noApplicationRecord = document.getElementById('categoryUl')
    noApplicationRecord.innerHTML = code

}

function setTopArticle(object) {
    var code = "";
    for (var i in object) {
        code += '<li>\n' +
            '\t\t\t\t\t\t\t\t\t<a href="single.html?id='+object[i].article_id+'">'+object[i].article_title+'</a>\n' +
            '\t\t\t\t\t\t\t\t</li>'
    }
    var noApplicationRecord = document.getElementById('topArticle')
    noApplicationRecord.innerHTML = code
}

function addArticleComment() {
    var name = $("#name").val()
    var email = $("#email").val()
    var content = $("#message").val()
    var id = $("#articleId").val()
    var comment_id = $("#comment_id").val()
    if (name.length <1 ||name.length >=10 || email.length < 5 || email.length >=20 || content.length <1 || content.length>=250) {
        layer.msg('请输入正确内容', {icon:7,time:2000});
        return
    }
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    isok= reg.test(email);
    if (!isok) {
        layer.msg('邮箱格式错误', {icon:7,time:2000});
        return;
    }
    $.ajax({
        url:ServerIp+"/AddComment",
        type:"POST",
        async:true,
        data:{name:name,email:email,content:content,id:id,comment_id:comment_id},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            if (data['Code']!=0){
                alert(data["Message"]);
            }else {
                $("#name").val("")
                $("#email").val("")
                $("#message").val("")
                layer.msg('评论成功', {icon:6,time:2000});
            }
        },
        error:function () {
            layer.msg('网络延迟，请重试', {icon:7,time:2000});
        }
    })
}

function getComments() {
    $.ajax({
        url:ServerIp+"/GetComments",
        type:"POST",
        async:true,
        data:{id:getParam("id")},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            var allCode = '';
            if (data['Code']!=0){
                alert(data["Message"]);
            }else {
                if (data["Data"].length !== 0) {
                    $("#commentTitle").css("display","inline")
                }
                for (var i in data['Data']) {
                   allCode += setCommentDiv(data['Data'][i],data['Data'])
                }
            }
            var noApplicationRecord = document.getElementById('AllCommentCode')
            noApplicationRecord.innerHTML = ''
            noApplicationRecord.innerHTML = allCode
        },
        error:function () {
            layer.msg('网络延迟，请重试', {icon:7,time:2000});
        }
    })
}

function setCommentDiv(object,allData) {
    //console.log(object.comment_id)
    if (object.comment_id !== '0') {
        return "";
    }
    var data = getSonComments(object,allData)
    return makeDivCode(data)
}

function getSonComments(object,AllData) {
    var endData = [];
    endData.push(object)
    for (var i in AllData) {
        if (object.id === AllData[i].comment_id) {
            endData.push(AllData[i]);
            object = AllData[i]
        }
    }
    return endData
}

function makeDivCode(data) {
    var sonCode = '';
    for (var i in data) {
        if (data[i].comment_id !== '0') {
            sonCode += '<!-- 内嵌多媒体对象 -->\n' +
                '\t\t\t\t\t\t\t\t\t\t<div class="media">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="media-left">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<img src="http://p0.jmstatic.com/jmstore/user/icon/cat_200_200.png" class="media-object img-circle" style="width:45px">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="media-body">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<h5 class="media-heading">'+data[i].name+' 回复:</h5>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<h4>'+data[i].comment+'<br> <small><span class="glyphicon glyphicon-calendar"></span>Posted on '+data[i].date+' <span class="glyphicon glyphicon-edit"></span><a onclick="noticeInput(this)" type="'+data[i].id+'" href="#myComment">回复</a></small></h4>  \n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<!-- 内嵌多媒体对象 -->\n' +
                '\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t</div>';
        }
    }
    var parentCodebegin = '<div class="media">\n' +
        '\t\t\t\t\t\t\t\t\t<div class="media-left">\n' +
        '\t\t\t\t\t\t\t\t\t\t<img src="http://p0.jmstatic.com/jmstore/user/icon/cat_200_200.png" class="media-object img-circle" style="width:45px">\n' +
        '\t\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t\t\t<div class="media-body">\n' +
        '\t\t\t\t\t\t\t\t\t\t<h5 class="media-heading">'+data[0].name+' 评论:</h5>\n' +
        '\t\t\t\t\t\t\t\t\t\t<h4>'+data[0].comment+'<br> <small><span class="glyphicon glyphicon-calendar"></span>Posted on '+data[0].date+' <span class="glyphicon glyphicon-edit"></span><a onclick="noticeInput(this)" type="'+data[0].id+'" href="#myComment">回复</a></small></h4> \n'
    var parentCodeEnd = '</div>\n' +
        '\t\t\t\t\t\t\t\t</div>';
    return parentCodebegin+sonCode+parentCodeEnd;
}




function noticeInput(object) {
    $("#comment_id").val(object.type)
    //console.log(object.type)
    doShake("name")
}

function needReadPSW(id,question) {
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




