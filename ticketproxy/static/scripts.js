function redirectToResults() {
    const query = document.getElementById('singer').value;

    if (!query) {
        alert('请输入内容');
        return;
    }

    // 正确跳转到 Django 的 `/results/`
    window.location.href = `/results/?singer=${encodeURIComponent(query)}`;
}

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
        const response = await fetch(`/proxy/?singer=${encodeURIComponent(singer)}`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = doc.querySelectorAll('.result-table tbody tr');
        if (rows.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="4">未找到相关演唱会信息</td></tr>';
            return;
        }

        let resultsHtml = '';
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const singerName = cells[0]?.textContent.trim() || '-';
            const city = cells[1]?.textContent.trim() || '-';
            const date = cells[2]?.textContent.trim() || '-';
            const status = cells[3]?.textContent.trim() || '-';

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
        console.error(error);
        resultsBody.innerHTML = '<tr><td colspan="4">加载失败，请稍后重试</td></tr>';
    }
}

// 在 `results.html` 加载时自动调用
if (window.location.pathname === "/results/") {
    fetchResults();
}
