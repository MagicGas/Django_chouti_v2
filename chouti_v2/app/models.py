from django.db import models
import datetime
import django.utils.timezone as timezone
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    email = models.EmailField(max_length=64)

class News(models.Model):
    title= models.CharField(max_length=32)
    content = models.TextField(max_length=10000)
    author = models.ForeignKey("User",on_delete=models.CASCADE)
    ctime = models.DateTimeField(default = timezone.now)

class Dianzan(models.Model):
    user = models.ForeignKey("User",on_delete=models.CASCADE)
    news = models.ForeignKey("News",on_delete=models.CASCADE)
    status = models.BooleanField(default=False)