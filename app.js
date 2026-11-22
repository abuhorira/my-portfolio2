// Slide Navigation System
class SlidePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.tocBtn = document.getElementById('tocBtn');
        this.tocModal = document.getElementById('tocModal');
        this.tocBackdrop = document.getElementById('tocBackdrop');
        this.tocClose = document.getElementById('tocClose');
        this.tocList = document.getElementById('tocList');
        this.themeToggle = document.getElementById('themeToggle');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.reviewAllBtn = document.getElementById('reviewAllBtn');
        this.printBtn = document.getElementById('printBtn');
        this.checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        this.checklistFill = document.getElementById('checklistFill');
        this.checklistCount = document.getElementById('checklistCount');
        this.touchHint = document.getElementById('touchHint');
        
        this.tocData = [
            { num: 1, title: "الغلاف الافتتاحي" },
            { num: 2, title: "ما خطة البحث العلمي؟ ولماذا نحتاج إليها؟" },
            { num: 3, title: "اختيار موضوع البحث وصياغة العنوان" },
            { num: 4, title: "مشكلة البحث وأسئلته" },
            { num: 5, title: "أهداف البحث وأهميته" },
            { num: 6, title: "الدراسات السابقة والإطار النظري" },
            { num: 7, title: "منهجية البحث وتصميم الدراسة" },
            { num: 8, title: "حدود البحث وفرضياته ومصطلحاته" },
            { num: 9, title: "الجدول الزمني والمراجع والهيكل المقترح" },
            { num: 10, title: "المراجعة النهائية وقائمة التحقق" }
        ];
        
        this.init();
    }
    
    init() {
        this.totalSlidesEl.textContent = this.totalSlides;
        this.updateNavigation();
        this.buildToc();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupChecklist();
        this.checkTheme();
        this.hideTouchHint();
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.goToSlide(this.currentSlide - 1));
        this.nextBtn.addEventListener('click', () => this.goToSlide(this.currentSlide + 1));
        
        this.tocBtn.addEventListener('click', () => this.openToc());
        this.tocBackdrop.addEventListener('click', () => this.closeToc());
        this.tocClose.addEventListener('click', () => this.closeToc());
        
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        this.restartBtn.addEventListener('click', () => this.goToSlide(1));
        this.reviewAllBtn.addEventListener('click', () => this.reviewAll());
        this.printBtn.addEventListener('click', () => this.printChecklist());
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.goToSlide(this.currentSlide - 1);
            } else if (e.key === 'ArrowLeft') {
                this.goToSlide(this.currentSlide + 1);
            } else if (e.key === 'Escape') {
                this.closeToc();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            } else if (e.key === 'Home') {
                this.goToSlide(1);
            } else if (e.key === 'End') {
                this.goToSlide(this.totalSlides);
            }
        });
    }
    
    setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;
        const container = document.querySelector('.slides-container');
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - go to next slide (RTL: next is to the left)
                this.goToSlide(this.currentSlide + 1);
            } else {
                // Swipe right - go to previous slide
                this.goToSlide(this.currentSlide - 1);
            }
        }
    }
    
    goToSlide(slideNum) {
        if (slideNum < 1 || slideNum > this.totalSlides) return;
        
        // Update slide visibility
        this.slides.forEach((slide, index) => {
            if (index + 1 === slideNum) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        this.currentSlide = slideNum;
        this.updateNavigation();
        this.updateProgress();
        this.updateCounter();
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    
    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = progress + '%';
    }
    
    updateCounter() {
        this.currentSlideEl.textContent = this.currentSlide;
    }
    
    buildToc() {
        this.tocList.innerHTML = '';
        this.tocData.forEach(item => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.className = 'toc-link';
            btn.textContent = item.title;
            btn.addEventListener('click', () => {
                this.goToSlide(item.num);
                this.closeToc();
            });
            li.appendChild(btn);
            this.tocList.appendChild(li);
        });
    }
    
    openToc() {
        this.tocModal.classList.add('active');
    }
    
    closeToc() {
        this.tocModal.classList.remove('active');
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            this.themeToggle.innerHTML = '<i class="ti ti-moon"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            this.themeToggle.innerHTML = '<i class="ti ti-sun"></i>';
            localStorage.setItem('theme', 'light');
        }
    }
    
    checkTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            this.themeToggle.innerHTML = '<i class="ti ti-sun"></i>';
        } else {
            this.themeToggle.innerHTML = '<i class="ti ti-moon"></i>';
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            this.fullscreenBtn.innerHTML = '<i class="ti ti-minimize"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="ti ti-maximize"></i>';
        }
    }
    
    setupChecklist() {
        this.checklistItems.forEach(item => {
            // Load saved state
            const saved = localStorage.getItem('checklist_' + item.dataset.id);
            if (saved === 'true') {
                item.checked = true;
            }
            
            item.addEventListener('change', () => {
                localStorage.setItem('checklist_' + item.dataset.id, item.checked);
                this.updateChecklistProgress();
            });
        });
        this.updateChecklistProgress();
    }
    
    updateChecklistProgress() {
        const total = this.checklistItems.length;
        let checked = 0;
        this.checklistItems.forEach(item => {
            if (item.checked) checked++;
        });
        
        const percentage = (checked / total) * 100;
        this.checklistFill.style.width = percentage + '%';
        this.checklistCount.textContent = checked + ' / ' + total;
    }
    
    reviewAll() {
        // Go through all slides quickly
        for (let i = 1; i <= this.totalSlides; i++) {
            setTimeout(() => {
                this.goToSlide(i);
            }, (i - 1) * 800);
        }
    }
    
    printChecklist() {
        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>قائمة التحقق - خطة بحث رسالة الماجستير</title>
                <style>
                    body { font-family: 'Cairo', Arial, sans-serif; padding: 20px; direction: rtl; }
                    h1 { color: #667eea; text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                    h2 { color: #333; margin-top: 30px; }
                    .checklist { margin: 20px 0; }
                    .item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .box { width: 20px; height: 20px; border: 2px solid #ccc; }
                    .text { flex: 1; }
                    .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <h1>قائمة التحقق قبل تسليم خطة بحث رسالة الماجستير</h1>
                <div class="checklist">
                    <div class="item"><div class="box"></div><div class="text">عنوان واضح ومحدد</div></div>
                    <div class="item"><div class="box"></div><div class="text">مشكلة بحث مدعومة بالأدبيات</div></div>
                    <div class="item"><div class="box"></div><div class="text">أسئلة وأهداف متسقة</div></div>
                    <div class="item"><div class="box"></div><div class="text">أهمية علمية أو تطبيقية واضحة</div></div>
                    <div class="item"><div class="box"></div><div class="text">دراسات سابقة موثوقة ومحللة نقديًا</div></div>
                    <div class="item"><div class="box"></div><div class="text">منهجية متوافقة مع أسئلة البحث</div></div>
                    <div class="item"><div class="box"></div><div class="text">أدوات وإجراءات مناسبة</div></div>
                    <div class="item"><div class="box"></div><div class="text">حدود وتعريفات واضحة</div></div>
                    <div class="item"><div class="box"></div><div class="text">جدول زمني واقعي</div></div>
                    <div class="item"><div class="box"></div><div class="text">مراجع صحيحة ومتسقة في التوثيق</div></div>
                    <div class="item"><div class="box"></div><div class="text">الالتزام بالأخلاقيات البحثية ومتطلبات الجامعة</div></div>
                </div>
                <h2>ملاحظات:</h2>
                <div style="border: 1px solid #ccc; height: 100px; margin: 10px 0;"></div>
                <div class="footer">
                    <p>الدليل العملي لإعداد خطة بحث رسالة الماجستير</p>
                    <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
    
    hideTouchHint() {
        setTimeout(() => {
            if (this.touchHint) {
                this.touchHint.style.display = 'none';
            }
        }, 3000);
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SlidePresentation();
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="ti ti-minimize"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="ti ti-maximize"></i>';
    }
});
