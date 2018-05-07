"""chouti URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import account
from app.views import news
urlpatterns = [
    path('admin/', admin.site.urls),
    path("index/",account.index),
    path("register/",account.register),
    path("login/",account.login),
    path("exit_user/",account.exit_user),
    path("new_news/",news.new_news),
    path("dianzan/",news.dianzan),

]
