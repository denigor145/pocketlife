/**
 * Система управления картами и локациями
 * Управляет игровыми локациями, их состоянием, разблокировкой и навигацией
 */

class MapSystem {
    constructor() {
        this.currentMap = null;
        this.currentLocation = null;
        this.availableLocations = new Map();
        this.locationStates = new Map();
        this.playerPosition = { x: 0, y: 0 };
        
        // Данные о локациях
        this.mapsData = {
            city: this.initializeCityMap(),
            mall: this.initializeMallMap(),
            residential: this.initializeResidentialMap(),
            business: this.initializeBusinessMap(),
            station: this.initializeStationMap(),
            industrial: this.initializeIndustrialMap()
        };
        
        this.init();
    }

    /**
     * Инициализация системы карт
     */
    async init() {
        console.log('Инициализация системы карт...');
        
        try {
            // Загрузка сохраненных данных
            await this.loadMapData();
            
            // Инициализация доступных локаций
            await this.initializeAvailableLocations();
            
            // Установка начальной позиции
            this.setInitialPosition();
            
            console.log('Система карт успешно инициализирована');
            
        } catch (error) {
            console.error('Ошибка инициализации системы карт:', error);
        }
    }

    /**
     * Инициализация карты города
     */
    initializeCityMap() {
        return {
            id: 'city',
            name: 'Карта города',
            type: 'overworld',
            background: 'images/backgrounds/city/city_map.jpg',
            locations: {
                mall: {
                    id: 'mall',
                    name: 'Торговый центр',
                    type: 'commercial',
                    position: { x: 50, y: 30 },
                    icon: '🏬',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Крупный торговый комплекс с различными отделами'
                },
                residential: {
                    id: 'residential',
                    name: 'Жилой квартал',
                    type: 'residential',
                    position: { x: 20, y: 60 },
                    icon: '🏘️',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Жилая зона с потенциальными клиентами'
                },
                business: {
                    id: 'business',
                    name: 'Бизнес-центр',
                    type: 'commercial',
                    position: { x: 70, y: 50 },
                    icon: '🏢',
                    unlocked: false,
                    unlockLevel: 5,
                    difficulty: 'medium',
                    description: 'Деловой район с корпоративными клиентами'
                },
                station: {
                    id: 'station',
                    name: 'Пригород',
                    type: 'suburban',
                    position: { x: 10, y: 20 },
                    icon: '🚉',
                    unlocked: false,
                    unlockLevel: 10,
                    difficulty: 'hard',
                    description: 'Загородная зона с уникальными товарами'
                },
                industrial: {
                    id: 'industrial',
                    name: 'Промышленная зона',
                    type: 'industrial',
                    position: { x: 80, y: 70 },
                    icon: '🏭',
                    unlocked: false,
                    unlockLevel: 7,
                    difficulty: 'medium',
                    description: 'Промышленный район с оптовыми покупателями'
                }
            },
            connections: [
                { from: 'mall', to: 'residential', enabled: true },
                { from: 'mall', to: 'business', enabled: false },
                { from: 'residential', to: 'station', enabled: false },
                { from: 'business', to: 'industrial', enabled: false }
            ]
        };
    }

    /**
     * Инициализация карты торгового центра
     */
    initializeMallMap() {
        return {
            id: 'mall',
            name: 'Торговый центр',
            type: 'interior',
            background: 'images/backgrounds/mall/mall_interior.jpg',
            locations: {
                products: {
                    id: 'products',
                    name: 'Продуктовый отдел',
                    type: 'department',
                    position: { x: 25, y: 70 },
                    icon: '🛒',
                    unlocked: true,
                    difficulty: 'easy',
                    levels: 7,
                    description: 'Продукты питания и бытовые товары'
                },
                clothing: {
                    id: 'clothing',
                    name: 'Одежда',
                    type: 'department',
                    position: { x: 50, y: 30 },
                    icon: '👕',
                    unlocked: true,
                    difficulty: 'easy',
                    levels: 7,
                    description: 'Одежда и аксессуары'
                },
                electronics: {
                    id: 'electronics',
                    name: 'Электроника',
                    type: 'department',
                    position: { x: 75, y: 50 },
                    icon: '📱',
                    unlocked: false,
                    unlockLevel: 2,
                    difficulty: 'medium',
                    levels: 7,
                    description: 'Электроника и гаджеты'
                },
                furniture: {
                    id: 'furniture',
                    name: 'Мебель',
                    type: 'department',
                    position: { x: 40, y: 80 },
                    icon: '🛋️',
                    unlocked: false,
                    unlockLevel: 3,
                    difficulty: 'medium',
                    levels: 7,
                    description: 'Мебель и предметы интерьера'
                }
            },
            specialAreas: {
                food_court: {
                    name: 'Фуд-корт',
                    position: { x: 60, y: 20 },
                    icon: '🍔',
                    type: 'service'
                },
                management: {
                    name: 'Управление',
                    position: { x: 10, y: 10 },
                    icon: '💼',
                    type: 'administration'
                }
            }
        };
    }

    /**
     * Инициализация карты жилого квартала
     */
    initializeResidentialMap() {
        return {
            id: 'residential',
            name: 'Жилой квартал',
            type: 'residential',
            background: 'images/backgrounds/residential/residential_area.jpg',
            locations: {
                complex: {
                    id: 'complex',
                    name: 'Жилой комплекс',
                    type: 'residential',
                    position: { x: 30, y: 40 },
                    icon: '🏢',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Многоквартирные жилые дома'
                },
                hospital: {
                    id: 'hospital',
                    name: 'Больница',
                    type: 'service',
                    position: { x: 60, y: 30 },
                    icon: '🏥',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Медицинское учреждение'
                },
                library: {
                    id: 'library',
                    name: 'Библиотека',
                    type: 'cultural',
                    position: { x: 40, y: 60 },
                    icon: '📚',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Общественная библиотека'
                },
                service: {
                    id: 'service',
                    name: 'Сервисная служба',
                    type: 'service',
                    position: { x: 70, y: 70 },
                    icon: '🔧',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Бытовые услуги и сервисы'
                }
            }
        };
    }

    /**
     * Инициализация карты бизнес-центра
     */
    initializeBusinessMap() {
        return {
            id: 'business',
            name: 'Бизнес-центр',
            type: 'commercial',
            background: 'images/backgrounds/business/business_center.jpg',
            locations: {
                office: {
                    id: 'office',
                    name: 'Офис',
                    type: 'business',
                    position: { x: 40, y: 50 },
                    icon: '💼',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Деловые переговоры и встречи'
                },
                exchange: {
                    id: 'exchange',
                    name: 'Биржа',
                    type: 'financial',
                    position: { x: 60, y: 30 },
                    icon: '📈',
                    unlocked: false,
                    unlockLevel: 6,
                    difficulty: 'hard',
                    description: 'Торговля акциями и ценными бумагами'
                },
                licensing: {
                    id: 'licensing',
                    name: 'Лицензирование',
                    type: 'administrative',
                    position: { x: 30, y: 70 },
                    icon: '📋',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Оформление документов и лицензий'
                },
                job_center: {
                    id: 'job_center',
                    name: 'Биржа труда',
                    type: 'service',
                    position: { x: 70, y: 60 },
                    icon: '👥',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Подбор персонала и вакансий'
                }
            }
        };
    }

    /**
     * Инициализация карты пригорода
     */
    initializeStationMap() {
        return {
            id: 'station',
            name: 'Пригород',
            type: 'suburban',
            background: 'images/backgrounds/station/countryside.jpg',
            locations: {
                farm: {
                    id: 'farm',
                    name: 'Ферма',
                    type: 'agricultural',
                    position: { x: 20, y: 30 },
                    icon: '🚜',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Сельскохозяйственное производство'
                },
                garden: {
                    id: 'garden',
                    name: 'Сад',
                    type: 'agricultural',
                    position: { x: 40, y: 20 },
                    icon: '🌳',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Фруктовый сад и огород'
                },
                field: {
                    id: 'field',
                    name: 'Поле',
                    type: 'agricultural',
                    position: { x: 60, y: 40 },
                    icon: '🌾',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Зерновые культуры и посадки'
                },
                forest: {
                    id: 'forest',
                    name: 'Лес',
                    type: 'natural',
                    position: { x: 30, y: 60 },
                    icon: '🌲',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Лесные ресурсы и дикая природа'
                },
                mine: {
                    id: 'mine',
                    name: 'Рудник',
                    type: 'industrial',
                    position: { x: 70, y: 70 },
                    icon: '⛏️',
                    unlocked: false,
                    unlockLevel: 12,
                    difficulty: 'hard',
                    description: 'Добыча полезных ископаемых'
                },
                lake: {
                    id: 'lake',
                    name: 'Озеро',
                    type: 'natural',
                    position: { x: 50, y: 80 },
                    icon: '🏞️',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Рыболовство и водные ресурсы'
                },
                dump: {
                    id: 'dump',
                    name: 'Свалка',
                    type: 'industrial',
                    position: { x: 80, y: 50 },
                    icon: '🗑️',
                    unlocked: true,
                    difficulty: 'hard',
                    description: 'Переработка и утилизация'
                },
                snt: {
                    id: 'snt',
                    name: 'СНТ',
                    type: 'residential',
                    position: { x: 10, y: 70 },
                    icon: '🏡',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Садовое некоммерческое товарищество'
                }
            }
        };
    }

    /**
     * Инициализация карты промышленной зоны
     */
    initializeIndustrialMap() {
        return {
            id: 'industrial',
            name: 'Промышленная зона',
            type: 'industrial',
            background: 'images/backgrounds/industrial/industrial_zone.jpg',
            locations: {
                factory: {
                    id: 'factory',
                    name: 'Завод',
                    type: 'industrial',
                    position: { x: 30, y: 40 },
                    icon: '🏭',
                    unlocked: true,
                    difficulty: 'hard',
                    description: 'Крупное промышленное производство'
                },
                manufactory: {
                    id: 'manufactory',
                    name: 'Фабрика',
                    type: 'industrial',
                    position: { x: 60, y: 30 },
                    icon: '⚙️',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Серийное производство товаров'
                },
                assembly: {
                    id: 'assembly',
                    name: 'Сборочные цеха',
                    type: 'industrial',
                    position: { x: 40, y: 60 },
                    icon: '🔧',
                    unlocked: true,
                    difficulty: 'medium',
                    description: 'Финальная сборка продукции'
                },
                warehouse: {
                    id: 'warehouse',
                    name: 'Склад',
                    type: 'logistics',
                    position: { x: 70, y: 70 },
                    icon: '📦',
                    unlocked: true,
                    difficulty: 'easy',
                    description: 'Хранение и логистика товаров'
                }
            }
        };
    }

    /**
     * Инициализация доступных локаций
     */
    async initializeAvailableLocations() {
        // Загрузка прогресса персонажа для проверки разблокировки
        const characterLevel = window.characterSystem?.getCharacter()?.level || 1;
        
        // Проверка всех карт и локаций на разблокировку
        for (const [mapId, mapData] of Object.entries(this.mapsData)) {
            for (const [locationId, location] of Object.entries(mapData.locations)) {
                const isUnlocked = this.checkLocationUnlock(location, characterLevel);
                
                if (isUnlocked) {
                    this.availableLocations.set(locationId, {
                        ...location,
                        map: mapId
                    });
                }
            }
        }
        
        console.log(`Доступно локаций: ${this.availableLocations.size}`);
    }

    /**
     * Проверка разблокировки локации
     */
    checkLocationUnlock(location, characterLevel) {
        // Если локация уже разблокирована по умолчанию
        if (location.unlocked) return true;
        
        // Проверка уровня для разблокировки
        if (location.unlockLevel && characterLevel >= location.unlockLevel) {
            return true;
        }
        
        // Проверка специальных требований
        if (location.unlockRequirement) {
            return this.checkSpecialUnlockRequirement(location.unlockRequirement);
        }
        
        return false;
    }

    /**
     * Проверка специальных требований разблокировки
     */
    checkSpecialUnlockRequirement(requirement) {
        // Здесь могут быть проверки достижений, квестов и т.д.
        switch (requirement) {
            case 'complete_tutorial':
                return window.characterSystem?.isTutorialCompleted('basic_training') || false;
            case 'have_business_license':
                return window.inventorySystem?.hasItem('business_license') || false;
            default:
                return false;
        }
    }

    /**
     * Загрузка карты
     */
    loadMap(mapId) {
        const mapData = this.mapsData[mapId];
        if (!mapData) {
            console.error(`Карта не найдена: ${mapId}`);
            return false;
        }

        this.currentMap = mapData;
        this.currentLocation = null;
        
        // Обновление состояния локаций на карте
        this.updateMapLocationsState();
        
        // Визуализация карты
        this.renderMap();
        
        console.log(`Карта загружена: ${mapData.name}`);
        return true;
    }

    /**
     * Выбор локации на текущей карте
     */
    selectLocation(locationId) {
        if (!this.currentMap) {
            console.error('Карта не загружена');
            return false;
        }

        const location = this.currentMap.locations[locationId];
        if (!location) {
            console.error(`Локация не найдена: ${locationId}`);
            return false;
        }

        // Проверка доступности локации
        if (!this.availableLocations.has(locationId)) {
            console.warn(`Локация недоступна: ${locationId}`);
            this.showLocationLockedMessage(location);
            return false;
        }

        this.currentLocation = location;
        this.playerPosition = { ...location.position };
        
        // Сохранение состояния
        this.saveMapData();
        
        // Навигация к игровому экрану
        this.navigateToGame(location);
        
        console.log(`Выбрана локация: ${location.name}`);
        return true;
    }

    /**
     * Навигация к игровому экрану
     */
    navigateToGame(location) {
        if (window.navigationSystem) {
            const params = {
                location: location.id,
                map: this.currentMap.id,
                difficulty: location.difficulty
            };
            
            window.navigationSystem.navigateTo('game', params);
        } else {
            // Резервная навигация
            window.location.href = `pages/game/game.html?location=${location.id}&map=${this.currentMap.id}`;
        }
    }

    /**
     * Показать сообщение о заблокированной локации
     */
    showLocationLockedMessage(location) {
        let message = `Локация "${location.name}" недоступна.`;
        
        if (location.unlockLevel) {
            message += ` Требуется уровень ${location.unlockLevel}.`;
        }
        
        if (location.unlockRequirement) {
            const requirementMessages = {
                'complete_tutorial': 'Необходимо завершить обучение.',
                'have_business_license': 'Требуется лицензия на бизнес.'
            };
            message += ' ' + (requirementMessages[location.unlockRequirement] || '');
        }
        
        // Показать уведомление
        this.showNotification(message, 'warning');
    }

    /**
     * Обновление состояния локаций на карте
     */
    updateMapLocationsState() {
        if (!this.currentMap) return;
        
        for (const [locationId, location] of Object.entries(this.currentMap.locations)) {
            location.unlocked = this.availableLocations.has(locationId);
        }
    }

    /**
     * Визуализация карты
     */
    renderMap() {
        if (!this.currentMap) return;
        
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
            console.warn('Контейнер карты не найден');
            return;
        }
        
        // Очистка контейнера
        mapContainer.innerHTML = '';
        
        // Создание фона карты
        const mapBackground = document.createElement('div');
        mapBackground.className = 'map-background';
        mapBackground.style.backgroundImage = `url('${this.currentMap.background}')`;
        mapContainer.appendChild(mapBackground);
        
        // Создание маркеров локаций
        this.createLocationMarkers(mapContainer);
        
        // Создание соединений между локациями
        this.createLocationConnections(mapContainer);
        
        // Добавление информации о карте
        this.createMapInfo(mapContainer);
    }

    /**
     * Создание маркеров локаций
     */
    createLocationMarkers(container) {
        for (const [locationId, location] of Object.entries(this.currentMap.locations)) {
            const marker = document.createElement('div');
            marker.className = `location-marker ${location.unlocked ? 'unlocked' : 'locked'}`;
            marker.style.left = `${location.position.x}%`;
            marker.style.top = `${location.position.y}%`;
            marker.innerHTML = `
                <div class="marker-icon">${location.icon}</div>
                <div class="marker-tooltip">
                    <strong>${location.name}</strong>
                    <br>${location.description}
                    ${!location.unlocked && location.unlockLevel ? 
                        `<br><small>Уровень ${location.unlockLevel}</small>` : ''}
                </div>
            `;
            
            if (location.unlocked) {
                marker.addEventListener('click', () => {
                    this.selectLocation(locationId);
                });
            }
            
            container.appendChild(marker);
        }
    }

    /**
     * Создание соединений между локациями
     */
    createLocationConnections(container) {
        if (!this.currentMap.connections) return;
        
        const connectionsContainer = document.createElement('div');
        connectionsContainer.className = 'map-connections';
        
        this.currentMap.connections.forEach(connection => {
            if (!connection.enabled) return;
            
            const fromLocation = this.currentMap.locations[connection.from];
            const toLocation = this.currentMap.locations[connection.to];
            
            if (!fromLocation || !toLocation) return;
            
            const connectionElement = document.createElement('div');
            connectionElement.className = 'map-connection';
            
            // Расчет позиции и длины линии
            const dx = toLocation.position.x - fromLocation.position.x;
            const dy = toLocation.position.y - fromLocation.position.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            connectionElement.style.width = `${length}%`;
            connectionElement.style.left = `${fromLocation.position.x}%`;
            connectionElement.style.top = `${fromLocation.position.y}%`;
            connectionElement.style.transform = `rotate(${angle}deg)`;
            
            connectionsContainer.appendChild(connectionElement);
        });
        
        container.appendChild(connectionsContainer);
    }

    /**
     * Создание информации о карте
     */
    createMapInfo(container) {
        const infoPanel = document.createElement('div');
        infoPanel.className = 'map-info-panel';
        infoPanel.innerHTML = `
            <h2>${this.currentMap.name}</h2>
            <div class="location-stats">
                <span>Доступно: ${this.getUnlockedLocationsCount()}/${this.getTotalLocationsCount()}</span>
            </div>
            <div class="map-actions">
                <button onclick="mapSystem.returnToPreviousMap()">← Назад</button>
                <button onclick="mapSystem.showMapLegend()">Легенда</button>
            </div>
        `;
        
        container.appendChild(infoPanel);
    }

    /**
     * Получение количества разблокированных локаций
     */
    getUnlockedLocationsCount() {
        if (!this.currentMap) return 0;
        return Object.values(this.currentMap.locations).filter(loc => loc.unlocked).length;
    }

    /**
     * Получение общего количества локаций
     */
    getTotalLocationsCount() {
        if (!this.currentMap) return 0;
        return Object.keys(this.currentMap.locations).length;
    }

    /**
     * Возврат к предыдущей карте
     */
    returnToPreviousMap() {
        if (this.currentMap?.type === 'interior' && this.currentMap.id === 'mall') {
            // Возврат из торгового центра в город
            this.loadMap('city');
        } else {
            // Возврат в главное меню или обзор карт
            if (window.navigationSystem) {
                window.navigationSystem.navigateTo('city_map');
            }
        }
    }

    /**
     * Показать легенду карты
     */
    showMapLegend() {
        const legend = document.createElement('div');
        legend.className = 'map-legend-overlay';
        legend.innerHTML = `
            <div class="legend-content">
                <h3>Легенда карты</h3>
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-icon unlocked">🏬</span>
                        <span>Доступная локация</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-icon locked">🔒</span>
                        <span>Заблокированная локация</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-difficulty easy">★</span>
                        <span>Легкая сложность</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-difficulty medium">★★</span>
                        <span>Средняя сложность</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-difficulty hard">★★★</span>
                        <span>Высокая сложность</span>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Закрыть</button>
            </div>
        `;
        
        document.body.appendChild(legend);
    }

    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `map-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * Установка начальной позиции
     */
    setInitialPosition() {
        // Начальная позиция в городе у торгового центра
        this.playerPosition = { x: 50, y: 30 };
    }

    /**
     * Получение текущей позиции игрока
     */
    getPlayerPosition() {
        return { ...this.playerPosition };
    }

    /**
     * Получение текущей карты
     */
    getCurrentMap() {
        return this.currentMap;
    }

    /**
     * Получение текущей локации
     */
    getCurrentLocation() {
        return this.currentLocation;
    }

    /**
     * Получение всех доступных локаций
     */
    getAvailableLocations() {
        return Array.from(this.availableLocations.values());
    }

    /**
     * Проверка доступности локации
     */
    isLocationAvailable(locationId) {
        return this.availableLocations.has(locationId);
    }

    /**
     * Разблокировка новой локации
     */
    unlockLocation(locationId) {
        const location = this.mapsData[this.currentMap?.id]?.locations[locationId];
        if (location && !this.availableLocations.has(locationId)) {
            this.availableLocations.set(locationId, {
                ...location,
                map: this.currentMap.id
            });
            
            this.saveMapData();
            this.showNotification(`Локация "${location.name}" разблокирована!`, 'success');
            return true;
        }
        return false;
    }

    /**
     * Получение статистики по картам
     */
    getMapStatistics() {
        let totalLocations = 0;
        let unlockedLocations = 0;
        
        for (const mapData of Object.values(this.mapsData)) {
            totalLocations += Object.keys(mapData.locations).length;
            unlockedLocations += Object.values(mapData.locations).filter(loc => 
                this.availableLocations.has(loc.id)
            ).length;
        }
        
        return {
            totalMaps: Object.keys(this.mapsData).length,
            totalLocations: totalLocations,
            unlockedLocations: unlockedLocations,
            completionPercentage: Math.round((unlockedLocations / totalLocations) * 100)
        };
    }

    /**
     * Сохранение данных карт
     */
    saveMapData() {
        try {
            const saveData = {
                availableLocations: Array.from(this.availableLocations.keys()),
                playerPosition: this.playerPosition,
                currentMap: this.currentMap?.id,
                currentLocation: this.currentLocation?.id,
                lastSave: Date.now()
            };
            
            localStorage.setItem('mapSystemData', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных карт:', error);
            return false;
        }
    }

    /**
     * Загрузка данных карт
     */
    async loadMapData() {
        try {
            const saved = localStorage.getItem('mapSystemData');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                // Восстановление доступных локаций
                if (saveData.availableLocations) {
                    await this.initializeAvailableLocations(); // Сначала базовая инициализация
                    
                    // Дополнительная разблокировка из сохранения
                    saveData.availableLocations.forEach(locationId => {
                        if (!this.availableLocations.has(locationId)) {
                            // Находим локацию в данных карт
                            for (const mapData of Object.values(this.mapsData)) {
                                if (mapData.locations[locationId]) {
                                    this.availableLocations.set(locationId, {
                                        ...mapData.locations[locationId],
                                        map: mapData.id
                                    });
                                    break;
                                }
                            }
                        }
                    });
                }
                
                // Восстановление позиции
                if (saveData.playerPosition) {
                    this.playerPosition = saveData.playerPosition;
                }
                
                // Восстановление текущей карты
                if (saveData.currentMap) {
                    this.loadMap(saveData.currentMap);
                }
                
                console.log('Данные карт загружены');
                return true;
            }
        } catch (error) {
            console.error('Ошибка загрузки данных карт:', error);
        }
        
        return false;
    }

    /**
     * Сброс системы карт
     */
    reset() {
        this.currentMap = null;
        this.currentLocation = null;
        this.availableLocations.clear();
        this.playerPosition = { x: 0, y: 0 };
        
        localStorage.removeItem('mapSystemData');
        this.initializeAvailableLocations();
        
        console.log('Система карт сброшена');
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.MapSystem = MapSystem;

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    window.mapSystem = new MapSystem();
    await window.mapSystem.init();
    
    // Автоматическая загрузка карты города при входе
    if (window.location.pathname.includes('map') || !window.mapSystem.currentMap) {
        window.mapSystem.loadMap('city');
    }
});
