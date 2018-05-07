#!/usr/bin/env python
# -*- conding:utf-8 -*-

from django.shortcuts import render,redirect
from django.http import HttpResponse
import datetime
import json
from app import models
from app.views import account

def new_news(request):
    rep_info = {
        "status":"",
    }
    if request.method == "POST":
        current_user = request.POST.get("current_user",None)
        title = request.POST.get("title",None)
        content = request.POST.get("content",None)
        data = {
            "title":title,
            "content":content,
            "author":models.User.objects.filter(username=current_user).first(),
            "ctime":datetime.datetime.now()
        }
        if models.News.objects.create(**data):
            rep_info["status"]=True
        else:
            rep_info["status"]=False
        return HttpResponse(json.dumps(rep_info))
    else:
        return redirect("/index/")

def dianzan(request):
    if request.method == "POST":
        rep_data = {
            "status":"",
            "reason":""
        }
        news_id = request.POST.get("news_id",None)
        current_user = request.POST.get("current_user",None)
        if not news_id:
            rep_data["status"] = False
            rep_data["reason"] = "news-non-exist"
        if not current_user:
            rep_data["status"] = False
            rep_data["reason"] = "no-login"
        else:
            if not models.Dianzan.objects.filter(news=news_id,user__username=current_user).first():
                news = models.News.objects.get(id=news_id)
                user = models.User.objects.get(username=current_user)
                models.Dianzan.objects.create(news=news,user=user,status=True)
                rep_data["status"] = True
                rep_data["reason"] = "success"
            else:
                rep_data["status"] = False
                rep_data["reason"] = "already"
        return HttpResponse(json.dumps(rep_data))
    else:
        return  redirect("/index/")

