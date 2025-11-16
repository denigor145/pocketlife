/**
 * Система предметов и инвентаря
 * Управляет предметами, их эффектами, инвентарем и торговлей
 */

const itemsData = {
    // Восстанавливающие предметы
    consumables: {
        energy_drink: {
            id: 'energy_drink',
            name: 'Энергетический напиток',
            description: 'Восстанавливает 30 единиц выносливости',
            icon: '⚡',
            type: 'consumable',
            effect: {
                type: 'restore_endurance',
                value: 30
            },
            price: 50,
            rarity: 'common',
            maxStack: 10
        },
        
        stress_pills: {
            id: 'stress_pills',
            name: 'Успокоительное',
            description: 'Восстанавливает 25 единиц стрессоустойчивости',
            icon: '😌',
            type: 'consumable',
            effect: {
                type: 'restore_stress',
                value: 25
            },
            price: 60,
            rarity: 'common',
            maxStack: 10
        },

        full_restore: {
            id: 'full_restore',
            name: 'Комплексное восстановление',
            description: 'Полностью восстанавливает выносливость и стрессоустойчивость',
            icon: '💊',
            type: 'consumable',
            effect: {
                type: 'restore_all',
                value: 100
            },
            price: 150,
            rarity: 'rare',
            maxStack: 5
        },

        endurance_booster: {
            id: 'endurance_booster',
            name: 'Бустер выносливости',
            description: 'Временно увеличивает максимальную выносливость на 20 на 5 ходов',
            icon: '💪',
            type: 'consumable',
            effect: {
                type: 'boost_max_endurance',
                value: 20,
                duration: 5
            },
            price: 120,
            rarity: 'uncommon',
            maxStack: 5
        }
    },

    // Бустеры для умений
    boosters: {
        persuasion_booster: {
            id: 'persuasion_booster',
            name: 'Усилитель убеждения',
            description: '+15% к силе убеждения на 3 хода',
            icon: '💬',
            type: 'booster',
            effect: {
                type: 'skill_power_boost',
                value: 0.15,
                duration: 3
            },
            price: 80,
            rarity: 'uncommon',
            maxStack: 8
        },

        success_booster: {
            id: 'success_booster', 
            name: 'Амулет удачи',
            description: '+20% к шансу успеха на 2 хода',
            icon: '🍀',
            type: 'booster',
            effect: {
                type: 'success_chance_boost',
                value: 0.20,
                duration: 2
            },
            price: 100,
            rarity: 'uncommon',
            maxStack: 8
        },

        cooldown_reducer: {
            id: 'cooldown_reducer',
            name: 'Ускоритель отката',
            description: '-50% к времени отката умений на 4 хода',
            icon: '⏱️',
            type: 'booster',
            effect: {
                type: 'cooldown_reduction',
                value: 0.5,
                duration: 4
            },
            price: 120,
            rarity: 'rare',
            maxStack: 5
        }
    },

    // Торговые предметы
    trade_goods: {
        herbs: {
            id: 'herbs',
            name: 'Лечебные травы',
            description: 'Ценный товар для перепродажи',
            icon: '🌿',
            type: 'trade_good',
            basePrice: 25,
            rarity: 'common',
            maxStack: 20
        },

        rope: {
            id: 'rope',
            name: 'Прочная веревка',
            description: 'Пользуется спросом в хозяйстве',
            icon: '🪢', 
            type: 'trade_good',
            basePrice: 40,
            rarity: 'common',
            maxStack: 15
        },

        water: {
            id: 'water',
            name: 'Чистая вода',
            description: 'Всегда в цене',
            icon: '💧',
            type: 'trade_good', 
            basePrice: 15,
            rarity: 'common',
            maxStack: 25
        },

        paper: {
            id: 'paper',
            name: 'Качественная бумага',
            description: 'Необходима для документов',
            icon: '📄',
            type: 'trade_good',
            basePrice: 30,
            rarity: 'common',
            maxStack: 20
        },

        rare_herbs: {
            id: 'rare_herbs',
            name: 'Редкие травы',
            description: 'Очень ценный товар',
            icon: '🌱',
            type: 'trade_good',
            basePrice: 80,
            rarity: 'rare',
            maxStack: 10
        }
    },

    // Ключевые предметы
    key_items: {
        business_license: {
            id: 'business_license',
            name: 'Лицензия на торговлю',
            description: 'Позволяет торговать в премиальных локациях',
            icon: '📜',
            type: 'key_item',
            rarity: 'epic',
            maxStack: 1
        },

        vip_card: {
            id: 'vip_card',
            name: 'VIP карта',
            description: 'Открывает доступ к эксклюзивным товарам',
            icon: '💎',
            type: 'key_item',
            rarity: 'epic',
            maxStack: 1
        }
    }
};

class InventorySystem {
    constructor() {
        this.items = new Map();
        this.money = 100; // Стартовые деньги
        this.maxSlots = 20; // Максимальное количество слотов
        this.activeBuffs = [];
        this.loadFromStorage();
    }

    /**
     * Добавить предмет в инвентарь
     * @param {string} itemId - ID предмета
     * @param {number} quantity - количество
     * @returns {boolean} успех операции
     */
    addItem(itemId, quantity = 1) {
        if (quantity <= 0) return false;

        const itemData = this.getItemData(itemId);
        if (!itemData) {
            console.error(`Предмет с ID ${itemId} не найден`);
            return false;
        }

        // Проверка свободного места
        if (!this.hasFreeSlots(itemId, quantity)) {
            console.warn('Недостаточно места в инвентаре');
            return false;
        }

        const currentQuantity = this.items.get(itemId) || 0;
        const newQuantity = currentQuantity + quantity;
        
        // Проверка максимального стака
        if (newQuantity > itemData.maxStack) {
            console.warn(`Достигнут максимальный стак для ${itemData.name}`);
            return false;
        }

        this.items.set(itemId, newQuantity);
        this.saveToStorage();
        console.log(`Добавлено ${quantity} ${itemData.name}`);
        return true;
    }

    /**
     * Использовать предмет
     * @param {string} itemId - ID предмета
     * @param {Object} character - данные персонажа
     * @param {Object} combatSystem - система боя (опционально)
     * @returns {Object} результат использования
     */
    useItem(itemId, character, combatSystem = null) {
        const itemData = this.getItemData(itemId);
        if (!itemData) {
            return { success: false, reason: 'item_not_found' };
        }

        if (!this.hasItem(itemId, 1)) {
            return { success: false, reason: 'not_enough_items' };
        }

        if (itemData.type === 'trade_good') {
            return { success: false, reason: 'not_usable' };
        }

        const useResult = {
            success: true,
            item: itemData,
            effects: []
        };

        // Применяем эффект предмета
        const effectResult = this.applyItemEffect(itemData, character, combatSystem);
        useResult.effects.push(effectResult);

        // Убираем из инвентаря если расходуемый
        if (itemData.type === 'consumable' || itemData.type === 'booster') {
            this.removeItem(itemId, 1);
        }

        this.saveToStorage();
        return useResult;
    }

    /**
     * Применить эффект предмета
     */
    applyItemEffect(itemData, character, combatSystem) {
        const effect = itemData.effect;
        if (!effect) return { type: 'none' };

        let result = { type: effect.type };

        switch(effect.type) {
            case 'restore_endurance':
                const oldEndurance = character.endurance;
                character.endurance = Math.min(character.endurance + effect.value, 100);
                result.value = character.endurance - oldEndurance;
                result.message = `Выносливость восстановлена на ${effect.value}`;
                break;

            case 'restore_stress':
                const oldStress = character.stressResistance;
                character.stressResistance = Math.min(character.stressResistance + effect.value, 100);
                result.value = character.stressResistance - oldStress;
                result.message = `Стрессоустойчивость восстановлена на ${effect.value}`;
                break;

            case 'restore_all':
                const oldEnd = character.endurance;
                const oldStr = character.stressResistance;
                character.endurance = 100;
                character.stressResistance = 100;
                result.value = { endurance: 100 - oldEnd, stress: 100 - oldStr };
                result.message = 'Все характеристики полностью восстановлены';
                break;

            case 'boost_max_endurance':
                if (combatSystem) {
                    combatSystem.addBuff('max_endurance', effect.value, effect.duration);
                    result.message = `Максимальная выносливость увеличена на ${effect.value} на ${effect.duration} ходов`;
                }
                break;

            case 'skill_power_boost':
                if (combatSystem) {
                    combatSystem.addBuff('skill_power_boost', effect.value, effect.duration);
                    result.message = `Сила умений увеличена на ${Math.round(effect.value * 100)}% на ${effect.duration} ходов`;
                }
                break;

            case 'success_chance_boost':
                if (combatSystem) {
                    combatSystem.addBuff('success_chance_boost', effect.value, effect.duration);
                    result.message = `Шанс успеха увеличен на ${Math.round(effect.value * 100)}% на ${effect.duration} ходов`;
                }
                break;

            case 'cooldown_reduction':
                if (combatSystem) {
                    combatSystem.addBuff('cooldown_reduction', effect.value, effect.duration);
                    result.message = `Время отката уменьшено на ${Math.round(effect.value * 100)}% на ${effect.duration} ходов`;
                }
                break;
        }

        return result;
    }

    /**
     * Продать предмет
     * @param {string} itemId - ID предмета
     * @param {number} quantity - количество
     * @returns {Object} результат продажи
     */
    sellItem(itemId, quantity = 1) {
        const itemData = this.getItemData(itemId);
        if (!itemData || itemData.type !== 'trade_good') {
            return { success: false, reason: 'not_sellable' };
        }

        if (!this.hasItem(itemId, quantity)) {
            return { success: false, reason: 'not_enough_items' };
        }

        const sellPrice = this.getSellPrice(itemId) * quantity;
        this.money += sellPrice;
        this.removeItem(itemId, quantity);

        this.saveToStorage();
        return {
            success: true,
            moneyEarned: sellPrice,
            item: itemData,
            quantity: quantity
        };
    }

    /**
     * Купить предмет
     * @param {string} itemId - ID предмета
     * @param {number} quantity - количество
     * @returns {Object} результат покупки
     */
    buyItem(itemId, quantity = 1) {
        const itemData = this.getItemData(itemId);
        if (!itemData) {
            return { success: false, reason: 'item_not_found' };
        }

        const totalCost = itemData.price * quantity;
        if (this.money < totalCost) {
            return { success: false, reason: 'not_enough_money' };
        }

        if (!this.hasFreeSlots(itemId, quantity)) {
            return { success: false, reason: 'not_enough_space' };
        }

        if (this.addItem(itemId, quantity)) {
            this.money -= totalCost;
            this.saveToStorage();
            return {
                success: true,
                moneySpent: totalCost,
                item: itemData,
                quantity: quantity
            };
        }

        return { success: false, reason: 'unknown_error' };
    }

    /**
     * Получить данные предмета по ID
     */
    getItemData(itemId) {
        // Ищем во всех категориях
        for (let category in itemsData) {
            if (itemsData[category][itemId]) {
                return itemsData[category][itemId];
            }
        }
        return null;
    }

    /**
     * Проверить наличие предмета
     */
    hasItem(itemId, quantity = 1) {
        return (this.items.get(itemId) || 0) >= quantity;
    }

    /**
     * Удалить предмет из инвентаря
     */
    removeItem(itemId, quantity = 1) {
        const current = this.items.get(itemId) || 0;
        if (current <= quantity) {
            this.items.delete(itemId);
        } else {
            this.items.set(itemId, current - quantity);
        }
        this.saveToStorage();
    }

    /**
     * Получить стоимость продажи предмета
     */
    getSellPrice(itemId) {
        const item = this.getItemData(itemId);
        if (!item || !item.basePrice) return 0;
        
        // Учитываем редкость при продаже
        const rarityMultiplier = {
            'common': 0.7,
            'uncommon': 0.8, 
            'rare': 0.9,
            'epic': 1.0
        };
        
        return Math.floor(item.basePrice * rarityMultiplier[item.rarity]);
    }

    /**
     * Получить стоимость покупки предмета
     */
    getBuyPrice(itemId) {
        const item = this.getItemData(itemId);
        return item ? item.price : 0;
    }

    /**
     * Проверить свободные слоты
     */
    hasFreeSlots(itemId, quantity = 1) {
        const itemData = this.getItemData(itemId);
        if (!itemData) return false;

        const currentQuantity = this.items.get(itemId) || 0;
        const newQuantity = currentQuantity + quantity;

        // Если предмет уже есть в инвентаре, проверяем стак
        if (currentQuantity > 0) {
            return newQuantity <= itemData.maxStack;
        }

        // Если предмета нет, проверяем общее количество слотов
        return this.items.size < this.maxSlots;
    }

    /**
     * Получить общую информацию об инвентаре
     */
    getInventoryInfo() {
        const itemsList = [];
        this.items.forEach((quantity, itemId) => {
            const itemData = this.getItemData(itemId);
            if (itemData) {
                itemsList.push({
                    id: itemId,
                    name: itemData.name,
                    description: itemData.description,
                    icon: itemData.icon,
                    type: itemData.type,
                    quantity: quantity,
                    maxStack: itemData.maxStack,
                    rarity: itemData.rarity,
                    sellPrice: this.getSellPrice(itemId),
                    buyPrice: this.getBuyPrice(itemId)
                });
            }
        });

        return {
            items: itemsList,
            money: this.money,
            usedSlots: this.items.size,
            maxSlots: this.maxSlots,
            freeSlots: this.maxSlots - this.items.size
        };
    }

    /**
     * Получить предметы по категории
     */
    getItemsByType(type) {
        const inventoryInfo = this.getInventoryInfo();
        return inventoryInfo.items.filter(item => item.type === type);
    }

    /**
     * Сохранение в localStorage
     */
    saveToStorage() {
        const saveData = {
            items: Array.from(this.items.entries()),
            money: this.money,
            maxSlots: this.maxSlots
        };
        localStorage.setItem('inventoryData', JSON.stringify(saveData));
    }

    /**
     * Загрузка из localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('inventoryData');
            if (saved) {
                const saveData = JSON.parse(saved);
                this.items = new Map(saveData.items);
                this.money = saveData.money || 100;
                this.maxSlots = saveData.maxSlots || 20;
            }
        } catch (error) {
            console.error('Ошибка загрузки инвентаря:', error);
            // Сброс к начальным значениям
            this.items = new Map();
            this.money = 100;
            this.maxSlots = 20;
        }
    }

    /**
     * Сброс инвентаря
     */
    reset() {
        this.items.clear();
        this.money = 100;
        this.activeBuffs = [];
        this.saveToStorage();
    }

    /**
     * Добавить деньги
     */
    addMoney(amount) {
        this.money += amount;
        this.saveToStorage();
        return this.money;
    }

    /**
     * Убрать деньги
     */
    removeMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.saveToStorage();
            return true;
        }
        return false;
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.InventorySystem = InventorySystem;
window.itemsData = itemsData;
