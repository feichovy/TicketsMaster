from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),             # 首页
    path('proxy/', views.proxy_request, name='proxy_request'),  # 查询接口
]

