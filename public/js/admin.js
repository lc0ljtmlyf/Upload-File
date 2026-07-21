// ===== Language & Theme Management =====
let currentLanguage = 'fa';
let currentTheme = 'light';

// Language translations
const translations = {
    fa: {
        dashboard: 'داشبورد',
        users: 'کاربران',
        files: 'فایل‌ها',
        analytics: 'آمار',
        settings: 'تنظیمات',
        logout: 'خروج',
        totalUsers: 'کل کاربران',
        totalFiles: 'کل فایل‌ها',
        totalStorage: 'ذخیره استفاده‌شده',
        activeDownloads: 'دانلودهای امروز',
        weeklyActivity: 'فعالیت هفتگی',
        fileDistribution: 'توزیع فایل‌ها',
        recentActivity: 'فعالیت‌های اخیر',
        manageUsers: 'مدیریت کاربران',
        addNewUser: 'کاربر جدید',
        newUser: 'کاربر جدید',
        manageFiles: 'مدیریت فایل‌ها',
        systemSettings: 'تنظیمات سیستم',
        reportsAnalytics: 'آمار و گزارش‌ها'
    },
    en: {
        dashboard: 'Dashboard',
        users: 'Users',
        files: 'Files',
        analytics: 'Analytics',
        settings: 'Settings',
        logout: 'Logout',
        totalUsers: 'Total Users',
        totalFiles: 'Total Files',
        totalStorage: 'Storage Used',
        activeDownloads: 'Today Downloads',
        weeklyActivity: 'Weekly Activity',
        fileDistribution: 'File Distribution',
        recentActivity: 'Recent Activity',
        manageUsers: 'Manage Users',
        addNewUser: 'Add New User',
        newUser: 'New User',
        manageFiles: 'Manage Files',
        systemSettings: 'System Settings',
        reportsAnalytics: 'Reports & Analytics'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeCharts();
    loadStatistics();
});

// ===== Theme Toggle =====
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    const body = document.body;
    
    body.classList.remove(`${currentTheme === 'dark' ? 'light' : 'dark'}-mode`);
    body.classList.add(`${currentTheme}-mode`);
    
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    updateCharts();
}

function initializeTheme() {
    const saved = localStorage.getItem('theme');
    currentTheme = saved || 'light';
    document.body.classList.add(`${currentTheme}-mode`);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== Language Toggle =====
function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    localStorage.setItem('language', lang);
    updatePageLanguage();
}

function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// ===== Navigation & Sections =====
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    // Update active menu item
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.menu-link').classList.add('active');
    
    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('show');
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('show');
}

// ===== Dropdown Menu =====
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('dropdownMenu');
    const userProfile = document.querySelector('.user-profile');
    
    if (!userProfile.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ===== Charts Initialization =====
let charts = {};

function initializeCharts() {
    initWeeklyChart();
    initFileTypeChart();
    initUserGrowthChart();
    initStorageChart();
}

function initWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    if (charts.weekly) charts.weekly.destroy();
    
    charts.weekly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
            datasets: [{
                label: 'آپلودها',
                data: [45, 52, 48, 65, 72, 58, 68],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'دانلودها',
                data: [30, 42, 38, 55, 62, 48, 58],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: 600 },
                        color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                        font: { size: 11 }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function initFileTypeChart() {
    const ctx = document.getElementById('fileTypeChart');
    if (!ctx) return;
    
    if (charts.fileType) charts.fileType.destroy();
    
    charts.fileType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['تصاویر', 'اسناد', 'ویدیو', 'موسیقی', 'سایر'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: 600 },
                        color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'
                    }
                }
            }
        }
    });
}

function initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;
    
    if (charts.userGrowth) charts.userGrowth.destroy();
    
    charts.userGrowth = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
            datasets: [{
                label: 'کاربران جدید',
                data: [45, 52, 48, 65, 72, 88],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#6366f1',
                    '#8b5cf6',
                    '#6366f1',
                    '#8b5cf6'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                        font: { size: 12, weight: 600 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b'
                    }
                }
            }
        }
    });
}

function initStorageChart() {
    const ctx = document.getElementById('storageChart');
    if (!ctx) return;
    
    if (charts.storage) charts.storage.destroy();
    
    charts.storage = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['تصاویر', 'اسناد', 'ویدیو', 'موسیقی', 'بکآپ'],
            datasets: [{
                label: 'مصرف (GB)',
                data: [2.5, 1.8, 3.2, 0.9, 1.6],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                        font: { size: 12, weight: 600 }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b'
                    }
                }
            }
        }
    });
}

function updateCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && chart.options && chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = currentTheme === 'dark' ? '#f1f5f9' : '#1e293b';
            chart.update();
        }
    });
}

// ===== Statistics Loading =====
function loadStatistics() {
    // Simulate loading data from API
    const stats = {
        totalUsers: 125,
        totalFiles: 856,
        totalStorage: '2.5GB',
        activeDownloads: 42
    };
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalFiles').textContent = stats.totalFiles;
    document.getElementById('totalStorage').textContent = stats.totalStorage;
    document.getElementById('activeDownloads').textContent = stats.activeDownloads;
}

// ===== User Management =====
function openUserModal() {
    document.getElementById('userModal').classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
}

function addUser(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // TODO: Send to server
    console.log('Adding user:', Object.fromEntries(formData));
    
    // Reset and close
    form.reset();
    closeUserModal();
    
    showNotification('کاربر با موفقیت اضافه شد!', 'success');
}

function deleteUser(btn) {
    if (confirm('آیا مطمئن هستید؟')) {
        const row = btn.closest('tr');
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.remove();
            showNotification('کاربر حذف شد!', 'success');
        }, 300);
    }
}

// ===== File Management =====
function deleteFile(btn) {
    if (confirm('آیا مطمئن هستید؟')) {
        const row = btn.closest('tr');
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.remove();
            showNotification('فایل حذف شد!', 'success');
        }, 300);
    }
}

// ===== Notifications =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Logout =====
function logout() {
    if (confirm('آیا مطمئن از خروج هستید؟')) {
        window.location.href = '/logout';
    }
}

// ===== Mobile Responsive =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('show');
    }
});

// ===== Add Animations CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .section {
        display: none;
        animation: fadeIn 0.5s ease;
    }
    
    .section.active {
        display: block;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);