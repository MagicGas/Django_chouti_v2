from django.shortcuts import render,redirect
from django.http import HttpResponse
import json
from app import models

from form.form import  User_register

from django import forms
# Create your views here.
def index(request):
    try:
        if request.session["user_session"]:
            show_news ={}
            current_user = request.session["user_session"]["login_user"]
            user_obj = models.User.objects.filter(username=current_user).first()
            if user_obj.news_set.all():
                user_dianzan = models.User.objects.get(username=current_user)
                for item_page in user_obj.news_set.all():
                    dianzan_status = models.Dianzan.objects.filter(news=item_page, user=user_dianzan).first()
                    print(dianzan_status,type(dianzan_status))
                    if dianzan_status:
                        show_news[str(item_page.id)]={
                            "dianzan_status":dianzan_status.status,
                            "id":item_page.id,
                            "title":item_page.title,
                            "content":item_page.title,
                        }
                    else:
                        show_news[str(item_page.id)] = {
                            "id": item_page.id,
                            "title": item_page.title,
                            "content": item_page.title,
                        }
                    print(show_news)
                return render(request, "app/index.html",{"show_news":show_news})
            else:
                return render(request, 'app/index.html')
    except:
        return render(request,'app/index.html')

def register(request):
    form_dict={
        "status":"OK",
        "data":{}
    }
    if request.method =="POST":
        f = User_register(request.POST)
        if f.is_valid():
            user_info = {
                "username":f.cleaned_data["username"],
                "password":f.cleaned_data['password'],
                'email':f.cleaned_data['email']
            }
            if models.User.objects.filter(username=f.cleaned_data["username"]).first():
                form_dict['data']["status"]="error"
                form_dict['data']["user_info"]="该用户名已经存在"
            elif models.User.objects.filter(email=f.cleaned_data['email']).first():
                form_dict['data']["status"] = "error"
                form_dict['data']["email_info"] = "该邮箱已经被注册了"
            else:
                models.User.objects.create(**user_info)
                form_dict['status']="OK"
                form_dict['data']['status']="OK"
            return HttpResponse(json.dumps(form_dict))
        else:
            form_dict['status'] = "ERROR"
            form_dict['data'] = f.errors
            return HttpResponse(json.dumps(form_dict))
    else:
        return redirect("/index/")
def login(request):
    if request.method == "POST":
        login_info ={
            "status":"",
            "info":""
        }
        username = request.POST.get("username",None)
        password = request.POST.get("password",None)
        if models.User.objects.filter(username=username,password=password).first():
            login_info["status"] ="success"
            login_info["info"] = "登录成功"
            request.session["user_session"] = {
                "login_status":"online",
                "login_user":username
            }
            request.session.set_expiry(3600)
            return  HttpResponse(json.dumps(login_info))
        else:
            login_info["status"] = "failed"
            login_info["info"] = "用户名或密码错误"
            return HttpResponse(json.dumps(login_info))
    else:
        return redirect("/index/")
def exit_user(request):
    if request.method=="POST":
        if request.POST.get("exit_user",None):
            del request.session["user_session"]
            return HttpResponse("exit success")
    else:
        return  redirect("/index/")