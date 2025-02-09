import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render


def home(request):
    qr_type = request.GET.get('qr', 'default')  # 获取 URL 参数，例如 `/` 或 `/?qr=2`

    if qr_type == '2':
        qr_image = "static/contact1.jpg"  # 第二个二维码
    else:
        qr_image = "static/contact2.jpg"  # 默认二维码

    return render(request, "index.html", {"qr_image": qr_image})

def results(request):
    """
    渲染查询结果页面。
    """
    return render(request, 'results.html')


def proxy_request(request):
    """
    代理查询功能，将查询请求转发到目标网站，并返回结果。
    """
    # 获取前端传递的参数
    singer = request.GET.get('singer', '')

    # 如果未输入歌手名字，返回错误提示
    if not singer:
        return JsonResponse({'error': '请输入歌手名字'}, status=400)

    # 构造目标网站 URL
    target_url = f'https://nice.zcguard.com/concert-result?artist={singer}'

    try:
        # 发送 GET 请求到目标网站
        response = requests.get(target_url, headers={
            'Referer': 'https://nice.zcguard.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0 Safari/537.36'
        })

        # 如果目标站点返回非 200 状态码，返回错误提示
        if response.status_code != 200:
            return JsonResponse({'error': '目标站点未返回有效数据'}, status=response.status_code)

        # 返回目标站点的 HTML 内容
        return HttpResponse(response.content, content_type='text/html')

    except requests.exceptions.RequestException as e:
        # 捕获异常并返回错误信息
        print(f"Error occurred: {e}")
        return JsonResponse({'error': '查询失败，请稍后再试'}, status=500)
