async function searchSinger() {
    const singer = document.getElementById('singer').value;
    const resultsDiv = document.getElementById('results');

    if (!singer) {
        alert('请输入歌手名字');
        return;
    }

    resultsDiv.innerHTML = '<p>查询中...</p>';

    try {
        const response = await fetch(`/proxy/?singer=${encodeURIComponent(singer)}`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const tables = doc.querySelectorAll('.result-table');
        if (tables.length === 0) {
            resultsDiv.innerHTML = `<p>未找到相关演唱会信息</p>`;
            return;
        }

        // 渲染每条结果为卡片
        let htmlContent = '';
        tables.forEach(table => {
            const cityElement = table.querySelector('td:nth-child(1)');
            const detailsElement = table.querySelector('td:nth-child(2)');

            const city = cityElement ? cityElement.textContent.trim() : '未知城市';
            const details = detailsElement ? detailsElement.textContent.trim() : '未知信息';

            htmlContent += `                
            <div class="result-card">
                <h4>城市: ${city}</h4>
                <p>详情: <span>${details}</span></p>
            </div>
             `;
        });


        resultsDiv.innerHTML = htmlContent;
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = '<p>查询失败，请稍后再试</p>';
    }
}
