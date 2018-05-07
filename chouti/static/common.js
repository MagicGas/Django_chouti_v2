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