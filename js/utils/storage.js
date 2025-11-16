/**
 * Система управления сохранениями и хранилищем
 * Управляет сохранением, загрузкой, миграцией и резервным копированием игровых данных
 */

class StorageSystem {
    constructor() {
        this.storageKey = 'economic_simulator_save';
        this.backupKey = 'economic_simulator_backup';
        this.version = '1.0.0';
        this.autoSaveInterval = 30000; // 30 секунд
        this.maxBackups = 5;
        this.autoSaveTimer = null;
        
        // Схема данных для валидации
        this.dataSchema = {
            character: ['level', 'experience', 'money', 'endurance', 'stressResistance'],
            inventory: ['items', 'money'],
            skills: ['skills', 'equippedSkills'],
            map: ['availableLocations', 'currentMap'],
            settings: ['soundEnabled', 'musicEnabled', 'language'],
            statistics: ['totalPlayTime', 'battlesFought', 'moneyEarned']
        };
        
        this.init();
    }

    /**
     * Инициализация системы хранилища
     */
    async init() {
        console.log('Инициализация системы хранилища...');
        
        try {
            // Проверка поддержки localStorage
            if (!this.isStorageSupported()) {
                throw new Error('localStorage не поддерживается');
            }
            
            // Проверка существующих сохранений
            await this.checkExistingSaves();
            
            // Запуск автосохранения
            this.startAutoSave();
            
            // Создание начального бэкапа
            await this.createBackup();
            
            console.log('Система хранилища успешно инициализирована');
            
        } catch (error) {
            console.error('Ошибка инициализации системы хранилища:', error);
            this.handleStorageError(error);
        }
    }

    /**
     * Полное сохранение игры
     */
    async saveGame() {
        try {
            const saveData = await this.collectSaveData();
            const validatedData = this.validateSaveData(saveData);
            
            if (!validatedData.valid) {
                throw new Error(`Невалидные данные сохранения: ${validatedData.errors.join(', ')}`);
            }
            
            const success = this.saveToStorage(validatedData.data);
            
            if (success) {
                this.onSaveSuccess(saveData);
                return { success: true, timestamp: Date.now() };
            } else {
                throw new Error('Не удалось сохранить данные');
            }
            
        } catch (error) {
            console.error('Ошибка сохранения игры:', error);
            this.onSaveError(error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Сбор данных для сохранения
     */
    async collectSaveData() {
        const systems = [
            'characterSystem',
            'inventorySystem', 
            'skillsSystem',
            'mapSystem',
            'gameEngine',
            'opponentsSystem'
        ];
        
        const saveData = {
            version: this.version,
            timestamp: Date.now(),
            data: {}
        };
        
        // Сбор данных из всех систем
        for (const systemName of systems) {
            const system = window[systemName];
            if (system && typeof system.exportData === 'function') {
                try {
                    saveData.data[systemName] = await system.exportData();
                } catch (error) {
                    console.warn(`Не удалось собрать данные из ${systemName}:`, error);
                    saveData.data[systemName] = null;
                }
            }
        }
        
        // Дополнительные мета-данные
        saveData.metadata = {
            playTime: window.gameEngine?.statistics?.totalPlayTime || 0,
            playerLevel: window.characterSystem?.getCharacter()?.level || 1,
            money: window.characterSystem?.getCharacter()?.money || 0,
            location: window.mapSystem?.getCurrentLocation()?.name || 'unknown'
        };
        
        return saveData;
    }

    /**
     * Валидация данных сохранения
     */
    validateSaveData(saveData) {
        const errors = [];
        
        // Проверка обязательных полей
        if (!saveData.version) errors.push('Отсутствует версия');
        if (!saveData.timestamp) errors.push('Отсутствует временная метка');
        if (!saveData.data) errors.push('Отсутствуют данные');
        
        // Проверка структуры данных
        if (saveData.data) {
            for (const [system, schema] of Object.entries(this.dataSchema)) {
                if (saveData.data[`${system}System`]) {
                    const systemData = saveData.data[`${system}System`];
                    for (const field of schema) {
                        if (systemData[field] === undefined) {
                            errors.push(`${system}.${field} отсутствует`);
                        }
                    }
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            data: saveData
        };
    }

    /**
     * Загрузка сохранения игры
     */
    async loadGame(slot = 'auto') {
        try {
            const saveData = this.loadFromStorage(slot);
            
            if (!saveData) {
                throw new Error('Сохранение не найдено');
            }
            
            // Проверка версии
            if (saveData.version !== this.version) {
                console.warn(`Версия сохранения (${saveData.version}) отличается от текущей (${this.version})`);
                await this.migrateSaveData(saveData);
            }
            
            // Восстановление данных
            await this.restoreSaveData(saveData.data);
            
            this.onLoadSuccess(saveData);
            return { success: true, data: saveData };
            
        } catch (error) {
            console.error('Ошибка загрузки игры:', error);
            this.onLoadError(error);
            
            // Попытка загрузки из бэкапа
            return this.loadFromBackup();
        }
    }

    /**
     * Восстановление данных из сохранения
     */
    async restoreSaveData(data) {
        const systems = [
            'characterSystem',
            'inventorySystem',
            'skillsSystem', 
            'mapSystem',
            'gameEngine',
            'opponentsSystem'
        ];
        
        for (const systemName of systems) {
            const system = window[systemName];
            const systemData = data[systemName];
            
            if (system && systemData && typeof system.importData === 'function') {
                try {
                    await system.importData(systemData);
                } catch (error) {
                    console.error(`Ошибка восстановления ${systemName}:`, error);
                }
            }
        }
    }

    /**
     * Миграция данных сохранения
     */
    async migrateSaveData(saveData) {
        console.log('Миграция данных сохранения...');
        
        const migrations = {
            '0.9.0': (data) => this.migrateFromV0_9_0(data),
            '1.0.0': (data) => this.migrateFromV1_0_0(data)
        };
        
        let currentVersion = saveData.version;
        
        while (currentVersion !== this.version && migrations[currentVersion]) {
            console.log(`Миграция с ${currentVersion}...`);
            saveData = await migrations[currentVersion](saveData);
            currentVersion = this.getNextVersion(currentVersion);
        }
        
        return saveData;
    }

    /**
     * Миграция с версии 0.9.0
     */
    async migrateFromV0_9_0(data) {
        // Пример миграции - добавление новых полей
        if (data.data.characterSystem) {
            data.data.characterSystem.stressResistance = data.data.characterSystem.stressResistance || 100;
        }
        
        data.version = '1.0.0';
        return data;
    }

    /**
     * Миграция с версии 1.0.0
     */
    async migrateFromV1_0_0(data) {
        // Будущие миграции
        data.version = this.version;
        return data;
    }

    /**
     * Получение следующей версии для миграции
     */
    getNextVersion(currentVersion) {
        const versionMap = {
            '0.9.0': '1.0.0',
            '1.0.0': this.version
        };
        
        return versionMap[currentVersion] || this.version;
    }

    /**
     * Удаление сохранения
     */
    deleteSave(slot = 'auto') {
        try {
            const key = this.getStorageKey(slot);
            localStorage.removeItem(key);
            
            // Удаление связанных бэкапов
            this.cleanupBackups(slot);
            
            this.onDeleteSuccess(slot);
            return { success: true };
            
        } catch (error) {
            console.error('Ошибка удаления сохранения:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Создание резервной копии
     */
    async createBackup() {
        try {
            const saveData = await this.collectSaveData();
            const backups = this.getBackups();
            
            // Добавление новой резервной копии
            backups.unshift({
                data: saveData,
                timestamp: Date.now(),
                slot: 'auto'
            });
            
            // Ограничение количества бэкапов
            if (backups.length > this.maxBackups) {
                backups.splice(this.maxBackups);
            }
            
            // Сохранение бэкапов
            this.saveToStorage(backups, this.backupKey);
            
            console.log(`Резервная копия создана. Всего бэкапов: ${backups.length}`);
            return { success: true, count: backups.length };
            
        } catch (error) {
            console.error('Ошибка создания резервной копии:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Загрузка из резервной копии
     */
    async loadFromBackup(backupIndex = 0) {
        try {
            const backups = this.getBackups();
            
            if (backups.length === 0) {
                throw new Error('Резервные копии не найдены');
            }
            
            if (backupIndex >= backups.length) {
                throw new Error('Указанный бэкап не существует');
            }
            
            const backup = backups[backupIndex];
            await this.restoreSaveData(backup.data.data);
            
            console.log(`Восстановлено из резервной копии от ${new Date(backup.timestamp).toLocaleString()}`);
            return { success: true, data: backup.data };
            
        } catch (error) {
            console.error('Ошибка загрузки из резервной копии:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Получение списка резервных копий
     */
    getBackups() {
        try {
            return this.loadFromStorage('backups', this.backupKey) || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Очистка устаревших бэкапов
     */
    cleanupBackups(slot = 'auto') {
        const backups = this.getBackups();
        const cleaned = backups.filter(backup => backup.slot !== slot);
        
        if (cleaned.length !== backups.length) {
            this.saveToStorage(cleaned, this.backupKey);
            console.log(`Очищено ${backups.length - cleaned.length} бэкапов для слота ${slot}`);
        }
    }

    /**
     * Экспорт сохранения в файл
     */
    async exportSave(slot = 'auto') {
        try {
            const saveData = this.loadFromStorage(slot);
            
            if (!saveData) {
                throw new Error('Сохранение не найдено');
            }
            
            const blob = new Blob([JSON.stringify(saveData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `economic_simulator_save_${slot}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return { success: true, filename: a.download };
            
        } catch (error) {
            console.error('Ошибка экспорта сохранения:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Импорт сохранения из файла
     */
    async importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Валидация импортированных данных
                    const validated = this.validateSaveData(saveData);
                    if (!validated.valid) {
                        throw new Error(`Невалидный файл сохранения: ${validated.errors.join(', ')}`);
                    }
                    
                    // Сохранение импортированных данных
                    this.saveToStorage(validated.data);
                    
                    // Загрузка импортированного сохранения
                    await this.loadGame();
                    
                    resolve({ success: true, data: saveData });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsText(file);
        });
    }

    /**
     * Получение информации о сохранениях
     */
    getSaveInfo() {
        const saves = {};
        const slots = ['auto', 'slot1', 'slot2', 'slot3'];
        
        for (const slot of slots) {
            try {
                const saveData = this.loadFromStorage(slot);
                if (saveData) {
                    saves[slot] = {
                        exists: true,
                        timestamp: saveData.timestamp,
                        version: saveData.version,
                        metadata: saveData.metadata || {},
                        size: JSON.stringify(saveData).length
                    };
                } else {
                    saves[slot] = { exists: false };
                }
            } catch (error) {
                saves[slot] = { exists: false, error: error.message };
            }
        }
        
        // Информация о бэкапах
        const backups = this.getBackups();
        
        return {
            saves: saves,
            backups: {
                count: backups.length,
                latest: backups[0]?.timestamp || null
            },
            storage: {
                total: this.getStorageUsage(),
                available: this.getAvailableStorage(),
                supported: this.isStorageSupported()
            }
        };
    }

    /**
     * Получение использования хранилища
     */
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }

    /**
     * Получение доступного места в хранилище
     */
    getAvailableStorage() {
        // Приблизительная оценка доступного места
        try {
            const testKey = 'storage_test';
            const testData = 'x'.repeat(1024); // 1KB
            let count = 0;
            
            while (count < 10000) { // Максимум 10MB теста
                localStorage.setItem(testKey + count, testData);
                count++;
            }
        } catch (e) {
            // Достигнут лимит
        }
        
        // Очистка тестовых данных
        for (let i = 0; i < 10000; i++) {
            localStorage.removeItem('storage_test' + i);
        }
        
        return this.getStorageUsage();
    }

    /**
     * Сохранение в localStorage
     */
    saveToStorage(data, customKey = null) {
        try {
            const key = customKey || this.getStorageKey();
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
            return false;
        }
    }

    /**
     * Загрузка из localStorage
     */
    loadFromStorage(slot = 'auto', customKey = null) {
        try {
            const key = customKey || this.getStorageKey(slot);
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error);
            return null;
        }
    }

    /**
     * Генерация ключа хранилища
     */
    getStorageKey(slot = 'auto') {
        return `${this.storageKey}_${slot}`;
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
     * Запуск автосохранения
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(async () => {
            if (window.gameEngine?.gameState === 'playing') {
                await this.saveGame();
            }
        }, this.autoSaveInterval);
    }

    /**
     * Остановка автосохранения
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Обработчик успешного сохранения
     */
    onSaveSuccess(saveData) {
        console.log('Игра успешно сохранена', {
            timestamp: new Date(saveData.timestamp).toLocaleString(),
            version: saveData.version,
            location: saveData.metadata?.location
        });
        
        // Визуальное уведомление
        this.showNotification('Игра сохранена', 'success');
        
        // Создание бэкапа при значительных изменениях
        if (this.shouldCreateBackup(saveData)) {
            this.createBackup();
        }
    }

    /**
     * Обработчик ошибки сохранения
     */
    onSaveError(error) {
        console.error('Ошибка сохранения:', error);
        this.showNotification('Ошибка сохранения игры', 'error');
        
        // Попытка экстренного сохранения
        this.emergencySave();
    }

    /**
     * Обработчик успешной загрузки
     */
    onLoadSuccess(saveData) {
        console.log('Игра успешно загружена', {
            timestamp: new Date(saveData.timestamp).toLocaleString(),
            version: saveData.version
        });
        
        this.showNotification('Игра загружена', 'success');
    }

    /**
     * Обработчик ошибки загрузки
     */
    onLoadError(error) {
        console.error('Ошибка загрузки:', error);
        this.showNotification('Ошибка загрузки игры', 'error');
    }

    /**
     * Обработчик успешного удаления
     */
    onDeleteSuccess(slot) {
        console.log(`Сохранение ${slot} удалено`);
        this.showNotification('Сохранение удалено', 'info');
    }

    /**
     * Проверка необходимости создания бэкапа
     */
    shouldCreateBackup(saveData) {
        const lastBackup = this.getBackups()[0];
        if (!lastBackup) return true;
        
        // Создавать бэкап при значительном прогрессе
        const timeDiff = saveData.timestamp - lastBackup.timestamp;
        const levelDiff = saveData.metadata.playerLevel - (lastBackup.data.metadata?.playerLevel || 1);
        
        return timeDiff > 3600000 || levelDiff >= 2; // 1 час или +2 уровня
    }

    /**
     * Экстренное сохранение
     */
    async emergencySave() {
        try {
            const minimalData = {
                version: this.version,
                timestamp: Date.now(),
                data: {
                    characterSystem: window.characterSystem?.exportData() || {},
                    inventorySystem: window.inventorySystem?.getInventoryInfo() || {}
                }
            };
            
            const emergencyKey = `${this.storageKey}_emergency`;
            localStorage.setItem(emergencyKey, JSON.stringify(minimalData));
            
            console.log('Экстренное сохранение выполнено');
        } catch (error) {
            console.error('Ошибка экстренного сохранения:', error);
        }
    }

    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        // Создание уведомления в UI
        if (window.helpers) {
            window.helpers.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Обработка ошибок хранилища
     */
    handleStorageError(error) {
        console.error('Критическая ошибка хранилища:', error);
        
        // Переключение на резервный режим
        this.stopAutoSave();
        
        // Уведомление пользователя
        this.showNotification('Проблемы с сохранением игры. Прогресс может быть потерян.', 'warning');
    }

    /**
     * Проверка существующих сохранений
     */
    async checkExistingSaves() {
        const saveInfo = this.getSaveInfo();
        
        if (!saveInfo.saves.auto.exists && Object.keys(saveInfo.saves).some(s => s.exists)) {
            // Есть сохранения, но нет автосохранения - возможно, миграция нужна
            console.log('Обнаружены старые сохранения, выполняется проверка...');
        }
        
        return saveInfo;
    }

    /**
     * Очистка всех данных
     */
    clearAllData() {
        try {
            // Удаление всех сохранений игры
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.storageKey) || key.startsWith(this.backupKey)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log('Все данные игры очищены');
            return { success: true, removed: keysToRemove.length };
            
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Уничтожение системы хранилища
     */
    destroy() {
        this.stopAutoSave();
        console.log('Система хранилища уничтожена');
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.StorageSystem = StorageSystem;

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    window.storageSystem = new StorageSystem();
    await window.storageSystem.init();
    
    // Автоматическая загрузка последнего сохранения
    if (window.location.search.includes('load=true')) {
        setTimeout(async () => {
            const result = await window.storageSystem.loadGame();
            if (!result.success) {
                console.log('Новое сохранение не найдено, начинаем новую игру');
            }
        }, 1000);
    }
});
