/**
 * Система боев/переговоров с клиентами
 * Управляет логикой боя, использованием умений, откатами и наградами
 */

class CombatSystem {
    constructor() {
        this.currentOpponent = null;
        this.isCombatActive = false;
        this.skillCooldowns = new Map();
        this.globalCooldown = 0;
        this.lastUsedSkillId = null;
        this.activeBuffs = [];
    }

    /**
     * Начать бой с оппонентом
     * @param {Object} opponent - данные оппонента
     */
    startCombat(opponent) {
        this.currentOpponent = JSON.parse(JSON.stringify(opponent)); // глубокое копирование
        this.isCombatActive = true;
        this.skillCooldowns.clear();
        this.globalCooldown = 0;
        this.lastUsedSkillId = null;
        this.activeBuffs = [];
        
        console.log(`Бой начат с: ${this.currentOpponent.name}`);
        return this.currentOpponent;
    }

    /**
     * Использование умения
     * @param {Object} skill - данные умения
     * @param {Object} character - данные персонажа
     * @returns {Object} результат использования
     */
    useSkill(skill, character) {
        if (!this.isCombatActive || !this.currentOpponent) {
            return { success: false, reason: 'combat_not_active' };
        }

        // Проверка глобального отката (для всех умений кроме использованного)
        if (this.globalCooldown > Date.now() && skill.id !== this.lastUsedSkillId) {
            return { success: false, reason: 'global_cooldown' };
        }

        // Проверка индивидуального отката
        if (this.skillCooldowns.get(skill.id) > Date.now()) {
            return { success: false, reason: 'skill_cooldown' };
        }

        // Проверка выносливости
        if (character.endurance < skill.enduranceCost) {
            return { success: false, reason: 'no_endurance' };
        }

        // Применение умения
        const success = Math.random() <= this.calculateSuccessChance(skill, character);
        let damage = 0;
        let stressDamage = 0;

        if (success) {
            // Успешное убеждение
            damage = this.calculateDamage(skill, character);
            this.currentOpponent.health -= damage;
            
            // Урон по стрессоустойчивости при успехе
            stressDamage = Math.floor(skill.enduranceCost * 0.3);
            character.stressResistance -= stressDamage;
        } else {
            // Неудача - клиент сопротивляется
            const resistance = this.calculateResistance(skill);
            this.currentOpponent.health += resistance;
            
            // Больший урон по стрессоустойчивости при неудаче
            stressDamage = Math.floor(skill.enduranceCost * 0.6);
            character.stressResistance -= stressDamage;
        }

        // Обновление состояний
        character.endurance -= skill.enduranceCost;
        this.setCooldowns(skill.id, skill.cooldown);

        // Ограничение характеристик
        this.normalizeStats(character);

        const combatResult = {
            success: true,
            hit: success,
            damage: damage,
            stressDamage: stressDamage,
            opponentHealth: this.currentOpponent.health,
            enduranceCost: skill.enduranceCost,
            opponentMaxHealth: this.currentOpponent.maxHealth
        };

        console.log(`Умение ${skill.name} использовано:`, combatResult);
        return combatResult;
    }

    /**
     * Расчет шанса успеха с учетом баффов
     */
    calculateSuccessChance(skill, character) {
        let successChance = skill.successChance;
        
        // Учет уровня умения
        successChance += (skill.level - 1) * 0.03;
        
        // Учет стрессоустойчивости
        const stressFactor = character.stressResistance / 100;
        successChance *= (0.9 + stressFactor * 0.2);
        
        // Применение баффов
        this.activeBuffs.forEach(buff => {
            if (buff.type === 'success_chance_boost') {
                successChance += buff.value;
            }
        });

        return Math.min(successChance, 0.95); // Максимум 95%
    }

    /**
     * Расчет урона от умения
     */
    calculateDamage(skill, character) {
        let baseDamage = skill.power;
        
        // Учет уровня умения
        baseDamage *= (1 + (skill.level - 1) * 0.1);
        
        // Учет стрессоустойчивости
        const stressFactor = character.stressResistance / 100;
        baseDamage *= (0.8 + stressFactor * 0.4);
        
        // Применение баффов
        this.activeBuffs.forEach(buff => {
            if (buff.type === 'skill_power_boost') {
                baseDamage *= (1 + buff.value);
            }
        });

        // Случайный разброс ±10%
        const variance = 0.9 + Math.random() * 0.2;
        return Math.floor(baseDamage * variance);
    }

    /**
     * Расчет сопротивления клиента
     */
    calculateResistance(skill) {
        return Math.floor(skill.power * 0.3 + Math.random() * 15);
    }

    /**
     * Установка откатов
     */
    setCooldowns(skillId, cooldown) {
        this.globalCooldown = Date.now() + 3000; // 3 сек глобальный откат
        this.skillCooldowns.set(skillId, Date.now() + cooldown * 1000);
        this.lastUsedSkillId = skillId;
    }

    /**
     * Проверка состояния откатов
     */
    getCooldownState(skillId) {
        const now = Date.now();
        const globalRemaining = this.globalCooldown - now;
        const skillRemaining = this.skillCooldowns.get(skillId) - now;

        return {
            globalCooldown: globalRemaining > 0 ? Math.ceil(globalRemaining / 1000) : 0,
            skillCooldown: skillRemaining > 0 ? Math.ceil(skillRemaining / 1000) : 0,
            canUse: globalRemaining <= 0 && skillRemaining <= 0
        };
    }

    /**
     * Нормализация характеристик (ограничение минимальных/максимальных значений)
     */
    normalizeStats(character) {
        character.endurance = Math.max(0, Math.min(character.endurance, 100));
        character.stressResistance = Math.max(0, Math.min(character.stressResistance, 100));
        
        if (this.currentOpponent) {
            this.currentOpponent.health = Math.max(0, 
                Math.min(this.currentOpponent.health, this.currentOpponent.maxHealth));
        }
    }

    /**
     * Проверка конца боя
     * @returns {string} 'victory', 'defeat', 'continue'
     */
    checkCombatEnd(character) {
        if (!this.isCombatActive) return 'continue';

        // Поражение если закончилась выносливость или стрессоустойчивость
        if (character.endurance <= 0) {
            this.endCombat();
            return 'defeat_endurance';
        }

        if (character.stressResistance <= 0) {
            this.endCombat();
            return 'defeat_stress';
        }

        // Победа если здоровье оппонента <= 0
        if (this.currentOpponent.health <= 0) {
            const rewards = this.getVictoryRewards();
            this.endCombat();
            return {
                result: 'victory',
                rewards: rewards
            };
        }

        // Поражение если здоровье оппонента >= максимального
        if (this.currentOpponent.health >= this.currentOpponent.maxHealth) {
            this.endCombat();
            return 'defeat_opponent_strong';
        }

        return 'continue';
    }

    /**
     * Завершение боя
     */
    endCombat() {
        this.isCombatActive = false;
        this.activeBuffs = [];
        console.log('Бой завершен');
    }

    /**
     * Получение наград за победу
     */
    getVictoryRewards() {
        if (!this.currentOpponent) return null;

        const rewards = {
            money: 0,
            items: [],
            experience: 0
        };

        // Базовая денежная награда
        rewards.money = Math.floor(this.currentOpponent.money * (0.7 + Math.random() * 0.6));

        // Предметы из дропа
        this.currentOpponent.drops.forEach(drop => {
            if (Math.random() * 100 <= drop.chance) {
                if (drop.name === 'money') {
                    const moneyDrop = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
                    rewards.money += moneyDrop;
                } else {
                    rewards.items.push({
                        id: drop.name,
                        name: this.getItemName(drop.name),
                        quantity: 1
                    });
                }
            }
        });

        // Опыт за победу
        rewards.experience = Math.floor(this.currentOpponent.maxHealth / 8);

        console.log('Награды за победу:', rewards);
        return rewards;
    }

    /**
     * Получение читаемого названия предмета
     */
    getItemName(itemId) {
        const itemNames = {
            'herbs': 'Лечебные травы',
            'rope': 'Прочная веревка',
            'water': 'Чистая вода',
            'paper': 'Качественная бумага'
        };
        return itemNames[itemId] || itemId;
    }

    /**
     * Добавление временного баффа
     */
    addBuff(type, value, duration) {
        this.activeBuffs.push({
            type: type,
            value: value,
            duration: duration,
            turnsRemaining: duration
        });
    }

    /**
     * Обновление баффов (вызывается в конце хода)
     */
    updateBuffs() {
        this.activeBuffs = this.activeBuffs.filter(buff => {
            buff.turnsRemaining--;
            return buff.turnsRemaining > 0;
        });
    }

    /**
     * Получение информации о текущем бое
     */
    getCombatInfo() {
        return {
            opponent: this.currentOpponent,
            isActive: this.isCombatActive,
            globalCooldown: this.globalCooldown,
            activeBuffs: this.activeBuffs
        };
    }

    /**
     * Сброс системы боя
     */
    reset() {
        this.currentOpponent = null;
        this.isCombatActive = false;
        this.skillCooldowns.clear();
        this.globalCooldown = 0;
        this.lastUsedSkillId = null;
        this.activeBuffs = [];
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.CombatSystem = CombatSystem;
