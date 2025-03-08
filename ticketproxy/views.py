import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


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
@csrf_exempt
def proxy_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': '仅支持 POST 请求'}, status=405)

    singer = request.POST.get('singer', '').strip()
    if not singer:
        return JsonResponse({'error': '请输入歌手名字'}, status=400)

    target_url = 'http://49.235.183.148/tmp10/search.php'

    try:
        response = requests.post(target_url, data={'geshou': singer}, headers={
            'Referer': 'http://49.235.183.148/tmp10/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'Content-Type': 'application/x-www-form-urlencoded'
        })

        if response.status_code != 200:
            return JsonResponse({'error': '目标站点未返回有效数据'}, status=response.status_code)

        return HttpResponse(response.content, content_type='text/html')

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': '查询失败，请稍后再试'}, status=500)
