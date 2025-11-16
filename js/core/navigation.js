/**
 * Система навигации и маршрутизации
 * Управляет переходами между странами, загрузкой контента и историей навигации
 */

class NavigationSystem {
    constructor() {
        this.currentPage = null;
        this.previousPage = null;
        this.history = [];
        this.maxHistoryLength = 20;
        this.routes = new Map();
        this.loadingStates = new Map();
        this.transitionInProgress = false;
        
        this.initRoutes();
        this.bindGlobalEvents();
        this.loadFromStorage();
    }

    /**
     * Инициализация маршрутов приложения
     */
    initRoutes() {
        // Основные маршруты
        this.routes.set('main_menu', {
            path: '/',
            file: 'index.html',
            title: 'Экономический симулятор',
            type: 'main',
            requiresAuth: false
        });

        this.routes.set('city_map', {
            path: '/city',
            file: 'pages/maps/city-map.html',
            title: 'Карта города',
            type: 'map',
            requiresAuth: true
        });

        this.routes.set('mall_map', {
            path: '/mall',
            file: 'pages/maps/mall-map.html',
            title: 'Торговый центр',
            type: 'map',
            requiresAuth: true
        });

        this.routes.set('game', {
            path: '/game',
            file: 'pages/game/game.html',
            title: 'Торговля',
            type: 'game',
            requiresAuth: true
        });

        this.routes.set('skills', {
            path: '/skills',
            file: 'pages/game/skills.html',
            title: 'Умения',
            type: 'management',
            requiresAuth: true
        });

        this.routes.set('character', {
            path: '/character',
            file: 'pages/game/character.html',
            title: 'Персонаж',
            type: 'management',
            requiresAuth: true
        });

        this.routes.set('victory', {
            path: '/victory',
            file: 'pages/results/victory.html',
            title: 'Победа!',
            type: 'result',
            requiresAuth: true
        });

        this.routes.set('defeat', {
            path: '/defeat',
            file: 'pages/results/defeat.html',
            title: 'Поражение',
            type: 'result',
            requiresAuth: true
        });

        // Карты локаций
        this.routes.set('products_map', {
            path: '/maps/products',
            file: 'pages/maps/products-map.html',
            title: 'Продуктовый отдел',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('clothing_map', {
            path: '/maps/clothing',
            file: 'pages/maps/clothing-map.html',
            title: 'Одежда',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('electronics_map', {
            path: '/maps/electronics',
            file: 'pages/maps/electronics-map.html',
            title: 'Электроника',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('furniture_map', {
            path: '/maps/furniture',
            file: 'pages/maps/furniture-map.html',
            title: 'Мебель',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('residential_map', {
            path: '/maps/residential',
            file: 'pages/maps/residential-map.html',
            title: 'Жилой квартал',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('business_map', {
            path: '/maps/business',
            file: 'pages/maps/business-map.html',
            title: 'Бизнес-центр',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('station_map', {
            path: '/maps/station',
            file: 'pages/maps/station-map.html',
            title: 'Пригород',
            type: 'location',
            requiresAuth: true
        });

        this.routes.set('industrial_map', {
            path: '/maps/industrial',
            file: 'pages/maps/industrial-map.html',
            title: 'Промышленная зона',
            type: 'location',
            requiresAuth: true
        });

        // Динамические маршруты с параметрами
        this.routes.set('opponent_info', {
            path: '/opponent/:id',
            file: 'pages/game/opponent-info.html',
            title: 'Профиль покупателя',
            type: 'info',
            requiresAuth: true
        });
    }

    /**
     * Привязка глобальных событий
     */
    bindGlobalEvents() {
        // Обработка кликов по ссылкам
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[data-navigation]');
            if (link) {
                event.preventDefault();
                this.handleNavigationClick(link);
            }
        });

        // Обработка кнопки "Назад" в браузере
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                this.navigateToRoute(event.state.route, false);
            }
        });

        // Обработка закрытия страницы
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }

    /**
     * Обработка кликов по навигационным ссылкам
     */
    handleNavigationClick(link) {
        const route = link.getAttribute('data-navigation');
        const params = this.parseParamsFromElement(link);
        
        this.navigateTo(route, params);
    }

    /**
     * Парсинг параметров из элемента
     */
    parseParamsFromElement(element) {
        const params = {};
        
        // Парсинг data-атрибутов
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-param-')) {
                const paramName = attr.name.replace('data-param-', '');
                params[paramName] = attr.value;
            }
        }

        // Парсинг query параметров из href
        const href = element.getAttribute('href');
        if (href && href.includes('?')) {
            const queryParams = new URLSearchParams(href.split('?')[1]);
            queryParams.forEach((value, key) => {
                params[key] = value;
            });
        }

        return params;
    }

    /**
     * Навигация к указанному маршруту
     */
    navigateTo(route, params = {}, addToHistory = true) {
        if (this.transitionInProgress) {
            console.warn('Навигация уже выполняется');
            return false;
        }

        this.transitionInProgress = true;

        // Получение информации о маршруте
        const routeInfo = this.routes.get(route);
        if (!routeInfo) {
            console.error(`Маршрут не найден: ${route}`);
            this.transitionInProgress = false;
            return false;
        }

        // Проверка аутентификации
        if (routeInfo.requiresAuth && !this.checkAuthentication()) {
            console.warn('Требуется аутентификация');
            this.transitionInProgress = false;
            return false;
        }

        // Выполнение перехода
        this.performNavigation(routeInfo, params, addToHistory)
            .then(() => {
                this.transitionInProgress = false;
            })
            .catch((error) => {
                console.error('Ошибка навигации:', error);
                this.transitionInProgress = false;
            });

        return true;
    }

    /**
     * Выполнение навигации
     */
    async performNavigation(routeInfo, params, addToHistory) {
        // Сохранение предыдущей страницы
        this.previousPage = this.currentPage;

        // Показ индикатора загрузки
        this.showLoadingIndicator();

        try {
            // Загрузка контента
            const content = await this.loadPageContent(routeInfo.file);
            
            // Обновление DOM
            this.updatePageContent(content, routeInfo.title);
            
            // Обновление URL
            this.updateBrowserURL(routeInfo.path, params);
            
            // Сохранение в историю
            if (addToHistory) {
                this.addToHistory(routeInfo, params);
            }

            // Обновление текущей страницы
            this.currentPage = {
                route: routeInfo,
                params: params,
                timestamp: Date.now()
            };

            // Инициализация страницы
            this.initializePage(routeInfo, params);

            // Скрытие индикатора загрузки
            this.hideLoadingIndicator();

            // Отправка события о смене страницы
            this.dispatchNavigationEvent(routeInfo, params);

            console.log(`Переход на: ${routeInfo.title}`, params);

        } catch (error) {
            this.hideLoadingIndicator();
            throw error;
        }
    }

    /**
     * Загрузка содержимого страницы
     */
    async loadPageContent(filePath) {
        // Проверка кэша
        if (this.loadingStates.has(filePath)) {
            return this.loadingStates.get(filePath);
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const content = await response.text();
            this.loadingStates.set(filePath, content);
            return content;

        } catch (error) {
            console.error(`Ошибка загрузки ${filePath}:`, error);
            
            // Загрузка страницы ошибки
            return this.getErrorPageContent(error);
        }
    }

    /**
     * Контент для страницы ошибки
     */
    getErrorPageContent(error) {
        return `
            <div class="error-page">
                <div class="error-icon">⚠️</div>
                <h1>Ошибка загрузки</h1>
                <p>Не удалось загрузить запрашиваемую страницу.</p>
                <p><small>${error.message}</small></p>
                <button onclick="navigation.navigateTo('main_menu')">В главное меню</button>
            </div>
        `;
    }

    /**
     * Обновление содержимого страницы
     */
    updatePageContent(content, title) {
        // Обновление title
        document.title = title;

        // Обновление основного контента
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = content;
        } else {
            // Если нет контейнера, создаем его
            const newContent = document.createElement('div');
            newContent.id = 'main-content';
            newContent.innerHTML = content;
            
            const oldContent = document.querySelector('#main-content');
            if (oldContent) {
                oldContent.replaceWith(newContent);
            } else {
                document.body.innerHTML = '';
                document.body.appendChild(newContent);
            }
        }
    }

    /**
     * Обновление URL браузера
     */
    updateBrowserURL(path, params) {
        let url = path;
        
        // Добавление параметров
        if (Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams(params);
            url += '?' + searchParams.toString();
        }

        // Обновление истории браузера
        window.history.pushState({ route: this.currentPage }, '', url);
    }

    /**
     * Добавление в историю навигации
     */
    addToHistory(routeInfo, params) {
        const historyItem = {
            route: routeInfo,
            params: params,
            timestamp: Date.now()
        };

        this.history.unshift(historyItem);

        // Ограничение длины истории
        if (this.history.length > this.maxHistoryLength) {
            this.history = this.history.slice(0, this.maxHistoryLength);
        }
    }

    /**
     * Инициализация страницы после загрузки
     */
    initializePage(routeInfo, params) {
        // Вызов специфичных инициализаторов для разных типов страниц
        switch (routeInfo.type) {
            case 'game':
                this.initializeGamePage(params);
                break;
            case 'map':
                this.initializeMapPage(params);
                break;
            case 'management':
                this.initializeManagementPage(params);
                break;
            case 'result':
                this.initializeResultPage(params);
                break;
        }

        // Вызов глобальных инициализаторов
        this.initializeGlobalComponents();
    }

    /**
     * Инициализация игровой страницы
     */
    initializeGamePage(params) {
        // Инициализация игры, если скрипт загружен
        if (window.game) {
            window.game.startGame(params);
        }

        // Инициализация боевой системы
        if (window.CombatSystem) {
            // Логика инициализации боя
        }
    }

    /**
     * Инициализация карты
     */
    initializeMapPage(params) {
        // Инициализация карты локаций
        if (window.mapSystem) {
            window.mapSystem.initialize(params);
        }
    }

    /**
     * Инициализация страницы управления
     */
    initializeManagementPage(params) {
        // Инициализация интерфейса управления
        // (навыки, персонаж, инвентарь)
    }

    /**
     * Инициализация страницы результата
     */
    initializeResultPage(params) {
        // Обработка результатов боя
        if (params.rewards) {
            this.processRewards(params.rewards);
        }
    }

    /**
     * Инициализация глобальных компонентов
     */
    initializeGlobalComponents() {
        // Инициализация Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
        }

        // Инициализация анимаций
        this.initializeAnimations();

        // Инициализация слушателей событий
        this.initializeEventListeners();
    }

    /**
     * Обработка наград
     */
    processRewards(rewards) {
        if (window.characterSystem && rewards) {
            // Добавление опыта
            if (rewards.experience) {
                window.characterSystem.addExperience(rewards.experience);
            }

            // Добавление денег
            if (rewards.money) {
                window.characterSystem.addMoney(rewards.money);
            }

            // Добавление предметов
            if (rewards.items && window.inventorySystem) {
                rewards.items.forEach(item => {
                    window.inventorySystem.addItem(item.id, item.quantity);
                });
            }
        }
    }

    /**
     * Показать индикатор загрузки
     */
    showLoadingIndicator() {
        let loader = document.getElementById('navigation-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'navigation-loader';
            loader.innerHTML = `
                <div class="loader-overlay">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Загрузка...</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    /**
     * Скрыть индикатор загрузки
     */
    hideLoadingIndicator() {
        const loader = document.getElementById('navigation-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * Отправка события навигации
     */
    dispatchNavigationEvent(routeInfo, params) {
        const event = new CustomEvent('navigationChanged', {
            detail: {
                route: routeInfo,
                params: params,
                previousPage: this.previousPage
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Проверка аутентификации
     */
    checkAuthentication() {
        // В реальном приложении здесь будет проверка авторизации
        // Для демо всегда возвращаем true
        return true;
    }

    /**
     * Навигация назад
     */
    goBack() {
        if (this.history.length > 1) {
            // Удаляем текущую страницу из истории
            this.history.shift();
            
            // Переходим к предыдущей странице
            const previous = this.history[0];
            if (previous) {
                this.navigateToRoute(previous.route, previous.params, false);
            }
        } else {
            // Если история пуста, переходим в главное меню
            this.navigateTo('main_menu');
        }
    }

    /**
     * Навигация к маршруту по объекту
     */
    navigateToRoute(routeInfo, params = {}, addToHistory = true) {
        // Находим ключ маршрута по объекту
        for (let [key, value] of this.routes) {
            if (value === routeInfo) {
                this.navigateTo(key, params, addToHistory);
                return;
            }
        }
    }

    /**
     * Получить текущий маршрут
     */
    getCurrentRoute() {
        return this.currentPage;
    }

    /**
     * Получить историю навигации
     */
    getNavigationHistory() {
        return [...this.history];
    }

    /**
     * Очистка истории навигации
     */
    clearHistory() {
        this.history = [];
        this.saveToStorage();
    }

    /**
     * Редирект на указанный маршрут
     */
    redirectTo(route, params = {}) {
        this.navigateTo(route, params, false);
    }

    /**
     * Обновление текущей страницы
     */
    refresh() {
        if (this.currentPage) {
            this.navigateToRoute(this.currentPage.route, this.currentPage.params, false);
        }
    }

    /**
     * Инициализация анимаций
     */
    initializeAnimations() {
        // Добавление CSS для анимаций
        if (!document.getElementById('navigation-styles')) {
            const styles = document.createElement('style');
            styles.id = 'navigation-styles';
            styles.textContent = `
                .loader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    color: white;
                }
                
                .loader-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                
                .loader-text {
                    font-size: 16px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .error-page {
                    text-align: center;
                    padding: 50px 20px;
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .error-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    /**
     * Инициализация слушателей событий
     */
    initializeEventListeners() {
        // Обработка специальных кнопок навигации
        document.addEventListener('click', (event) => {
            // Кнопка "Назад"
            if (event.target.matches('[data-action="back"]')) {
                event.preventDefault();
                this.goBack();
            }

            // Кнопка "Главное меню"
            if (event.target.matches('[data-action="main-menu"]')) {
                event.preventDefault();
                this.navigateTo('main_menu');
            }
        });
    }

    /**
     * Сохранение в localStorage
     */
    saveToStorage() {
        try {
            const saveData = {
                history: this.history.slice(0, 10), // Сохраняем только последние 10 записей
                currentPage: this.currentPage
            };
            localStorage.setItem('navigationData', JSON.stringify(saveData));
        } catch (error) {
            console.error('Ошибка сохранения навигации:', error);
        }
    }

    /**
     * Загрузка из localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('navigationData');
            if (saved) {
                const saveData = JSON.parse(saved);
                this.history = saveData.history || [];
                this.currentPage = saveData.currentPage || null;
            }
        } catch (error) {
            console.error('Ошибка загрузки навигации:', error);
        }
    }

    /**
     * Получить статистику навигации
     */
    getNavigationStatistics() {
        const pageVisits = {};
        
        this.history.forEach(visit => {
            const routeName = visit.route.path;
            pageVisits[routeName] = (pageVisits[routeName] || 0) + 1;
        });

        return {
            totalVisits: this.history.length,
            uniquePages: Object.keys(pageVisits).length,
            mostVisited: Object.entries(pageVisits)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            currentPage: this.currentPage,
            historySize: this.history.length
        };
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.NavigationSystem = NavigationSystem;

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new NavigationSystem();
    
    // Обработка начального маршрута
    const initialRoute = window.location.pathname.replace('/', '') || 'main_menu';
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    
    window.navigation.navigateTo(initialRoute, params, false);
});
