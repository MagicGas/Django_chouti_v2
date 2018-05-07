/* 登录注册的代码*/
$(function() {
    //注册的js代码
    $("#register_button").click(function () {
        var username_re =$("#username-re").val();
        var password_re =$("#passowrd-re").val();
        var email_re = $("#email-re").val();
        $.ajax({
            url:"/register/",
            type:"POST",
            datatype:"json",
            data:{
                CsrfViewMiddleware: '{{ csrf_token }}',
                "username":username_re,
                "password":password_re,
                'email':email_re
            },
            success:function (ret) {
                var form_dict = JSON.parse(ret);
                if(form_dict["status"]=="OK"){
                    if(form_dict['data']['status']=="error"){
                        $("#pwd_re_error").text("");
                        $("#user_re_error").text("").text(form_dict['data']["user_info"]).css("color","red");
                        $("#email_re_error").text("").text(form_dict['data']["email_info"]).css("color","red");
                    }
                    else {
                        $("#username-re").val("");
                        $("#passowrd-re").val("");
                        $("#email-re").val("");
                        $("#user_re_error").text("");
                        $("#email_re_error").text("");
                        alert("注册成功");
                        $("#register_cancle").click();
                    }


                }
                else {
                    var error_dict = form_dict["data"];
                    console.log(typeof error_dict,error_dict);
                    var user_error_info = error_dict['username'];
                    var pwd_error_info = error_dict['password'];
                    var email_error_info = error_dict['email'];
                    if(user_error_info || pwd_error_info || email_error_info){
                        $("#user_re_error").text("").text(user_error_info).css("color","red");
                        $("#pwd_re_error").text("").text(pwd_error_info).css("color","red");
                        $("#email_re_error").text("").text(email_error_info).css("color","red");
                    }
                }

            },
            error:function () {
                alert("注册失败")
            }

        });
    });

    //注册取消后清理报错信息
    $("#register_button_cancle").click(function () {
        $("#username-re").val("");
        $("#passowrd-re").val("");
        $("#email-re").val("");
        $("#user_re_error").text("");
        $("#email_re_error").text("");
        $("#pwd_re_error").text("")
    });

    /*登录的js代码 */
    $("#login_button").click(function () {
        var user_login=$("#username-lo").val();
        var pwd_login=$("#passowrd-lo").val();
        if (user_login==""){
            $("#user_login_error").text("").text("用户名不能为空").css("color","red");
            $("#login_failed").text("")
        }
        if(pwd_login == ""){
            $("#pwd_login_error").text("").text("密码不能为空").css("color","red");
            $("#login_failed").text("")
        }
        else {
            $("#user_login_error").text("");
            $("#pwd_login_error").text("");
            $.ajax({

                url:"/login/",
                type:"POST",
                data:{
                    CsrfViewMiddleware: '{{ csrf_token }}',
                    "username":user_login,
                    "password":pwd_login
                },
                success:function (ret) {
                    var login_info = JSON.parse(ret);
                    if(login_info["status"] == "success"){
                        $("#login_cancel").click();
                        $("#username-lo").val("");
                        $("#passowrd-lo").val("");
                        location.reload(true);
                    }
                    else {
                        $("#login_failed").text(login_info["info"]).css("color","red")
                        $("#username-lo").val("");
                        $("#passowrd-lo").val("");
                    }
                },
                error:function () {
                    alert("登录失败")
                }
            });
        }

    });

    //登录取消后清理报错信息
    $("#login_button_cancle").click(function () {
        $("#login_failed").text("")
        $("#user_login_error").text("");
        $("#pwd_login_error").text("");
        $("#username-lo").val("");
        $("#passowrd-lo").val("");
    });
    
    $("#exit_user").click(function () {
        $.ajax({

            url:"/exit_user/",
            type:"POST",
            data:{
                CsrfViewMiddleware: '{{ csrf_token }}',
                "exit_user":true
            },
            success:function (ret) {
                alert("已经退出");
                location.reload(true);
            },
            error:function () {

            }

        })
    });
});

/*发布文章的代码*/
$(function () {
    $("#new_news_button").click(function () {
        var new_title = $("#news_title").val();
        var new_content = $("#news_content").val();
        var current_user = $("#current_user").val();
        if (new_title.length === 0 && new_content.length !==0 ){
            $("#title_error").text("").text("标题不能为空").css("color","red");
            $("#content_error").text("");
            }
        if (new_content.length ===0 && new_title.length !== 0){
            $("#content_error").text("").text("内容不能为空").css("color","red");
            $("#title_error").text("");
            }
        if (new_content.length ===0 && new_title.length === 0){
            $("#title_error").text("").text("标题不能为空").css("color","red");
            $("#content_error").text("").text("内容不能为空").css("color","red");
            }
        if(new_content.length !==0 && new_title.length !== 0) {
            $("#title_error").text("");
            $("#content_error").text("");
            $.ajax({
                url:"/new_news/",
                data:{
                    "current_user":current_user,
                    "title":new_title,
                    "content":new_content
                },
                type:"POST",
                success:function (ret) {
                    rep_info = JSON.parse(ret);
                    if (rep_info["status"]){
                        $("#publish_error").text("");
                        alert("发布成功");
                        $("#new_news_button_cancle").click();
                        location.reload(true);
                    }
                    else {
                        $("#publish_error").text("发布失败").css("color","red")
                    }
                },
                error:function () {
                    alert("发布失败")
                }

            });
            }
    });

});

function NoLogin() {
    alert("请先登录")

}

function Dianzan(ths) {
    var news_id = $(ths).parent().parent().children().eq(0).val();
    var current_user = $(ths).prev().val();
    var temp = $(ths);
    $.ajax({
        url:"/dianzan/",
        type:"POST",
        data:{
            "news_id":news_id,
            "current_user":current_user
        },
        success:function (ret) {
            var rep_data = JSON.parse(ret);
            if(rep_data["status"]===true){
                alert("点赞成功");
                 $(ths).css("background-position","0 -18px")
            }
            else {
                if(rep_data["reason"]==="news-non-exist"){
                    alert("文章不存在了")
                }
                if(rep_data["reason"]==="no-login"){
                    alert("请先登录")
                }
                if(rep_data["reason"]==="already"){
                    alert("这篇文章您已经点过赞了哦")
                }
            }
        },
        error:function () {
           alert("点赞失败")
        }
    })
}