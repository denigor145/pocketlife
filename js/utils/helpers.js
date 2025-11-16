/**
 * Вспомогательные утилиты и функции
 * Общие функции, используемые во всех модулях приложения
 */

class Helpers {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
        this.throttleFlags = new Map();
    }

    /**
     * Генерация случайного числа в диапазоне
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Генерация случайного числа с плавающей точкой
     */
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Выбор случайного элемента из массива
     */
    randomChoice(array) {
        if (!array || array.length === 0) return null;
        return array[this.random(0, array.length - 1)];
    }

    /**
     * Перемешивание массива (алгоритм Фишера-Йейтса)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Форматирование числа с разделителями тысяч
     */
    formatNumber(number, decimals = 0) {
        if (typeof number !== 'number') return '0';
        
        return number.toLocaleString('ru-RU', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Форматирование денежной суммы
     */
    formatMoney(amount, currency = '₽') {
        return `${this.formatNumber(amount)} ${currency}`;
    }

    /**
     * Форматирование процентов
     */
    formatPercent(value, decimals = 1) {
        return `${(value * 100).toFixed(decimals)}%`;
    }

    /**
     * Форматирование времени (секунды в мм:сс)
     */
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Форматирование длительности (секунды в читаемый формат)
     */
    formatDuration(seconds) {
        if (seconds < 60) {
            return `${seconds} сек`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} мин`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} ч ${minutes} мин`;
        }
    }

    /**
     * Клонирование объекта (глубокое клонирование)
     */
    clone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.clone(item));
        
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.clone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Глубокое сравнение объектов
     */
    isEqual(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (!keys2.includes(key) || !this.isEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Слияние объектов (глубокое слияние)
     */
    merge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.merge(target, ...sources);
    }

    /**
     * Проверка, является ли значение объектом
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Дебаунс функции
     */
    debounce(func, wait, immediate = false) {
        const key = func.toString();
        
        return (...args) => {
            const later = () => {
                this.debounceTimers.delete(key);
                if (!immediate) func.apply(this, args);
            };
            
            const callNow = immediate && !this.debounceTimers.has(key);
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(later, wait));
            
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Троттлинг функции
     */
    throttle(func, limit) {
        const key = func.toString();
        
        return (...args) => {
            if (!this.throttleFlags.has(key)) {
                func.apply(this, args);
                this.throttleFlags.set(key, true);
                setTimeout(() => this.throttleFlags.delete(key), limit);
            }
        };
    }

    /**
     * Асинхронная задержка
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Выполнение функции с повторными попытками
     */
    async retry(fn, retries = 3, delayMs = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries === 0) throw error;
            await this.delay(delayMs);
            return this.retry(fn, retries - 1, delayMs);
        }
    }

    /**
     * Генерация уникального ID
     */
    generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * Проверка поддержки WebP
     */
    async checkWebPSupport() {
        if (this.cache.has('webpSupport')) {
            return this.cache.get('webpSupport');
        }

        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        
        const support = await new Promise(resolve => {
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
        });

        this.cache.set('webpSupport', support);
        return support;
    }

    /**
     * Загрузка изображения с кэшированием
     */
    async loadImage(src) {
        if (this.cache.has(src)) {
            return this.cache.get(src);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * Предзагрузка изображений
     */
    async preloadImages(urls) {
        const promises = urls.map(url => this.loadImage(url).catch(() => null));
        return Promise.all(promises);
    }

    /**
     * Создание элемента с атрибутами
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Установка атрибутов
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'textContent') {
                element.textContent = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else if (key.startsWith('on') && typeof attributes[key] === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // Добавление дочерних элементов
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        
        return element;
    }

    /**
     * Анимация числа (countUp)
     */
    animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent.replace(/\D/g, '')) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Вибрация (для мобильных устройств)
     */
    vibrate(pattern = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * Копирование текста в буфер обмена
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            return true;
        } catch (error) {
            console.error('Ошибка копирования в буфер:', error);
            return false;
        }
    }

    /**
     * Чтение из буфера обмена
     */
    async readFromClipboard() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                return await navigator.clipboard.readText();
            } else {
                throw new Error('Clipboard API not supported');
            }
        } catch (error) {
            console.error('Ошибка чтения из буфера:', error);
            return null;
        }
    }

    /**
     * Сохранение данных в localStorage с обработкой ошибок
     */
    setStorage(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
            return false;
        }
    }

    /**
     * Чтение данных из localStorage с обработкой ошибок
     */
    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Ошибка чтения из localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Удаление данных из localStorage
     */
    removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Ошибка удаления из localStorage:', error);
            return false;
        }
    }

    /**
     * Очистка всего localStorage
     */
    clearStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Ошибка очистки localStorage:', error);
            return false;
        }
    }

    /**
     * Проверка поддержки localStorage
     */
    isStorageSupported() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Получение параметров из URL
     */
    getUrlParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        
        return params;
    }

    /**
     * Обновление параметров URL без перезагрузки страницы
     */
    updateUrlParams(params, replace = false) {
        const url = new URL(window.location);
        
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === undefined) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, params[key]);
            }
        });
        
        if (replace) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }
    }

    /**
     * Проверка на мобильное устройство
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Проверка на устройство с тач-экраном
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Получение размера экрана
     */
    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    }

    /**
     * Подписка на изменение размера окна
     */
    onResize(callback, immediate = true) {
        const handler = this.throttle(callback, 100);
        window.addEventListener('resize', handler);
        
        if (immediate) {
            callback();
        }
        
        return () => window.removeEventListener('resize', handler);
    }

    /**
     * Подписка на видимость страницы
     */
    onVisibilityChange(callback) {
        const handler = () => callback(document.visibilityState);
        document.addEventListener('visibilitychange', handler);
        
        return () => document.removeEventListener('visibilitychange', handler);
    }

    /**
     * Проверка, активна ли вкладка
     */
    isPageVisible() {
        return document.visibilityState === 'visible';
    }

    /**
     * Логирование с уровнями
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const styles = {
            info: 'color: blue;',
            warn: 'color: orange;',
            error: 'color: red;',
            debug: 'color: gray;'
        };
        
        if (data) {
            console.log(`%c[${timestamp}] ${level.toUpperCase()}: ${message}`, styles[level], data);
        } else {
            console.log(`%c[${timestamp}] ${level.toUpperCase()}: ${message}`, styles[level]);
        }
    }

    /**
     * Создание логгера с префиксом
     */
    createLogger(prefix) {
        return {
            info: (message, data) => this.log('info', `[${prefix}] ${message}`, data),
            warn: (message, data) => this.log('warn', `[${prefix}] ${message}`, data),
            error: (message, data) => this.log('error', `[${prefix}] ${message}`, data),
            debug: (message, data) => this.log('debug', `[${prefix}] ${message}`, data)
        };
    }

    /**
     * Измерение производительности функции
     */
    measurePerformance(fn, name = 'Function') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} выполнена за ${(end - start).toFixed(2)} мс`);
        return result;
    }

    /**
     * Асинхронное измерение производительности
     */
    async measurePerformanceAsync(fn, name = 'Async Function') {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        
        console.log(`${name} выполнена за ${(end - start).toFixed(2)} мс`);
        return result;
    }

    /**
     * Создание промиса с таймаутом
     */
    withTimeout(promise, timeoutMs, timeoutMessage = 'Operation timeout') {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]).finally(() => {
            clearTimeout(timeoutId);
        });
    }

    /**
     * Группировка массива по ключу
     */
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(item);
            return groups;
        }, {});
    }

    /**
     * Сортировка объектов по ключу
     */
    sortBy(array, key, ascending = true) {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });
    }

    /**
     * Фильтрация уникальных значений в массиве
     */
    unique(array, key = null) {
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const value = item[key];
                if (seen.has(value)) return false;
                seen.add(value);
                return true;
            });
        } else {
            return [...new Set(array)];
        }
    }

    /**
     * Преобразование объекта в FormData
     */
    objectToFormData(obj, formData = new FormData(), parentKey = '') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const formKey = parentKey ? `${parentKey}[${key}]` : key;
                
                if (value instanceof File) {
                    formData.append(formKey, value);
                } else if (value instanceof Date) {
                    formData.append(formKey, value.toISOString());
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        const arrayKey = `${formKey}[${index}]`;
                        if (typeof item === 'object' && item !== null) {
                            this.objectToFormData(item, formData, arrayKey);
                        } else {
                            formData.append(arrayKey, item);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    this.objectToFormData(value, formData, formKey);
                } else {
                    formData.append(formKey, value);
                }
            }
        }
        return formData;
    }

    /**
     * Валидация email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Валидация номера телефона (русский формат)
     */
    isValidPhone(phone) {
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Очистка номера телефона от форматирования
     */
    cleanPhone(phone) {
        return phone.replace(/\D/g, '').replace(/^8/, '7').replace(/^/, '+');
    }

    /**
     * Экранирование HTML
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Создание CSV из массива объектов
     */
    arrayToCsv(data, headers = null) {
        const actualHeaders = headers || Object.keys(data[0] || {});
        const csvHeaders = actualHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
        
        const csvRows = data.map(row => 
            actualHeaders.map(field => {
                const value = row[field];
                return `"${String(value || '').replace(/"/g, '""')}"`;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    /**
     * Скачивание файла
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Получение MIME типа по расширению файла
     */
    getMimeType(filename) {
        const extensions = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'pdf': 'application/pdf',
            'json': 'application/json',
            'txt': 'text/plain',
            'csv': 'text/csv'
        };
        
        const ext = filename.split('.').pop().toLowerCase();
        return extensions[ext] || 'application/octet-stream';
    }

    /**
     * Очистка кэша
     */
    clearCache() {
        this.cache.clear();
        this.debounceTimers.clear();
        this.throttleFlags.clear();
    }

    /**
     * Получение информации о системе
     */
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
            screen: this.getScreenSize(),
            touch: this.isTouchDevice(),
            mobile: this.isMobile(),
            online: navigator.onLine,
            storage: this.isStorageSupported(),
            webp: this.cache.get('webpSupport') || false
        };
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.Helpers = Helpers;

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.helpers = new Helpers();
    
    // Проверка поддержки WebP при загрузке
    window.helpers.checkWebPSupport();
});
