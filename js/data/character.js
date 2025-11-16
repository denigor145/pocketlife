/**
 * Система характеристик персонажа
 * Управляет основными характеристиками, уровнем, опытом и прогрессом
 */

class CharacterSystem {
    constructor() {
        this.character = {
            // Основные характеристики
            endurance: 100,
            maxEndurance: 100,
            stressResistance: 100,
            maxStressResistance: 100,
            
            // Прогресс
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            
            // Экономика
            money: 100,
            totalMoneyEarned: 0,
            
            // Статистика
            battlesWon: 0,
            battlesLost: 0,
            totalSales: 0,
            skillsUsed: 0,
            
            // Разблокировки
            unlockedLocations: ['products', 'clothing'],
            unlockedSkills: [1, 2, 3, 4, 5], // Базовые умения
            completedTutorials: ['main_menu', 'first_sale'],
            
            // Временные модификаторы
            temporaryBuffs: [],
            
            // Внешний вид (для будущего использования)
            appearance: {
                avatar: '👨‍💼',
                theme: 'default'
            }
        };
        
        this.loadFromStorage();
    }

    /**
     * Инициализация нового персонажа
     */
    initializeNewCharacter() {
        this.character = {
            endurance: 100,
            maxEndurance: 100,
            stressResistance: 100,
            maxStressResistance: 100,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            money: 100,
            totalMoneyEarned: 0,
            battlesWon: 0,
            battlesLost: 0,
            totalSales: 0,
            skillsUsed: 0,
            unlockedLocations: ['products', 'clothing'],
            unlockedSkills: [1, 2, 3, 4, 5],
            completedTutorials: ['main_menu', 'first_sale'],
            temporaryBuffs: [],
            appearance: {
                avatar: '👨‍💼',
                theme: 'default'
            }
        };
        
        this.saveToStorage();
    }

    /**
     * Получить текущее состояние персонажа
     */
    getCharacter() {
        return {
            ...this.character,
            // Вычисляемые поля
            endurancePercent: (this.character.endurance / this.character.maxEndurance) * 100,
            stressPercent: (this.character.stressResistance / this.character.maxStressResistance) * 100,
            experiencePercent: (this.character.experience / this.character.experienceToNextLevel) * 100,
            levelProgress: this.calculateLevelProgress()
        };
    }

    /**
     * Расчет прогресса уровня
     */
    calculateLevelProgress() {
        const currentLevelExp = this.getExperienceForLevel(this.character.level);
        const nextLevelExp = this.getExperienceForLevel(this.character.level + 1);
        const expInCurrentLevel = this.character.experience - currentLevelExp;
        const expNeeded = nextLevelExp - currentLevelExp;
        
        return {
            current: expInCurrentLevel,
            needed: expNeeded,
            percent: (expInCurrentLevel / expNeeded) * 100
        };
    }

    /**
     * Получить необходимое количество опыта для уровня
     */
    getExperienceForLevel(level) {
        // Формула: 100 * level^1.5
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    /**
     * Добавить опыт
     * @param {number} exp - количество опыта
     * @returns {Object} информация о повышении уровня
     */
    addExperience(exp) {
        if (exp <= 0) return { leveledUp: false };
        
        const oldLevel = this.character.level;
        this.character.experience += exp;
        
        // Проверка повышения уровня
        let leveledUp = false;
        while (this.character.experience >= this.character.experienceToNextLevel) {
            this.levelUp();
            leveledUp = true;
        }
        
        this.saveToStorage();
        return {
            leveledUp: leveledUp,
            oldLevel: oldLevel,
            newLevel: this.character.level,
            experienceGained: exp
        };
    }

    /**
     * Повышение уровня
     */
    levelUp() {
        this.character.level++;
        
        // Увеличение максимальных характеристик
        this.character.maxEndurance += 5;
        this.character.maxStressResistance += 5;
        
        // Полное восстановление при повышении уровня
        this.character.endurance = this.character.maxEndurance;
        this.character.stressResistance = this.character.maxStressResistance;
        
        // Расчет опыта для следующего уровня
        this.character.experienceToNextLevel = this.getExperienceForLevel(this.character.level + 1);
        
        // Разблокировка контента по уровням
        this.unlockContentByLevel();
        
        console.log(`Уровень повышен! Новый уровень: ${this.character.level}`);
    }

    /**
     * Разблокировка контента по уровням
     */
    unlockContentByLevel() {
        const levelUnlocks = {
            2: { locations: ['electronics'], skills: [] },
            3: { locations: ['furniture'], skills: [] },
            5: { locations: ['business'], skills: [] },
            7: { locations: ['industrial'], skills: [] },
            10: { locations: ['station'], skills: [] }
        };

        if (levelUnlocks[this.character.level]) {
            const unlocks = levelUnlocks[this.character.level];
            
            unlocks.locations.forEach(location => {
                if (!this.character.unlockedLocations.includes(location)) {
                    this.character.unlockedLocations.push(location);
                    console.log(`Разблокирована локация: ${location}`);
                }
            });

            unlocks.skills.forEach(skillId => {
                if (!this.character.unlockedSkills.includes(skillId)) {
                    this.character.unlockedSkills.push(skillId);
                    console.log(`Разблокировано умение: ${skillId}`);
                }
            });
        }
    }

    /**
     * Изменить выносливость
     * @param {number} amount - количество (может быть отрицательным)
     * @returns {Object} результат изменения
     */
    changeEndurance(amount) {
        const oldValue = this.character.endurance;
        this.character.endurance = Math.max(0, Math.min(this.character.maxEndurance, this.character.endurance + amount));
        
        this.saveToStorage();
        return {
            oldValue: oldValue,
            newValue: this.character.endurance,
            change: amount,
            isZero: this.character.endurance === 0
        };
    }

    /**
     * Изменить стрессоустойчивость
     * @param {number} amount - количество (может быть отрицательным)
     * @returns {Object} результат изменения
     */
    changeStressResistance(amount) {
        const oldValue = this.character.stressResistance;
        this.character.stressResistance = Math.max(0, Math.min(this.character.maxStressResistance, this.character.stressResistance + amount));
        
        this.saveToStorage();
        return {
            oldValue: oldValue,
            newValue: this.character.stressResistance,
            change: amount,
            isZero: this.character.stressResistance === 0
        };
    }

    /**
     * Восстановить характеристики
     * @param {Object} restoreOptions - опции восстановления
     * @returns {Object} результат восстановления
     */
    restoreStats(restoreOptions = {}) {
        const results = {};
        
        if (restoreOptions.endurance !== false) {
            results.endurance = this.changeEndurance(this.character.maxEndurance - this.character.endurance);
        }
        
        if (restoreOptions.stress !== false) {
            results.stress = this.changeStressResistance(this.character.maxStressResistance - this.character.stressResistance);
        }
        
        return results;
    }

    /**
     * Добавить деньги
     * @param {number} amount - количество денег
     * @returns {Object} результат операции
     */
    addMoney(amount) {
        if (amount <= 0) return { success: false, reason: 'invalid_amount' };
        
        this.character.money += amount;
        this.character.totalMoneyEarned += amount;
        
        this.saveToStorage();
        return {
            success: true,
            oldAmount: this.character.money - amount,
            newAmount: this.character.money,
            added: amount
        };
    }

    /**
     * Списать деньги
     * @param {number} amount - количество денег
     * @returns {Object} результат операции
     */
    spendMoney(amount) {
        if (amount <= 0) return { success: false, reason: 'invalid_amount' };
        if (this.character.money < amount) return { success: false, reason: 'not_enough_money' };
        
        const oldAmount = this.character.money;
        this.character.money -= amount;
        
        this.saveToStorage();
        return {
            success: true,
            oldAmount: oldAmount,
            newAmount: this.character.money,
            spent: amount
        };
    }

    /**
     * Обновить статистику
     * @param {string} stat - тип статистики
     * @param {number} value - значение (по умолчанию 1)
     */
    updateStatistic(stat, value = 1) {
        const validStats = ['battlesWon', 'battlesLost', 'totalSales', 'skillsUsed'];
        
        if (validStats.includes(stat) && this.character[stat] !== undefined) {
            this.character[stat] += value;
            this.saveToStorage();
            return true;
        }
        
        return false;
    }

    /**
     * Разблокировать локацию
     * @param {string} locationId - ID локации
     * @returns {boolean} успех операции
     */
    unlockLocation(locationId) {
        if (!this.character.unlockedLocations.includes(locationId)) {
            this.character.unlockedLocations.push(locationId);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Разблокировать умение
     * @param {number} skillId - ID умения
     * @returns {boolean} успех операции
     */
    unlockSkill(skillId) {
        if (!this.character.unlockedSkills.includes(skillId)) {
            this.character.unlockedSkills.push(skillId);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Завершить обучение
     * @param {string} tutorialId - ID обучения
     * @returns {boolean} успех операции
     */
    completeTutorial(tutorialId) {
        if (!this.character.completedTutorials.includes(tutorialId)) {
            this.character.completedTutorials.push(tutorialId);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Добавить временный бафф
     * @param {Object} buff - данные баффа
     */
    addTemporaryBuff(buff) {
        this.character.temporaryBuffs.push({
            ...buff,
            id: Date.now() + Math.random(), // Уникальный ID
            appliedAt: Date.now()
        });
        this.saveToStorage();
    }

    /**
     * Обновить временные баффы
     */
    updateTemporaryBuffs() {
        const now = Date.now();
        this.character.temporaryBuffs = this.character.temporaryBuffs.filter(buff => {
            return now - buff.appliedAt < (buff.duration * 1000); // duration в секундах
        });
        this.saveToStorage();
    }

    /**
     * Получить активные баффы
     */
    getActiveBuffs() {
        this.updateTemporaryBuffs();
        return this.character.temporaryBuffs;
    }

    /**
     * Получить общую статистику
     */
    getStatistics() {
        const totalBattles = this.character.battlesWon + this.character.battlesLost;
        const winRate = totalBattles > 0 ? (this.character.battlesWon / totalBattles) * 100 : 0;
        
        return {
            level: this.character.level,
            experience: this.character.experience,
            totalMoneyEarned: this.character.totalMoneyEarned,
            battles: {
                total: totalBattles,
                won: this.character.battlesWon,
                lost: this.character.battlesLost,
                winRate: Math.round(winRate)
            },
            sales: this.character.totalSales,
            skillsUsed: this.character.skillsUsed,
            unlockedLocations: this.character.unlockedLocations.length,
            unlockedSkills: this.character.unlockedSkills.length
        };
    }

    /**
     * Проверить доступность локации
     */
    isLocationUnlocked(locationId) {
        return this.character.unlockedLocations.includes(locationId);
    }

    /**
     * Проверить доступность умения
     */
    isSkillUnlocked(skillId) {
        return this.character.unlockedSkills.includes(skillId);
    }

    /**
     * Проверить пройдено ли обучение
     */
    isTutorialCompleted(tutorialId) {
        return this.character.completedTutorials.includes(tutorialId);
    }

    /**
     * Сохранение в localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('characterData', JSON.stringify(this.character));
        } catch (error) {
            console.error('Ошибка сохранения персонажа:', error);
        }
    }

    /**
     * Загрузка из localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('characterData');
            if (saved) {
                const savedData = JSON.parse(saved);
                this.character = { ...this.character, ...savedData };
                
                // Миграция данных для обратной совместимости
                this.migrateLegacyData();
            }
        } catch (error) {
            console.error('Ошибка загрузки персонажа:', error);
            this.initializeNewCharacter();
        }
    }

    /**
     * Миграция устаревших данных
     */
    migrateLegacyData() {
        // Добавляем отсутствующие поля
        const defaultCharacter = new CharacterSystem().character;
        
        Object.keys(defaultCharacter).forEach(key => {
            if (this.character[key] === undefined) {
                this.character[key] = defaultCharacter[key];
            }
        });
        
        this.saveToStorage();
    }

    /**
     * Сброс персонажа
     */
    resetCharacter() {
        this.initializeNewCharacter();
    }

    /**
     * Экспорт данных персонажа (для отладки)
     */
    exportCharacterData() {
        return JSON.parse(JSON.stringify(this.character));
    }

    /**
     * Импорт данных персонажа (для отладки)
     */
    importCharacterData(data) {
        if (typeof data === 'object' && data !== null) {
            this.character = { ...this.character, ...data };
            this.saveToStorage();
            return true;
        }
        return false;
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.CharacterSystem = CharacterSystem;
