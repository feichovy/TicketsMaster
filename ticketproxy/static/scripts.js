// **跳转到查询结果页面**
function redirectToResults() {
    const query = document.getElementById('singer').value.trim();

    if (!query) {
        alert('请输入歌手或城市名字');
        return;
    }

    // ✅ 正确跳转到 Django `/results/`
    window.location.href = `/results/?singer=${encodeURIComponent(query)}`;
}

// **从后端获取查询结果**
async function fetchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const singer = urlParams.get('singer');

    if (!singer) {
        alert('未提供查询参数！');
        return;
    }

    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = '<tr><td colspan="4">加载中，请稍候...</td></tr>';

    try {
        const response = await fetch('/proxy/', {  // ✅ 改为 POST 请求
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `singer=${encodeURIComponent(singer)}`
        });

        if (!response.ok) {
            resultsBody.innerHTML = '<tr><td colspan="4">查询失败，请稍后再试</td></tr>';
            return;
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // **获取目标网站的表格数据**
        const rows = doc.querySelectorAll('table tbody tr');
        if (rows.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="4">未找到相关信息</td></tr>';
            return;
        }

        let resultsHtml = '';
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');

            // **修复数据错位**
            let singerName = singer; // 默认歌手名为查询歌手
            let city = cells[0]?.textContent.trim() || '-';
            let rawDate = cells[1]?.textContent.trim() || '-';
            let status = "已官宣";  // ✅ 默认状态为 "已官宣"

            // **提取站点信息并放入“城市”列**
            let date = rawDate;  // 先默认日期为完整文本
            const siteMatch = rawDate.match(/【(.*?)】/);
            if (siteMatch) {
                city += ` ${siteMatch[1]}`;  // 把站点信息放入"城市"列
                date = rawDate.replace(siteMatch[0], '').trim(); // 去掉站点信息
            }

            // **提取状态信息（已官宣/未官宣）**
            if (date.includes("未官宣")) {
                status = "未官宣";
                date = date.replace("（未官宣）", "").trim(); // 去掉状态信息
            }

            resultsHtml += `
                <tr>
                    <td>${singerName}</td>
                    <td>${city}</td>
                    <td>${date}</td>
                    <td>${status}</td>
                </tr>`;
        });

        resultsBody.innerHTML = resultsHtml;
    } catch (error) {
        console.error("请求出错:", error);
        resultsBody.innerHTML = '<tr><td colspan="4">加载失败，请稍后重试</td></tr>';
    }
}

// **确保在 `/results/` 页面时自动触发查询**
if (window.location.pathname === "/results/") {
    fetchResults();
}
