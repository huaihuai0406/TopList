$(document).ready(function () {
    getHotInfo()
});
function getHotInfo() {
    $.ajax({
        url:ServerIp+"/GetType",
        type:"GET",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            // if (data['code']!=0 && data['Code'] != 0){
            //     alert("获取失败")
            // }else {
            //     if (data['Data'] !== undefined) {
            //         myCode = setEachInfo(data['Data'])
            //     } else {
            //         myCode = setEachInfo(data['data'])
            //     }
            //
            // }
            if (data['code']!=0 && data['Code'] != 0){
                alert("获取失败")
            }else {
                    if (data['Data'] !== undefined) {
                        setBar(data['Data'])
                    } else {
                        setBar(data['data'])
                    }
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}

function setBar(object) {
    var code = '';
    var bodyCode = '';
    for (var i in object) {
        code += '<li role="presentation"><a type="'+object[i].id+'" onclick="getOwnInfo(this)" href="#'+object[i].id+'" aria-controls="profile" role="tab" data-toggle="tab">'+object[i].title+'</a></li>';
        if (i == 0) {
            // tab-pane active
            var infoCode = getListInfo(object[i].id)
            console.log(infoCode)
            bodyCode += '<div role="tabpanel" class="tab-pane active" id="'+object[i].id+'"><div class="b-list"><div class="ant-list ant-list-split ant-list-bordered"><div class="ant-spin-nested-loading"><div class="ant-spin-container" id="myOnlyInfo'+object[i].id+'">'+infoCode+'</div></div></div></div></div>';
        } else {
            bodyCode += '<div role="tabpanel" class="tab-pane" id="'+object[i].id+'"><div class="b-list"><div class="ant-list ant-list-split ant-list-bordered"><div class="ant-spin-nested-loading"><div class="ant-spin-container" id="myOnlyInfo'+object[i].id+'"></div></div></div></div></div>';
        }

    }
    var noApplicationRecord = document.getElementById('myHotBar')
    noApplicationRecord.innerHTML = code
    var bodyHtmlCode = document.getElementById('tab-content')
    bodyHtmlCode.innerHTML = bodyCode
    //layer.msg('见到你很开心，欢迎来到今日热榜',{time:2000});
}

function getOwnInfo(item) {
    var code = getListInfo(item.type)
    var id="myOnlyInfo"+item.type
    var bodyHtmlCode = document.getElementById(id)
    bodyHtmlCode.innerHTML = code
}

function getListInfo(id) {
    if (id == '101') {
        return `<div class="form-horizontal">
<br>
<br>
<br>
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">您的尊称</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="vUrl" placeholder="昵称或者联系方式">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">宝贵建议</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="vWord" placeholder="其实是重金求意见，比如还希望博主抓取其他网站，数据更新频率，用户体验啥的，欢迎留言">
    </div>
  </div>
 
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button onclick="addVUrl()" id="vButton" class="btn btn-default">提交</button>
      <br>
      <br>
      <br>
    </div>
  </div>
</div>`;
    }
    var url = ServerIp+'/GetTypeInfo';
    var myCode = ''
    $.ajax({
        url:url,
        type:"GET",
        async:false,
        data:{id:id},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            if (data['code']!=0 && data['Code'] != 0){
                alert("获取失败")
            }else {
                if (data['Data'] !== undefined) {
                    myCode = setEachInfo(data['Data'])
                } else {
                    myCode = setEachInfo(data['data'])
                }

            }
        },
        error:function () {
            console.log("失败");
        }
    })
    return myCode
}

function addVUrl() {
    $("#vButton").attr("disabled", "disabled");
    var name = $("#vUrl").val()
    var email = $("#vWord").val()
    if (name.length <1 ||name.length >=80 || email.length < 5 || email.length >=40) {
        layer.msg('请输入正确内容', {icon:7,time:2000});
        $("#vButton").removeAttr("disabled","true");
        return
    }
    $.ajax({
        url:ServerIp+"/AddVUrl",
        type:"POST",
        async:true,
        data:{vUrl:name,vWord:email},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            if (data['Code']!=0){
                alert(data["Message"]);
                $("#vButton").removeAttr("disabled","true");
            }else {
                $("#vUrl").val("")
                $("#vWord").val("")
                layer.msg('添加成功，审核后展示', {icon:6,time:2000});
                $("#vButton").removeAttr("disabled","true");
            }
        },
        error:function () {
            layer.msg('网络延迟，请重试', {icon:7,time:2000});
            $("#vButton").removeAttr("disabled","true");
        }
    })
}

function setEachInfo(object) {
    var allInfo = ''
    var count = 1
    for (var i in object) {
        allInfo += '<div class="ant-list-item">\n' +
            '    <div class="ant-list-item-meta">\n' +
            '        <div class="ant-list-item-meta-content">\n' +
            '            <h4 class="ant-list-item-meta-title">\n' +
            '                <div><span>'+count+'.&nbsp;</span><a href="'+object[i].url+'" target="_blank">'+object[i].title+'</a>\n' +
            '                </div>\n' +
            '            </h4>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
        count += 1
    }
    return allInfo
}

function openGirl() {
    L2Dwidget.init();
}

function noticeOpenGirl() {
    layer.tips('开启萌萌哒看板娘~', '#openGirl', {
        tips: [1, '#0FA6D8'], //还可配置颜色
        time:1000
    });
}