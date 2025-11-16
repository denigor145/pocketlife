/**
 * Система данных о противниках (клиентах)
 * Содержит информацию о всех типах клиентов, их характеристиках и поведении
 */

const opponentsData = {
    // Базовые клиенты (уровень 1-10)
    basic: [
        {
            id: 1,
            name: "Екатерина Марковна",
            type: "business_woman",
            level: 1,
            difficulty: "easy",
            
            // Основные характеристики
            maxHealth: 100,
            health: 100,
            resistance: 0.1, // Сопротивление убеждению (0-1)
            patience: 70, // Терпение клиента (влияет на уход)
            
            // Экономические показатели
            money: 150,
            budget: 200,
            willingnessToPay: 0.8, // Готовность платить полную цену
            
            // Визуальные параметры
            avatar: "👩‍💼",
            background: "business_woman.jpg",
            theme: "professional",
            
            // Поведение и диалоги
            behavior: {
                aggression: 0.2, // Агрессивность (0-1)
                persuadability: 0.7, // Внушаемость
                loyalty: 0.3, // Вероятность повторного визита
            },
            
            // Награды за победу
            drops: [
                { id: "money", type: "currency", min: 25, max: 37, chance: 100 },
                { id: "herbs", type: "trade_good", chance: 10 },
                { id: "rope", type: "trade_good", chance: 15 }
            ],
            
            // Особые способности (если есть)
            abilities: [],
            
            // Диалоги
            dialogues: {
                greeting: "Здравствуйте, я ищу качественный товар.",
                success: "Вы меня убедили, я возьму!",
                failure: "Извините, я подумаю ещё...",
                critical: "Ваши аргументы очень убедительны!",
                leave: "Мне нужно время на раздумья."
            }
        },
        {
            id: 2,
            name: "Сергеев Александр",
            type: "business_man", 
            level: 2,
            difficulty: "easy",
            
            maxHealth: 120,
            health: 120,
            resistance: 0.15,
            patience: 65,
            
            money: 200,
            budget: 250,
            willingnessToPay: 0.75,
            
            avatar: "👨‍💼",
            background: "business_man.jpg",
            theme: "professional",
            
            behavior: {
                aggression: 0.3,
                persuadability: 0.65,
                loyalty: 0.25,
            },
            
            drops: [
                { id: "money", type: "currency", min: 30, max: 50, chance: 100 },
                { id: "water", type: "trade_good", chance: 20 },
                { id: "paper", type: "trade_good", chance: 15 }
            ],
            
            abilities: [],
            
            dialogues: {
                greeting: "Добрый день, покажите ваш ассортимент.",
                success: "Хорошо, заключим сделку.",
                failure: "Не уверен, что это мне подходит.",
                critical: "Отличные условия! Беру!",
                leave: "Я посмотрю другие варианты."
            }
        },
        {
            id: 3,
            name: "Ирина Петрова",
            type: "student",
            level: 1,
            difficulty: "easy",
            
            maxHealth: 90,
            health: 90,
            resistance: 0.08,
            patience: 80,
            
            money: 100,
            budget: 150,
            willingnessToPay: 0.6,
            
            avatar: "👩‍🎓",
            background: "student.jpg",
            theme: "youth",
            
            behavior: {
                aggression: 0.1,
                persuadability: 0.8,
                loyalty: 0.4,
            },
            
            drops: [
                { id: "money", type: "currency", min: 20, max: 35, chance: 100 },
                { id: "herbs", type: "trade_good", chance: 15 },
                { id: "energy_drink", type: "consumable", chance: 5 }
            ],
            
            abilities: [],
            
            dialogues: {
                greeting: "Привет! Что у вас есть интересного?",
                success: "Круто! Я беру это!",
                failure: "Дороговато для студента...",
                critical: "Вау! Это именно то, что я искала!",
                leave: "Надо подсчитать бюджет..."
            }
        }
    ],

    // Средние клиенты (уровень 11-20)
    intermediate: [
        {
            id: 4,
            name: "Дмитрий Волков",
            type: "technician",
            level: 12,
            difficulty: "medium",
            
            maxHealth: 180,
            health: 180,
            resistance: 0.25,
            patience: 60,
            
            money: 300,
            budget: 400,
            willingnessToPay: 0.7,
            
            avatar: "👨‍🔧",
            background: "technician.jpg",
            theme: "technical",
            
            behavior: {
                aggression: 0.4,
                persuadability: 0.5,
                loyalty: 0.2,
            },
            
            drops: [
                { id: "money", type: "currency", min: 45, max: 70, chance: 100 },
                { id: "rope", type: "trade_good", chance: 25 },
                { id: "persuasion_booster", type: "booster", chance: 10 }
            ],
            
            abilities: [
                {
                    id: "technical_knowledge",
                    name: "Технические знания",
                    description: "Сложнее поддаётся эмоциональным аргументам",
                    effect: "reduce_emotional_impact"
                }
            ],
            
            dialogues: {
                greeting: "Нужен качественный товар, без лишних разговоров.",
                success: "Логично. Беру.",
                failure: "Ваши доводы недостаточно технически обоснованы.",
                critical: "Аргументы весомые. Согласен.",
                leave: "Поищу более компетентного продавца."
            }
        },
        {
            id: 5,
            name: "Ольга Семенова",
            type: "chef",
            level: 15,
            difficulty: "medium",
            
            maxHealth: 160,
            health: 160,
            resistance: 0.2,
            patience: 75,
            
            money: 350,
            budget: 450,
            willingnessToPay: 0.85,
            
            avatar: "👩‍🍳",
            background: "chef.jpg",
            theme: "culinary",
            
            behavior: {
                aggression: 0.25,
                persuadability: 0.6,
                loyalty: 0.35,
            },
            
            drops: [
                { id: "money", type: "currency", min: 50, max: 80, chance: 100 },
                { id: "rare_herbs", type: "trade_good", chance: 15 },
                { id: "stress_pills", type: "consumable", chance: 20 }
            ],
            
            abilities: [
                {
                    id: "quality_conscious",
                    name: "Требовательность к качеству",
                    description: "Более критично оценивает товар",
                    effect: "increase_quality_threshold"
                }
            ],
            
            dialogues: {
                greeting: "Здравствуйте, я ищу продукты высшего качества.",
                success: "Качество соответствует цене. Покупаю.",
                failure: "Не уверена в качестве...",
                critical: "Идеальное качество! Беру без раздумий!",
                leave: "Поищу товар получше."
            }
        }
    ],

    // Сложные клиенты (уровень 21+)
    advanced: [
        {
            id: 6,
            name: "Виктор Орлов",
            type: "investor",
            level: 25,
            difficulty: "hard",
            
            maxHealth: 250,
            health: 250,
            resistance: 0.4,
            patience: 50,
            
            money: 600,
            budget: 800,
            willingnessToPay: 0.6,
            
            avatar: "🕴️",
            background: "investor.jpg",
            theme: "luxury",
            
            behavior: {
                aggression: 0.6,
                persuadability: 0.3,
                loyalty: 0.15,
            },
            
            drops: [
                { id: "money", type: "currency", min: 80, max: 120, chance: 100 },
                { id: "vip_card", type: "key_item", chance: 5 },
                { id: "full_restore", type: "consumable", chance: 15 },
                { id: "cooldown_reducer", type: "booster", chance: 10 }
            ],
            
            abilities: [
                {
                    id: "financial_acumen",
                    name: "Финансовая хватка",
                    description: "Сложнее поддаётся на ценовые аргументы",
                    effect: "reduce_price_persuasion"
                },
                {
                    id: "time_pressure",
                    name: "Цейтнот",
                    description: "Быстро теряет терпение",
                    effect: "increase_patience_loss"
                }
            ],
            
            dialogues: {
                greeting: "У меня мало времени. Покажите лучшее, что у вас есть.",
                success: "Рациональное вложение. Согласен.",
                failure: "Не вижу в этом инвестиционной привлекательности.",
                critical: "Отличная инвестиционная возможность! Беру!",
                leave: "Время дороже денег. До свидания."
            }
        },
        {
            id: 7,
            name: "Мария Жукова",
            type: "art_critic",
            level: 30,
            difficulty: "expert",
            
            maxHealth: 300,
            health: 300,
            resistance: 0.5,
            patience: 40,
            
            money: 800,
            budget: 1000,
            willingnessToPay: 0.9,
            
            avatar: "🎨",
            background: "art_critic.jpg",
            theme: "artistic",
            
            behavior: {
                aggression: 0.3,
                persuadability: 0.2,
                loyalty: 0.1,
            },
            
            drops: [
                { id: "money", type: "currency", min: 100, max: 150, chance: 100 },
                { id: "business_license", type: "key_item", chance: 3 },
                { id: "success_booster", type: "booster", chance: 20 },
                { id: "rare_herbs", type: "trade_good", chance: 25 }
            ],
            
            abilities: [
                {
                    id: "aesthetic_standards",
                    name: "Высокие эстетические стандарты",
                    description: "Крайне требовательна к внешнему виду",
                    effect: "increase_aesthetic_requirements"
                },
                {
                    id: "emotional_detachment",
                    name: "Эмоциональная отстранённость",
                    description: "Не поддаётся эмоциональным аргументам",
                    effect: "immune_to_emotional_appeals"
                }
            ],
            
            dialogues: {
                greeting: "Я ищу нечто... особенное. Есть такое?",
                success: "В этом есть определённый шарм. Беру.",
                failure: "Безвкусица. Не впечатляет.",
                critical: "Великолепно! Это произведение искусства!",
                leave: "К сожалению, не вижу здесь ничего стоящего."
            }
        }
    ],

    // Боссы (особые клиенты)
    bosses: [
        {
            id: 8,
            name: "Аркадий Новиков",
            type: "business_tycoon",
            level: 50,
            difficulty: "boss",
            
            maxHealth: 500,
            health: 500,
            resistance: 0.7,
            patience: 30,
            
            money: 2000,
            budget: 3000,
            willingnessToPay: 0.5,
            
            avatar: "👑",
            background: "tycoon.jpg",
            theme: "premium",
            
            behavior: {
                aggression: 0.8,
                persuadability: 0.1,
                loyalty: 0.05,
            },
            
            drops: [
                { id: "money", type: "currency", min: 300, max: 500, chance: 100 },
                { id: "business_license", type: "key_item", chance: 50 },
                { id: "vip_card", type: "key_item", chance: 50 },
                { id: "full_restore", type: "consumable", chance: 30 },
                { id: "cooldown_reducer", type: "booster", chance: 25 }
            ],
            
            abilities: [
                {
                    id: "master_negotiator",
                    name: "Мастер переговоров",
                    description: "Против всех типов аргументов",
                    effect: "universal_resistance"
                },
                {
                    id: "intimidating_presence",
                    name: "Давящее присутствие",
                    description: "Ускоряет потерю стрессоустойчивости продавца",
                    effect: "increase_stress_damage"
                },
                {
                    id: "walk_away",
                    name: "Угроза ухода",
                    description: "Может уйти в любой момент",
                    effect: "random_leave_chance"
                }
            ],
            
            dialogues: {
                greeting: "У вас есть 2 минуты, чтобы меня заинтересовать.",
                success: "Неожиданно компетентно. Сделка состоялась.",
                failure: "Разочарован. Ждал большего.",
                critical: "Блестяще! Вы превзошли все ожидания!",
                leave: "Время вышло. Я ухожу."
            }
        }
    ]
};

class OpponentsSystem {
    constructor() {
        this.allOpponents = this.flattenOpponents();
        this.encounterHistory = new Map(); // История встреч с клиентами
        this.loadEncounterHistory();
    }

    /**
     * Преобразование вложенной структуры в плоский массив
     */
    flattenOpponents() {
        const all = [];
        for (let category in opponentsData) {
            all.push(...opponentsData[category]);
        }
        return all;
    }

    /**
     * Получить противника по ID
     */
    getOpponentById(id) {
        return this.allOpponents.find(opponent => opponent.id === id);
    }

    /**
     * Получить случайного противника по уровню сложности
     */
    getRandomOpponent(characterLevel, locationType = 'basic') {
        let availableOpponents = [];
        
        // Фильтрация по уровню сложности локации
        switch(locationType) {
            case 'basic':
                availableOpponents = opponentsData.basic;
                break;
            case 'intermediate':
                availableOpponents = [...opponentsData.basic, ...opponentsData.intermediate];
                break;
            case 'advanced':
                availableOpponents = [...opponentsData.intermediate, ...opponentsData.advanced];
                break;
            case 'premium':
                availableOpponents = [...opponentsData.advanced, ...opponentsData.bosses];
                break;
            default:
                availableOpponents = this.allOpponents;
        }

        // Фильтрация по уровню персонажа (±5 уровней)
        const levelRange = 5;
        const filtered = availableOpponents.filter(opponent => 
            Math.abs(opponent.level - characterLevel) <= levelRange
        );

        // Если нет подходящих по уровню, берем ближайших
        if (filtered.length === 0) {
            availableOpponents.sort((a, b) => 
                Math.abs(a.level - characterLevel) - Math.abs(b.level - characterLevel)
            );
            return this.cloneOpponent(availableOpponents[0]);
        }

        // Взвешенный случайный выбор (более высокие уровни реже)
        const weightedOpponents = [];
        filtered.forEach(opponent => {
            const weight = this.calculateSpawnWeight(opponent, characterLevel);
            for (let i = 0; i < weight; i++) {
                weightedOpponents.push(opponent);
            }
        });

        const randomIndex = Math.floor(Math.random() * weightedOpponents.length);
        const selected = weightedOpponents[randomIndex] || filtered[0];
        
        return this.cloneOpponent(selected);
    }

    /**
     * Расчет веса появления противника
     */
    calculateSpawnWeight(opponent, characterLevel) {
        let weight = 10; // Базовый вес
        
        // Учет разницы уровней
        const levelDiff = Math.abs(opponent.level - characterLevel);
        weight -= levelDiff * 2;
        
        // Учет редкости противника
        const rarityWeights = {
            'easy': 1,
            'medium': 0.8,
            'hard': 0.6,
            'expert': 0.4,
            'boss': 0.1
        };
        weight *= (rarityWeights[opponent.difficulty] || 1);
        
        // Учет истории встреч (редкие встречи с одним клиентом)
        const encounterCount = this.encounterHistory.get(opponent.id) || 0;
        weight /= (1 + encounterCount * 0.5);
        
        return Math.max(1, Math.floor(weight));
    }

    /**
     * Клонирование противника (для избежания мутаций)
     */
    cloneOpponent(opponent) {
        return JSON.parse(JSON.stringify(opponent));
    }

    /**
     * Зарегистрировать встречу с противником
     */
    registerEncounter(opponentId) {
        const currentCount = this.encounterHistory.get(opponentId) || 0;
        this.encounterHistory.set(opponentId, currentCount + 1);
        this.saveEncounterHistory();
    }

    /**
     * Получить историю встреч
     */
    getEncounterHistory() {
        const history = [];
        this.encounterHistory.forEach((count, opponentId) => {
            const opponent = this.getOpponentById(parseInt(opponentId));
            if (opponent) {
                history.push({
                    opponent: opponent,
                    encounterCount: count,
                    lastEncounter: this.getLastEncounterDate(opponentId)
                });
            }
        });
        return history.sort((a, b) => b.encounterCount - a.encounterCount);
    }

    /**
     * Получить дату последней встречи
     */
    getLastEncounterDate(opponentId) {
        // В реальной реализации можно хранить временные метки
        return new Date().toLocaleDateString();
    }

    /**
     * Получить противников по типу
     */
    getOpponentsByType(type) {
        return this.allOpponents.filter(opponent => opponent.type === type);
    }

    /**
     * Получить противников по уровню сложности
     */
    getOpponentsByDifficulty(difficulty) {
        return this.allOpponents.filter(opponent => opponent.difficulty === difficulty);
    }

    /**
     * Получить рекомендуемый уровень для противника
     */
    getRecommendedLevel(opponentId) {
        const opponent = this.getOpponentById(opponentId);
        return opponent ? opponent.level : 1;
    }

    /**
     * Получить информацию о дропе противника
     */
    getOpponentDropInfo(opponentId) {
        const opponent = this.getOpponentById(opponentId);
        if (!opponent) return null;

        return {
            opponent: opponent,
            drops: opponent.drops.map(drop => ({
                ...drop,
                averageValue: drop.type === 'currency' ? 
                    Math.round((drop.min + drop.max) / 2) : null,
                effectiveChance: this.calculateEffectiveDropChance(drop, opponent)
            }))
        };
    }

    /**
     * Расчет эффективного шанса дропа
     */
    calculateEffectiveDropChance(drop, opponent) {
        let chance = drop.chance;
        
        // Учет уровня сложности
        const difficultyMultiplier = {
            'easy': 1.0,
            'medium': 0.9,
            'hard': 0.8,
            'expert': 0.7,
            'boss': 0.6
        };
        
        chance *= (difficultyMultiplier[opponent.difficulty] || 1);
        
        return Math.min(100, chance);
    }

    /**
     * Сохранение истории встреч
     */
    saveEncounterHistory() {
        try {
            const historyData = Array.from(this.encounterHistory.entries());
            localStorage.setItem('encounterHistory', JSON.stringify(historyData));
        } catch (error) {
            console.error('Ошибка сохранения истории встреч:', error);
        }
    }

    /**
     * Загрузка истории встреч
     */
    loadEncounterHistory() {
        try {
            const saved = localStorage.getItem('encounterHistory');
            if (saved) {
                const historyData = JSON.parse(saved);
                this.encounterHistory = new Map(historyData);
            }
        } catch (error) {
            console.error('Ошибка загрузки истории встреч:', error);
            this.encounterHistory = new Map();
        }
    }

    /**
     * Сброс истории встреч
     */
    resetEncounterHistory() {
        this.encounterHistory.clear();
        this.saveEncounterHistory();
    }

    /**
     * Получить статистику по противникам
     */
    getOpponentStatistics() {
        const totalEncounters = Array.from(this.encounterHistory.values())
            .reduce((sum, count) => sum + count, 0);
        
        const uniqueOpponents = this.encounterHistory.size;
        const mostEncountered = this.getEncounterHistory()[0];
        
        return {
            totalEncounters: totalEncounters,
            uniqueOpponents: uniqueOpponents,
            mostEncountered: mostEncountered,
            encounterRate: totalEncounters > 0 ? 
                (uniqueOpponents / this.allOpponents.length) * 100 : 0
        };
    }
}

// Создаем глобальный экземпляр для использования в других модулях
window.OpponentsSystem = OpponentsSystem;
window.opponentsData = opponentsData;
