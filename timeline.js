// 时间线页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载并显示保存的旅程
    loadSavedJourneys();
    
    // 初始化黑暗模式切换
    initDarkModeToggle();
});

// 加载保存的旅程
function loadSavedJourneys() {
    const savedJourneysContainer = document.getElementById('saved-journeys');
    const emptyTimeline = document.getElementById('empty-timeline');
    
    // 从本地存储获取保存的旅程
    const savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
    
    // 如果没有保存的旅程，显示空状态
    if (savedJourneys.length === 0) {
        if (emptyTimeline) emptyTimeline.style.display = 'block';
        return;
    }
    
    // 如果有保存的旅程，隐藏空状态
    if (emptyTimeline) emptyTimeline.style.display = 'none';
    
    // 清空容器
    savedJourneysContainer.innerHTML = '';
    
    // 为每个保存的旅程创建卡片
    savedJourneys.forEach((journey, index) => {
        const journeyCard = createJourneyCard(journey, index);
        savedJourneysContainer.appendChild(journeyCard);
    });
}

// 创建旅程卡片
function createJourneyCard(journey, index) {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.dataset.journeyId = journey.id;
    
    // 格式化日期
    const journeyDate = new Date(journey.date);
    const formattedDate = journeyDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 设置卡片内容
    card.innerHTML = `
        <div class="timeline-card-image">
            <img src="${journey.image || 'images/placeholder.jpg'}" alt="${journey.title}">
        </div>
        <div class="timeline-card-content">
            <h3 class="timeline-card-title">${journey.title}</h3>
            <div class="timeline-card-date">
                <i class="far fa-calendar-alt"></i> ${formattedDate}
            </div>
            <div class="timeline-card-actions">
                <button class="view-journey" data-url="${journey.url}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="remove-journey" data-index="${index}">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            </div>
        </div>
    `;
    
    // 添加查看旅程事件
    card.querySelector('.view-journey').addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        window.location.href = url;
    });
    
    // 添加删除旅程事件
    card.querySelector('.remove-journey').addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        removeJourney(index);
    });
    
    return card;
}

// 删除保存的旅程
function removeJourney(index) {
    // 获取保存的旅程
    let savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
    
    // 从数组中移除指定索引的旅程
    savedJourneys.splice(index, 1);
    
    // 保存更新后的数组
    localStorage.setItem('savedJourneys', JSON.stringify(savedJourneys));
    
    // 重新加载显示
    loadSavedJourneys();
    
    // 显示删除成功提示
    showNotification('Journey removed from your timeline');
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后隐藏并移除通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 黑暗模式切换功能
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // 检查用户之前的偏好
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // 应用初始模式
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
        
        // 添加切换事件
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            // 更新图标
            const icon = this.querySelector('i');
            if (isDark) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
}
