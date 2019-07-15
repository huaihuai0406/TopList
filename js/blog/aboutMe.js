$(document).ready(function () {
    setAboutMe();
});

function setAboutMe() {
    $.ajax({
        url:ServerIp+"/AboutMe",
        type:"POST",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            console.log(data);
            if (data['Code'] == 0){
                $(".page-title").text(data['Data'][0]['article_title'])
                var content = data["Data"][0]['article_content'];
                content = content.replaceAll("%!","%");
                content = content.replaceAll("100%","100%;");
                content = content.replaceAll("30%","30%;");
                content = content.replaceAll("50%","50%;");
                $(".MyAboutMe").html(content)
            }else {
                alert("获取失败，请重试");
            }
        },
        error:function () {
            console.log("失败");
        }
    })
}