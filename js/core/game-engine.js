/**
 * Основной игровой движок
 * Управляет игровым циклом, состоянием игры и координацией между системами
 */

class GameEngine {
    constructor() {
        this.gameState = 'menu'; // menu, playing, paused, game_over, victory
        this.gameLoop = null;
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        this.gameTime = 0;
        
        // Системы игры
        this.systems = {
            character: null,
            combat: null,
            inventory: null,
            skills: null,
            opponents: null,
            navigation: null
        };
        
        // Текущая игровая сессия
        this.currentSession = {
            location: null,
            opponent: null,
            startTime: null,
            turns: 0,
            rewards: null
        };
        
        // Статистика игры
        this.statistics = {
            totalPlayTime: 0,
            sessionsCompleted: 0,
            battlesFought: 0,
            moneyEarned: 0,
            itemsCollected: 0
        };
        
        // Настройки игры
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            vibrationsEnabled: true,
            animationsEnabled: true,
            difficulty: 'normal',
            language: 'ru'
        };
        
        this.init();
    }

    /**
     * Инициализация игрового движка
     */
    async init() {
        console.log('Инициализация игрового движка...');
        
        try {
            // Загрузка сохраненных данных
            await this.loadGameData();
            
            // Инициализация систем
            await this.initializeSystems();
            
            // Настройка игрового цикла
            this.setupGameLoop();
            
            // Запуск фоновых процессов
            this.startBackgroundProcesses();
            
            console.log('Игровой движок успешно инициализирован');
            
        } catch (error) {
            console.error('Ошибка инициализации игрового движка:', error);
            this.handleFatalError(error);
        }
    }

    /**
     * Инициализация игровых систем
     */
    async initializeSystems() {
        // Инициализация систем в правильном порядке
        this.systems.character = window.characterSystem || new CharacterSystem();
        this.systems.inventory = window.inventorySystem || new InventorySystem();
        this.systems.skills = window.skillsSystem || new SkillsSystem();
        this.systems.opponents = window.opponentsSystem || new OpponentsSystem();
        this.systems.combat = window.combatSystem || new CombatSystem();
        this.systems.navigation = window.navigationSystem || new NavigationSystem();

        // Проверка готовности систем
        await this.waitForSystemsReady();
        
        // Установка связей между системами
        this.setupSystemConnections();
    }

    /**
     * Ожидание готовности систем
     */
    async waitForSystemsReady() {
        const systems = Object.values(this.systems);
        const readyPromises = systems.map(system => {
            if (system && typeof system.isReady === 'function') {
                return system.isReady();
            }
            return Promise.resolve(true);
        });
        
        await Promise.all(readyPromises);
    }

    /**
     * Установка связей между системами
     */
    setupSystemConnections() {
        // Связь боевой системы с системой персонажа
        if (this.systems.combat && this.systems.character) {
            this.systems.combat.onCombatEnd = (result) => {
                this.handleCombatEnd(result);
            };
        }

        // Связь навигации с игровым движком
        if (this.systems.navigation) {
            this.systems.navigation.onPageChange = (route) => {
                this.handlePageChange(route);
            };
        }

        // Связь инвентаря с системой персонажа
        if (this.systems.inventory && this.systems.character) {
            this.systems.inventory.onMoneyChange = (amount) => {
                this.statistics.moneyEarned += Math.max(0, amount);
            };
        }
    }

    /**
     * Настройка игрового цикла
     */
    setupGameLoop() {
        const updateFrame = (currentTime) => {
            if (!this.lastUpdateTime) {
                this.lastUpdateTime = currentTime;
            }
            
            this.deltaTime = (currentTime - this.lastUpdateTime) / 1000; // в секундах
            this.lastUpdateTime = currentTime;
            this.gameTime += this.deltaTime;
            this.frameCount++;
            
            // Ограничение deltaTime для избежания скачков
            const clampedDelta = Math.min(this.deltaTime, 0.1);
            
            // Обновление состояния игры
            this.update(clampedDelta);
            
            // Запрос следующего кадра
            this.gameLoop = requestAnimationFrame(updateFrame);
        };
        
        this.gameLoop = requestAnimationFrame(updateFrame);
    }

    /**
     * Основной метод обновления игры
     */
    update(deltaTime) {
        try {
            // Обновление в зависимости от состояния игры
            switch (this.gameState) {
                case 'playing':
                    this.updateGameplay(deltaTime);
                    break;
                case 'paused':
                    this.updatePaused(deltaTime);
                    break;
                case 'menu':
                    this.updateMenu(deltaTime);
                    break;
            }
            
            // Обновление статистики
            this.updateStatistics(deltaTime);
            
            // Периодическое сохранение
            if (this.frameCount % 300 === 0) { // Каждые 5 секунд при 60 FPS
                this.autoSave();
            }
            
        } catch (error) {
            console.error('Ошибка в игровом цикле:', error);
            this.handleGameError(error);
        }
    }

    /**
     * Обновление игрового процесса
     */
    updateGameplay(deltaTime) {
        // Обновление боевой системы
        if (this.systems.combat) {
            this.systems.combat.update(deltaTime);
        }
        
        // Обновление временных эффектов
        this.updateTemporaryEffects(deltaTime);
        
        // Обновление UI
        this.updateGameUI();
        
        // Проверка условий победы/поражения
        this.checkGameConditions();
    }

    /**
     * Обновление временных эффектов
     */
    updateTemporaryEffects(deltaTime) {
        // Обновление баффов персонажа
        if (this.systems.character) {
            this.systems.character.updateTemporaryBuffs();
        }
        
        // Обновление баффов в бою
        if (this.systems.combat) {
            this.systems.combat.updateBuffs();
        }
    }

    /**
     * Обновление игрового UI
     */
    updateGameUI() {
        // Обновление показателей персонажа
        this.updateCharacterUI();
        
        // Обновление состояния противника
        this.updateOpponentUI();
        
        // Обновление умений
        this.updateSkillsUI();
    }

    /**
     * Обновление UI персонажа
     */
    updateCharacterUI() {
        if (!this.systems.character) return;
        
        const character = this.systems.character.getCharacter();
        const elements = {
            endurance: document.getElementById('enduranceValue'),
            stress: document.getElementById('stressResistanceValue'),
            level: document.getElementById('characterLevel'),
            money: document.getElementById('characterMoney')
        };
        
        Object.keys(elements).forEach(key => {
            if (elements[key] && character[key] !== undefined) {
                elements[key].textContent = character[key];
            }
        });
    }

    /**
     * Обновление UI противника
     */
    updateOpponentUI() {
        if (!this.systems.combat || !this.currentSession.opponent) return;
        
        const opponent = this.systems.combat.getCombatInfo().opponent;
        const healthElement = document.getElementById('opponentHealth');
        
        if (healthElement && opponent) {
            const healthPercent = (opponent.health / opponent.maxHealth) * 100;
            healthElement.style.width = `${healthPercent}%`;
            healthElement.textContent = `${opponent.health}/${opponent.maxHealth}`;
        }
    }

    /**
     * Обновление UI умений
     */
    updateSkillsUI() {
        if (!this.systems.skills || !this.systems.combat) return;
        
        const equippedSkills = this.systems.skills.getEquippedSkills();
        equippedSkills.forEach(skill => {
            const button = document.getElementById(`skill-${skill.id}`);
            if (button) {
                const cooldownState = this.systems.combat.getCooldownState(skill.id);
                
                // Обновление состояния кнопки
                button.disabled = !cooldownState.canUse;
                
                // Обновление отката
                const cooldownElement = button.querySelector('.cooldown-overlay');
                if (cooldownElement) {
                    if (cooldownState.skillCooldown > 0) {
                        cooldownElement.textContent = cooldownState.skillCooldown;
                        cooldownElement.style.display = 'flex';
                    } else {
                        cooldownElement.style.display = 'none';
                    }
                }
            }
        });
    }

    /**
     * Проверка игровых условий
     */
    checkGameConditions() {
        if (!this.systems.combat || !this.systems.character) return;
        
        const combatResult = this.systems.combat.checkCombatEnd(
            this.systems.character.getCharacter()
        );
        
        if (combatResult !== 'continue') {
            this.handleCombatEnd(combatResult);
        }
    }

    /**
     * Обработка окончания боя
     */
    handleCombatEnd(result) {
        console.log('Бой завершен:', result);
        
        this.currentSession.turns++;
        
        if (typeof result === 'object' && result.result === 'victory') {
            this.handleVictory(result.rewards);
        } else {
            this.handleDefeat(result);
        }
        
        // Обновление статистики
        this.statistics.battlesFought++;
        
        // Сохранение прогресса
        this.saveGameData();
    }

    /**
     * Обработка победы
     */
    handleVictory(rewards) {
        this.gameState = 'victory';
        this.currentSession.rewards = rewards;
        
        // Применение наград
        if (rewards) {
            if (rewards.money && this.systems.character) {
                this.systems.character.addMoney(rewards.money);
            }
            
            if (rewards.experience && this.systems.character) {
                this.systems.character.addExperience(rewards.experience);
            }
            
            if (rewards.items && this.systems.inventory) {
                rewards.items.forEach(item => {
                    this.systems.inventory.addItem(item.id, item.quantity);
                });
            }
        }
        
        // Навигация на экран победы
        if (this.systems.navigation) {
            this.systems.navigation.navigateTo('victory', { rewards: rewards });
        }
        
        // Воспроизведение звука победы
        this.playSound('victory');
    }

    /**
     * Обработка поражения
     */
    handleDefeat(reason) {
        this.gameState = 'defeat';
        
        // Навигация на экран поражения
        if (this.systems.navigation) {
            this.systems.navigation.navigateTo('defeat', { reason: reason });
        }
        
        // Воспроизведение звука поражения
        this.playSound('defeat');
    }

    /**
     * Запуск новой игровой сессии
     */
    startNewSession(location, opponent) {
        if (this.gameState === 'playing') {
            this.endCurrentSession();
        }
        
        this.gameState = 'playing';
        this.currentSession = {
            location: location,
            opponent: opponent,
            startTime: Date.now(),
            turns: 0,
            rewards: null
        };
        
        // Инициализация боя
        if (this.systems.combat && opponent) {
            this.systems.combat.startCombat(opponent);
        }
        
        // Регистрация встречи с противником
        if (this.systems.opponents && opponent) {
            this.systems.opponents.registerEncounter(opponent.id);
        }
        
        console.log('Новая игровая сессия начата:', location, opponent.name);
    }

    /**
     * Завершение текущей сессии
     */
    endCurrentSession() {
        if (this.currentSession.startTime) {
            const sessionTime = Date.now() - this.currentSession.startTime;
            this.statistics.totalPlayTime += sessionTime;
            this.statistics.sessionsCompleted++;
        }
        
        this.currentSession = {
            location: null,
            opponent: null,
            startTime: null,
            turns: 0,
            rewards: null
        };
        
        // Сброс боевой системы
        if (this.systems.combat) {
            this.systems.combat.reset();
        }
    }

    /**
     * Пауза игры
     */
    pauseGame() {
        if (this.gameState === 'playing') {
            this.previousState = this.gameState;
            this.gameState = 'paused';
            this.playSound('pause');
        }
    }

    /**
     * Возобновление игры
     */
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = this.previousState || 'menu';
            this.playSound('resume');
        }
    }

    /**
     * Перезапуск игры
     */
    restartGame() {
        this.endCurrentSession();
        this.gameState = 'menu';
        
        // Сброс прогресса (опционально)
        // this.resetProgress();
        
        // Навигация в главное меню
        if (this.systems.navigation) {
            this.systems.navigation.navigateTo('main_menu');
        }
    }

    /**
     * Обновление статистики
     */
    updateStatistics(deltaTime) {
        if (this.gameState === 'playing') {
            this.statistics.totalPlayTime += deltaTime;
        }
    }

    /**
     * Воспроизведение звука
     */
    playSound(soundName) {
        if (!this.settings.soundEnabled) return;
        
        // Здесь будет логика воспроизведения звуков
        console.log('Воспроизведение звука:', soundName);
        
        // Виброотдача для Telegram
        if (this.settings.vibrationsEnabled && window.Telegram?.WebApp?.HapticFeedback) {
            const hapticTypes = {
                victory: 'heavy',
                defeat: 'medium',
                pause: 'light',
                resume: 'light'
            };
            
            if (hapticTypes[soundName]) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred(hapticTypes[soundName]);
            }
        }
    }

    /**
     * Автосохранение
     */
    async autoSave() {
        try {
            await this.saveGameData();
            console.log('Игра автоматически сохранена');
        } catch (error) {
            console.error('Ошибка автосохранения:', error);
        }
    }

    /**
     * Сохранение данных игры
     */
    async saveGameData() {
        const saveData = {
            statistics: this.statistics,
            settings: this.settings,
            character: this.systems.character?.exportCharacterData(),
            inventory: this.systems.inventory?.getInventoryInfo(),
            skills: this.systems.skills?.exportSkillsData(),
            lastSave: Date.now()
        };
        
        try {
            localStorage.setItem('gameSaveData', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения игры:', error);
            return false;
        }
    }

    /**
     * Загрузка данных игры
     */
    async loadGameData() {
        try {
            const saved = localStorage.getItem('gameSaveData');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                // Загрузка статистики
                if (saveData.statistics) {
                    this.statistics = { ...this.statistics, ...saveData.statistics };
                }
                
                // Загрузка настроек
                if (saveData.settings) {
                    this.settings = { ...this.settings, ...saveData.settings };
                }
                
                console.log('Данные игры загружены');
                return true;
            }
        } catch (error) {
            console.error('Ошибка загрузки игры:', error);
        }
        
        return false;
    }

    /**
     * Сброс прогресса игры
     */
    resetProgress() {
        // Сброс систем
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.reset === 'function') {
                system.reset();
            }
        });
        
        // Сброс статистики
        this.statistics = {
            totalPlayTime: 0,
            sessionsCompleted: 0,
            battlesFought: 0,
            moneyEarned: 0,
            itemsCollected: 0
        };
        
        // Сброс текущей сессии
        this.endCurrentSession();
        
        // Очистка сохранений
        localStorage.removeItem('gameSaveData');
        
        console.log('Прогресс игры сброшен');
    }

    /**
     * Запуск фоновых процессов
     */
    startBackgroundProcesses() {
        // Периодическое обновление данных
        setInterval(() => {
            this.backgroundUpdate();
        }, 60000); // Каждую минуту
        
        // Автосохранение каждые 2 минуты
        setInterval(() => {
            this.autoSave();
        }, 120000);
    }

    /**
     * Фоновое обновление
     */
    backgroundUpdate() {
        // Обновление кэша
        this.updateCache();
        
        // Проверка обновлений
        this.checkForUpdates();
        
        // Сбор аналитики
        this.collectAnalytics();
    }

    /**
     * Обновление кэша
     */
    updateCache() {
        // Очистка устаревших данных
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа
        
        // Здесь может быть логика очистки кэша
    }

    /**
     * Проверка обновлений
     */
    checkForUpdates() {
        // В реальном приложении здесь будет проверка обновлений на сервере
        console.log('Проверка обновлений...');
    }

    /**
     * Сбор аналитики
     */
    collectAnalytics() {
        const analyticsData = {
            playTime: this.statistics.totalPlayTime,
            battles: this.statistics.battlesFought,
            sessions: this.statistics.sessionsCompleted,
            money: this.statistics.moneyEarned,
            frameRate: this.calculateFrameRate()
        };
        
        // Отправка аналитики (в реальном приложении)
        console.log('Аналитика:', analyticsData);
    }

    /**
     * Расчет FPS
     */
    calculateFrameRate() {
        return this.deltaTime > 0 ? Math.round(1 / this.deltaTime) : 0;
    }

    /**
     * Обработка ошибок игры
     */
    handleGameError(error) {
        console.error('Игровая ошибка:', error);
        
        // Попытка восстановления
        this.tryRecovery();
        
        // Уведомление пользователя
        this.showErrorNotification('Произошла ошибка в игре. Попробуйте перезапустить.');
    }

    /**
     * Обработка фатальных ошибок
     */
    handleFatalError(error) {
        console.error('Фатальная ошибка:', error);
        
        // Экстренное сохранение
        this.emergencySave();
        
        // Показать экран ошибки
        this.showFatalErrorScreen(error);
    }

    /**
     * Попытка восстановления
     */
    tryRecovery() {
        // Сброс проблемных систем
        if (this.systems.combat) {
            this.systems.combat.reset();
        }
        
        // Возврат в безопасное состояние
        this.gameState = 'menu';
        
        console.log('Попытка восстановления выполнена');
    }

    /**
     * Экстренное сохранение
     */
    emergencySave() {
        try {
            const emergencyData = {
                character: this.systems.character?.exportCharacterData(),
                inventory: this.systems.inventory?.getInventoryInfo(),
                timestamp: Date.now(),
                emergency: true
            };
            
            localStorage.setItem('emergencySave', JSON.stringify(emergencyData));
        } catch (error) {
            console.error('Ошибка экстренного сохранения:', error);
        }
    }

    /**
     * Показать уведомление об ошибке
     */
    showErrorNotification(message) {
        // Создание уведомления
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚠️</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Показать экран фатальной ошибки
     */
    showFatalErrorScreen(error) {
        const errorScreen = document.createElement('div');
        errorScreen.className = 'fatal-error-screen';
        errorScreen.innerHTML = `
            <div class="error-container">
                <div class="error-icon">💥</div>
                <h1>Критическая ошибка</h1>
                <p>Игра столкнулась с непредвиденной ошибкой.</p>
                <p><small>${error.message}</small></p>
                <div class="error-actions">
                    <button onclick="location.reload()">Перезагрузить</button>
                    <button onclick="gameEngine.resetProgress()">Сбросить прогресс</button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(errorScreen);
    }

    /**
     * Получить состояние игры
     */
    getGameState() {
        return {
            state: this.gameState,
            session: this.currentSession,
            statistics: this.statistics,
            settings: this.settings,
            systems: Object.keys(this.systems).reduce((acc, key) => {
                acc[key] = this.systems[key] ? 'ready' : 'not_initialized';
                return acc;
            }, {})
        };
    }

    /**
     * Уничтожение игрового движка
     */
    destroy() {
        // Остановка игрового цикла
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        
        // Сохранение перед выходом
        this.saveGameData();
        
        // Очистка ресурсов
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.destroy === 'function') {
                system.destroy();
            }
        });
        
        console.log('Игровой движок уничтожен');
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.GameEngine = GameEngine;

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    window.gameEngine = new GameEngine();
    await window.gameEngine.init();
});
