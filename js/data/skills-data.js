/**
 * Система данных об умениях персонажа
 * Содержит информацию о всех умениях, их улучшениях и управлении
 */

const skillsData = {
    // Базовые умения (доступны с начала игры)
    basic: [
        {
            id: 1,
            name: "Убедительный аргумент",
            description: "Базовый навык убеждения с балансом силы и надежности",
            icon: "💬",
            type: "persuasion",
            category: "basic",
            
            // Боевые характеристики
            power: 20,
            enduranceCost: 10,
            successChance: 0.55,
            cooldown: 3,
            
            // Прогресс
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 100,
            
            // Статус
            equipped: true,
            unlocked: true,
            favorite: false,
            
            // Визуальные параметры
            color: "#4CAF50",
            animation: "talk",
            
            // Модификаторы
            modifiers: {
                criticalChance: 0.05,
                stressReduction: 0.1
            },
            
            // Улучшения по уровням
            upgrades: [
                { level: 2, power: 23, successChance: 0.57, description: "Улучшенная сила убеждения" },
                { level: 3, power: 26, enduranceCost: 9, description: "Эффективное использование энергии" },
                { level: 4, power: 30, successChance: 0.60, description: "Мастерское владение аргументацией" },
                { level: 5, power: 35, cooldown: 2, description: "Экспертный уровень убеждения" }
            ]
        },
        {
            id: 2,
            name: "Сильный довод", 
            description: "Мощное убеждение с высоким уроном, но меньшей надежностью",
            icon: "🔥",
            type: "aggressive",
            category: "basic",
            
            power: 30,
            enduranceCost: 15,
            successChance: 0.45,
            cooldown: 5,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 120,
            
            equipped: true,
            unlocked: true,
            favorite: false,
            
            color: "#FF5722",
            animation: "fire",
            
            modifiers: {
                criticalChance: 0.08,
                stressIncrease: 0.15
            },
            
            upgrades: [
                { level: 2, power: 34, successChance: 0.47, description: "Усиленная мощь" },
                { level: 3, power: 38, enduranceCost: 14, description: "Оптимизация затрат" },
                { level: 4, power: 43, successChance: 0.50, description: "Точность применения" },
                { level: 5, power: 50, cooldown: 4, description: "Сокрушительный довод" }
            ]
        },
        {
            id: 3,
            name: "Эмоциональный подход",
            description: "Апелляция к чувствам клиента с высоким шансом успеха",
            icon: "❤️",
            type: "emotional",
            category: "basic",
            
            power: 25,
            enduranceCost: 12,
            successChance: 0.60,
            cooldown: 15,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 110,
            
            equipped: true,
            unlocked: true,
            favorite: false,
            
            color: "#E91E63",
            animation: "heart",
            
            modifiers: {
                criticalChance: 0.06,
                stressReduction: 0.2,
                bonusAgainstEmotional: 0.15
            },
            
            upgrades: [
                { level: 2, power: 28, successChance: 0.63, description: "Глубокое эмоциональное воздействие" },
                { level: 3, power: 31, enduranceCost: 11, description: "Эмоциональная стабильность" },
                { level: 4, power: 35, successChance: 0.66, description: "Мастер эмоций" },
                { level: 5, power: 40, cooldown: 12, description: "Сердечное убеждение" }
            ]
        }
    ],

    // Продвинутые умения (открываются по уровню)
    advanced: [
        {
            id: 4,
            name: "Логическая цепочка",
            description: "Построение логических аргументов для техничных клиентов",
            icon: "🔗",
            type: "logical",
            category: "advanced",
            
            power: 22,
            enduranceCost: 11,
            successChance: 0.65,
            cooldown: 20,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 150,
            
            equipped: true,
            unlocked: false,
            unlockLevel: 5,
            favorite: false,
            
            color: "#2196F3",
            animation: "chain",
            
            modifiers: {
                criticalChance: 0.04,
                bonusAgainstLogical: 0.25,
                resistanceToCounter: 0.3
            },
            
            upgrades: [
                { level: 2, power: 25, successChance: 0.68, description: "Улучшенная логика" },
                { level: 3, power: 28, enduranceCost: 10, description: "Эффективные построения" },
                { level: 4, power: 32, successChance: 0.71, description: "Неопровержимая логика" },
                { level: 5, power: 37, cooldown: 16, description: "Совершенная аргументация" }
            ]
        },
        {
            id: 5,
            name: "Сравнение преимуществ",
            description: "Сравнение с конкурентами для демонстрации выгод",
            icon: "⚖️",
            type: "comparative",
            category: "advanced",
            
            power: 28,
            enduranceCost: 14,
            successChance: 0.50,
            cooldown: 30,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 140,
            
            equipped: true,
            unlocked: false,
            unlockLevel: 8,
            favorite: false,
            
            color: "#FF9800",
            animation: "scale",
            
            modifiers: {
                criticalChance: 0.07,
                bonusAgainstBusiness: 0.2,
                moneyMultiplier: 1.1
            },
            
            upgrades: [
                { level: 2, power: 32, successChance: 0.53, description: "Точные сравнения" },
                { level: 3, power: 36, enduranceCost: 13, description: "Эффективный анализ" },
                { level: 4, power: 41, successChance: 0.56, description: "Превосходные аналогии" },
                { level: 5, power: 47, cooldown: 25, description: "Исчерпывающее сравнение" }
            ]
        }
    ],

    // Экспертные умения (открываются на высоких уровнях)
    expert: [
        {
            id: 6,
            name: "Психологическое давление",
            description: "Использование психологических приемов для быстрого убеждения",
            icon: "🧠",
            type: "psychological",
            category: "expert",
            
            power: 35,
            enduranceCost: 20,
            successChance: 0.40,
            cooldown: 45,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 200,
            
            equipped: false,
            unlocked: false,
            unlockLevel: 15,
            favorite: false,
            
            color: "#9C27B0",
            animation: "brain",
            
            modifiers: {
                criticalChance: 0.12,
                stressIncrease: 0.25,
                instantWinChance: 0.05,
                bonusAgainstAll: 0.1
            },
            
            upgrades: [
                { level: 2, power: 40, successChance: 0.43, description: "Усиленное воздействие" },
                { level: 3, power: 45, enduranceCost: 18, description: "Эффективная тактика" },
                { level: 4, power: 51, successChance: 0.46, description: "Продвинутые приемы" },
                { level: 5, power: 58, cooldown: 35, description: "Мастер психологического воздействия" }
            ]
        },
        {
            id: 7,
            name: "Заключение сделки",
            description: "Финальное предложение, которое сложно отказать",
            icon: "🤝",
            type: "closing",
            category: "expert",
            
            power: 40,
            enduranceCost: 25,
            successChance: 0.35,
            cooldown: 60,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 220,
            
            equipped: false,
            unlocked: false,
            unlockLevel: 20,
            favorite: false,
            
            color: "#795548",
            animation: "handshake",
            
            modifiers: {
                criticalChance: 0.15,
                moneyMultiplier: 1.25,
                bonusRewardChance: 0.2,
                guaranteedSuccessOnCritical: true
            },
            
            upgrades: [
                { level: 2, power: 46, successChance: 0.38, description: "Улучшенные условия" },
                { level: 3, power: 52, enduranceCost: 23, description: "Эффективное закрытие" },
                { level: 4, power: 59, successChance: 0.41, description: "Беспроигрышное предложение" },
                { level: 5, power: 67, cooldown: 50, description: "Идеальная сделка" }
            ]
        }
    ],

    // Специальные умения (уникальные, открываются через достижения)
    special: [
        {
            id: 8,
            name: "Золотые слова",
            description: "Исключительное умение, доступное только опытным продавцам",
            icon: "💰",
            type: "golden",
            category: "special",
            
            power: 50,
            enduranceCost: 30,
            successChance: 0.30,
            cooldown: 90,
            
            level: 1,
            maxLevel: 5,
            experience: 0,
            experienceToNextLevel: 300,
            
            equipped: false,
            unlocked: false,
            unlockRequirement: "reach_level_30",
            favorite: false,
            
            color: "#FFD700",
            animation: "gold",
            
            modifiers: {
                criticalChance: 0.2,
                moneyMultiplier: 1.5,
                itemDropChance: 0.3,
                experienceBonus: 1.5,
                specialEffect: "golden_touch"
            },
            
            upgrades: [
                { level: 2, power: 58, successChance: 0.33, description: "Улучшенная формулировка" },
                { level: 3, power: 66, enduranceCost: 27, description: "Эффективная презентация" },
                { level: 4, power: 75, successChance: 0.36, description: "Безупречная аргументация" },
                { level: 5, power: 85, cooldown: 75, description: "Легендарное убеждение" }
            ]
        }
    ]
};

class SkillsSystem {
    constructor() {
        this.allSkills = this.flattenSkills();
        this.equippedSkills = new Set([1, 2, 3, 4, 5]); // Базовые умения по умолчанию
        this.maxEquippedSlots = 5;
        this.skillUsageHistory = new Map();
        this.loadFromStorage();
    }

    /**
     * Преобразование вложенной структуры в плоский массив
     */
    flattenSkills() {
        const all = [];
        for (let category in skillsData) {
            all.push(...skillsData[category]);
        }
        return all;
    }

    /**
     * Получить умение по ID
     */
    getSkillById(id) {
        return this.allSkills.find(skill => skill.id === id);
    }

    /**
     * Получить все умения игрока (с учетом разблокировки)
     */
    getPlayerSkills(characterLevel = 1) {
        return this.allSkills.map(skill => {
            const playerSkill = {...skill};
            
            // Проверка разблокировки
            playerSkill.unlocked = this.isSkillUnlocked(playerSkill, characterLevel);
            
            // Проверка экипировки
            playerSkill.equipped = this.equippedSkills.has(playerSkill.id);
            
            // Применение улучшений по уровню
            if (playerSkill.level > 1) {
                playerSkill.currentUpgrade = this.getSkillUpgrade(playerSkill);
                if (playerSkill.currentUpgrade) {
                    Object.assign(playerSkill, playerSkill.currentUpgrade);
                }
            }
            
            return playerSkill;
        });
    }

    /**
     * Получить экипированные умения
     */
    getEquippedSkills(characterLevel = 1) {
        const allSkills = this.getPlayerSkills(characterLevel);
        return allSkills.filter(skill => 
            skill.equipped && skill.unlocked
        ).sort((a, b) => a.id - b.id);
    }

    /**
     * Проверка разблокировки умения
     */
    isSkillUnlocked(skill, characterLevel) {
        if (skill.unlocked) return true;
        if (skill.unlockLevel && characterLevel >= skill.unlockLevel) return true;
        if (skill.unlockRequirement) {
            return this.checkSpecialRequirement(skill.unlockRequirement, characterLevel);
        }
        return false;
    }

    /**
     * Проверка специальных требований разблокировки
     */
    checkSpecialRequirement(requirement, characterLevel) {
        switch(requirement) {
            case 'reach_level_30':
                return characterLevel >= 30;
            // Можно добавить другие требования
            default:
                return false;
        }
    }

    /**
     * Экипировать умение
     */
    equipSkill(skillId) {
        if (this.equippedSkills.size >= this.maxEquippedSlots) {
            return { success: false, reason: 'no_free_slots' };
        }

        const skill = this.getSkillById(skillId);
        if (!skill) {
            return { success: false, reason: 'skill_not_found' };
        }

        if (!this.isSkillUnlocked(skill, 1)) { // Уровень будет передан извне
            return { success: false, reason: 'skill_locked' };
        }

        this.equippedSkills.add(skillId);
        this.saveToStorage();
        
        return { success: true, skill: skill };
    }

    /**
     * Снять умение
     */
    unequipSkill(skillId) {
        this.equippedSkills.delete(skillId);
        this.saveToStorage();
        return { success: true };
    }

    /**
     * Переключение экипировки умения
     */
    toggleSkillEquip(skillId) {
        if (this.equippedSkills.has(skillId)) {
            return this.unequipSkill(skillId);
        } else {
            return this.equipSkill(skillId);
        }
    }

    /**
     * Добавить опыт умению
     */
    addSkillExperience(skillId, experience) {
        const skill = this.getSkillById(skillId);
        if (!skill || skill.level >= skill.maxLevel) {
            return { leveledUp: false };
        }

        skill.experience += experience;
        let leveledUp = false;

        while (skill.experience >= skill.experienceToNextLevel && skill.level < skill.maxLevel) {
            this.levelUpSkill(skillId);
            leveledUp = true;
        }

        this.saveToStorage();
        return { 
            leveledUp: leveledUp,
            skill: skill,
            experienceGained: experience
        };
    }

    /**
     * Повышение уровня умения
     */
    levelUpSkill(skillId) {
        const skill = this.getSkillById(skillId);
        if (!skill || skill.level >= skill.maxLevel) return false;

        skill.level++;
        skill.experience = 0;
        skill.experienceToNextLevel = this.calculateNextLevelExperience(skill);

        // Применение улучшения
        const upgrade = this.getSkillUpgrade(skill);
        if (upgrade) {
            console.log(`Умение ${skill.name} улучшено до уровня ${skill.level}: ${upgrade.description}`);
        }

        this.saveToStorage();
        return true;
    }

    /**
     * Получить улучшение для текущего уровня умения
     */
    getSkillUpgrade(skill) {
        if (!skill.upgrades) return null;
        return skill.upgrades.find(upgrade => upgrade.level === skill.level);
    }

    /**
     * Расчет опыта для следующего уровня
     */
    calculateNextLevelExperience(skill) {
        const baseExp = 100;
        const multiplier = 1.5;
        return Math.floor(baseExp * Math.pow(multiplier, skill.level - 1));
    }

    /**
     * Зарегистрировать использование умения
     */
    registerSkillUsage(skillId, success = true) {
        const history = this.skillUsageHistory.get(skillId) || {
            totalUses: 0,
            successfulUses: 0,
            lastUsed: Date.now()
        };

        history.totalUses++;
        if (success) history.successfulUses++;
        history.lastUsed = Date.now();

        this.skillUsageHistory.set(skillId, history);
        this.saveToStorage();
    }

    /**
     * Получить статистику использования умений
     */
    getSkillStatistics() {
        const stats = {};
        let totalUses = 0;
        let totalSuccesses = 0;

        this.skillUsageHistory.forEach((history, skillId) => {
            const skill = this.getSkillById(skillId);
            if (skill) {
                stats[skillId] = {
                    skill: skill,
                    totalUses: history.totalUses,
                    successfulUses: history.successfulUses,
                    successRate: history.totalUses > 0 ? 
                        (history.successfulUses / history.totalUses) * 100 : 0,
                    lastUsed: history.lastUsed
                };

                totalUses += history.totalUses;
                totalSuccesses += history.successfulUses;
            }
        });

        return {
            skills: stats,
            overall: {
                totalUses: totalUses,
                totalSuccesses: totalSuccesses,
                overallSuccessRate: totalUses > 0 ? (totalSuccesses / totalUses) * 100 : 0
            }
        };
    }

    /**
     * Получить рекомендуемые умения для типа противника
     */
    getRecommendedSkills(opponentType) {
        const skills = this.getEquippedSkills();
        
        // Бонусы против определенных типов
        const typeAdvantages = {
            'emotional': ['emotional', 'golden'],
            'logical': ['logical', 'persuasion'],
            'business': ['comparative', 'closing'],
            'technical': ['logical', 'persuasion'],
            'aggressive': ['psychological', 'aggressive']
        };

        const recommended = skills.map(skill => {
            let score = skill.successChance * 100;
            
            // Бонус за тип
            if (typeAdvantages[opponentType] && 
                typeAdvantages[opponentType].includes(skill.type)) {
                score += 20;
            }

            // Штраф за откат
            if (skill.cooldown > 10) {
                score -= skill.cooldown * 0.5;
            }

            return { skill, score };
        });

        return recommended.sort((a, b) => b.score - a.score).map(item => item.skill);
    }

    /**
     * Получить умения по категории
     */
    getSkillsByCategory(category) {
        return this.allSkills.filter(skill => skill.category === category);
    }

    /**
     * Получить умения по типу
     */
    getSkillsByType(type) {
        return this.allSkills.filter(skill => skill.type === type);
    }

    /**
     * Поиск умений по названию или описанию
     */
    searchSkills(query) {
        const lowerQuery = query.toLowerCase();
        return this.allSkills.filter(skill => 
            skill.name.toLowerCase().includes(lowerQuery) ||
            skill.description.toLowerCase().includes(lowerQuery) ||
            skill.type.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Переключение избранного статуса
     */
    toggleFavorite(skillId) {
        const skill = this.getSkillById(skillId);
        if (skill) {
            skill.favorite = !skill.favorite;
            this.saveToStorage();
            return skill.favorite;
        }
        return false;
    }

    /**
     * Сброс всех умений к начальным значениям
     */
    resetSkills() {
        this.equippedSkills = new Set([1, 2, 3, 4, 5]);
        this.skillUsageHistory.clear();
        
        // Сброс прогресса всех умений
        this.allSkills.forEach(skill => {
            skill.level = 1;
            skill.experience = 0;
            skill.experienceToNextLevel = this.calculateNextLevelExperience(skill);
            skill.equipped = [1, 2, 3, 4, 5].includes(skill.id);
        });
        
        this.saveToStorage();
    }

    /**
     * Сохранение в localStorage
     */
    saveToStorage() {
        try {
            const saveData = {
                equippedSkills: Array.from(this.equippedSkills),
                skillUsageHistory: Array.from(this.skillUsageHistory.entries()),
                skills: this.allSkills.map(skill => ({
                    id: skill.id,
                    level: skill.level,
                    experience: skill.experience,
                    experienceToNextLevel: skill.experienceToNextLevel,
                    equipped: skill.equipped,
                    favorite: skill.favorite
                }))
            };
            localStorage.setItem('skillsData', JSON.stringify(saveData));
        } catch (error) {
            console.error('Ошибка сохранения умений:', error);
        }
    }

    /**
     * Загрузка из localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('skillsData');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                // Восстановление экипированных умений
                this.equippedSkills = new Set(saveData.equippedSkills || [1, 2, 3, 4, 5]);
                
                // Восстановление истории использования
                this.skillUsageHistory = new Map(saveData.skillUsageHistory || []);
                
                // Восстановление прогресса умений
                if (saveData.skills) {
                    saveData.skills.forEach(savedSkill => {
                        const skill = this.getSkillById(savedSkill.id);
                        if (skill) {
                            skill.level = savedSkill.level || 1;
                            skill.experience = savedSkill.experience || 0;
                            skill.experienceToNextLevel = savedSkill.experienceToNextLevel || 
                                this.calculateNextLevelExperience(skill);
                            skill.equipped = savedSkill.equipped || false;
                            skill.favorite = savedSkill.favorite || false;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки умений:', error);
        }
    }

    /**
     * Экспорт данных умений (для отладки)
     */
    exportSkillsData() {
        return {
            skills: this.allSkills,
            equippedSkills: Array.from(this.equippedSkills),
            statistics: this.getSkillStatistics()
        };
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.SkillsSystem = SkillsSystem;
window.skillsData = skillsData;
