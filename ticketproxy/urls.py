from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),             # 主页
    path('results/', views.results, name='results'),  # 查询结果页面
    path('proxy/', views.proxy_request, name='proxy_request'),  # 代理查询接口
]
