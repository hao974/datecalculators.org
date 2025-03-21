// main.js - 为旅行详情页面添加交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化分享功能
    initShareFeature();
    
    // 初始化保存到时间线功能
    initSaveToTimeline();
    
    // 初始化黑暗模式切换
    initDarkModeToggle();
    
    // 初始化图片画廊
    initImageGallery();
});

// 分享功能
function initShareFeature() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const copyLinkBtn = document.querySelector('.share-link button');
    const linkInput = document.querySelector('.share-link input');
    
    // 设置当前页面URL到输入框
    if (linkInput) {
        linkInput.value = window.location.href;
    }
    
    // 为每个分享按钮添加点击事件
    if (shareButtons) {
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
                
                let shareUrl;
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${title} ${url}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=Check out this journey: ${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
    
    // 复制链接功能
    if (copyLinkBtn && linkInput) {
        copyLinkBtn.addEventListener('click', function() {
            linkInput.select();
            document.execCommand('copy');
            
            // 显示复制成功提示
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = 'var(--primary-color)';
            }, 2000);
        });
    }
}

// 保存到时间线功能
function initSaveToTimeline() {
    const saveBtn = document.querySelector('.save-btn');
    const savedConfirmation = document.querySelector('.saved-confirmation');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // 在实际应用中，这里应该发送请求到服务器保存旅程
            // 这里我们只是模拟保存成功
            
            // 显示保存成功消息
            if (savedConfirmation) {
                savedConfirmation.classList.add('active');
                
                // 5秒后隐藏消息
                setTimeout(() => {
                    savedConfirmation.classList.remove('active');
                }, 5000);
            }
            
            // 模拟保存到本地存储
            const journeyData = {
                id: Date.now(),
                title: document.querySelector('.journey-title')?.textContent || 'Journey',
                date: new Date().toISOString(),
                url: window.location.href
            };
            
            // 获取已保存的旅程
            let savedJourneys = JSON.parse(localStorage.getItem('savedJourneys') || '[]');
            
            // 添加新旅程
            savedJourneys.push(journeyData);
            
            // 保存回本地存储
            localStorage.setItem('savedJourneys', JSON.stringify(savedJourneys));
        });
    }
}

// 黑暗模式切换
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

// 图片画廊功能
function initImageGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                // 创建模态框
                const modal = document.createElement('div');
                modal.classList.add('gallery-modal');
                
                modal.innerHTML = `
                    <div class="gallery-modal-content">
                        <span class="gallery-close">&times;</span>
                        <img src="${imgSrc}" alt="${imgAlt}">
                        <div class="gallery-caption">${imgAlt}</div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // 防止滚动
                document.body.style.overflow = 'hidden';
                
                // 显示模态框
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);
                
                // 关闭模态框
                modal.addEventListener('click', function(e) {
                    if (e.target === modal || e.target.classList.contains('gallery-close')) {
                        modal.style.opacity = '0';
                        document.body.style.overflow = '';
                        
                        setTimeout(() => {
                            document.body.removeChild(modal);
                        }, 300);
                    }
                });
            });
        });
    }
}
