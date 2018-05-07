#!/usr/bin/env python
# -*- conding:utf-8 -*-


from django import forms

class User_register(forms.Form):
    username = forms.CharField(required=True,error_messages={"required":"用户名不能为空"})
    password = forms.CharField(required=True,min_length=8,error_messages={"required":"密码不能为空","min_length":"密码至少为8位"})
    email = forms.EmailField(required=True,error_messages={"required":"邮箱不能为空"})