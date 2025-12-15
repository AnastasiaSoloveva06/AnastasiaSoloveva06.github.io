// lunch.js

// Глобальная переменная для хранения блюд
let dishes = [];

// При загрузке страницы пытаемся восстановить заказ из localStorage
let currentOrder = {
    soup: null,
    salad: null, 
    main: null, 
    drink: null,
    dessert: null 
};

// Проверяем, есть ли сохраненный заказ
const savedOrder = localStorage.getItem('currentOrder');
if (savedOrder) {
    currentOrder = JSON.parse(savedOrder);
}

const activeFilters = {
    soup: null,
    salad: null,
    main: null,
    drink: null,
    dessert: null
};

const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Получение элементов-контейнеров
const soupsGrid = document.getElementById('soups-grid');
const saladsGrid = document.getElementById('salads-grid'); 
const mainsGrid = document.getElementById('mains-grid');
const drinksGrid = document.getElementById('drinks-grid');
const dessertsGrid = document.getElementById('desserts-grid');

// Получение элементов панели оформления заказа
const checkoutPanel = document.getElementById('checkout-panel');
const totalPriceValue = document.getElementById('total-price-value');
const checkoutLink = document.getElementById('checkout-link');

// Получение элементов диалога
const dialog = document.getElementById('validation-dialog');
const notificationMessage = dialog ? dialog.querySelector('.notification-message') : null;
const notificationButton = dialog ? dialog.querySelector('.notification-button') : null;


// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

/**
 * Вспомогательная функция для получения ключа категории для currentOrder.
 */
function getCategoryKey(category) {
    // Категория в HTML (data-category) для Главного Блюда - 'main', но в JSON 'main-course'
    return category === 'main-course' ? 'main' : 
           category === 'main' ? 'main' : category;
}

/**
 * Проверяет, соответствует ли текущий заказ одному из доступных комбо.
 */
function checkComboValidity(order) {
    const hasMain = !!order.main;
    // Комбо требует Суп ИЛИ Салат
    const hasSoupOrSalad = !!order.soup || !!order.salad; 
    const hasDrink = !!order.drink;
    
    // Комбо считается валидным, если выбрано Главное, (Суп ИЛИ Салат) и Напиток
    return hasMain && hasSoupOrSalad && hasDrink;
}

/**
 * Рассчитывает общую стоимость заказа.
 */
function calculateTotalPrice(order) {
    let totalPrice = 0;
    const keywords = Object.values(order).filter(id => id !== null); 
    
    keywords.forEach(keyword => {
        const dish = dishes.find(d => d.keyword === keyword);
        if (dish && dish.price) {
            totalPrice += dish.price;
        }
    });
    
    return totalPrice;
}

/**
 * Обновляет панель оформления заказа: цену, статус кнопки и видимость.
 */
function updateCheckoutPanel() {
    if (!checkoutPanel) return;
    
    const totalPrice = calculateTotalPrice(currentOrder);
    const isValidCombo = checkComboValidity(currentOrder);
    const isOrderEmpty = totalPrice === 0; 

    // 1. Обновление цены
    if (totalPriceValue) {
        totalPriceValue.textContent = `${totalPrice}₽`;
    }
    
    // 2. Обновление статуса ссылки
    if (checkoutLink) {
        if (isValidCombo) {
            checkoutLink.classList.remove('disabled');
        } else {
            checkoutLink.classList.add('disabled');
        }
    }
    
    // 3. Обновление видимости панели (скрыта, если заказ пуст)
    checkoutPanel.style.display = isOrderEmpty ? 'none' : 'flex'; 
}

/**
 * Обновляет визуальное выделение выбранного блюда в меню.
 */
function updateSelectionHighlight(categoryName) {
    const categoryKey = getCategoryKey(categoryName);
    
    const categoryContainer = document.querySelector(`.menu-section[data-category="${categoryKey}"]`);
    if (!categoryContainer) return;
    
    const selectedKeyword = currentOrder[categoryKey];

    categoryContainer.querySelectorAll('.dish-card').forEach(card => {
        const cardKeyword = card.dataset.keyword;
        
        if (cardKeyword === selectedKeyword) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

/**
 * Показывает модальное окно с уведомлением.
 */
function showNotification(message) {
    if (!dialog || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    
    if (dialog.open) {
        dialog.close();
    }
    
    dialog.showModal();
}


// --- ОСНОВНАЯ ЛОГИКА МЕНЮ ---

async function loadDishes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        dishes = await response.json();
        
        dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' }));

        renderAllDishes();
        
        Object.keys(currentOrder).forEach(key => {
            const categoryName = key === 'main' ? 'main' : key; 
            updateSelectionHighlight(categoryName);
        });
        updateCheckoutPanel();
        
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.dataset.keyword = dish.keyword; 
    
    const categoryKey = getCategoryKey(dish.category);
    if (currentOrder[categoryKey] === dish.keyword) {
        card.classList.add('selected'); 
    }

    if (dish.category === 'dessert' && dish.kind === 'large') {
        card.classList.add('dessert-large');
    }

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="dish-name">${dish.name}</p>
        <p class="dish.count">${dish.count}</p>
        <p class="dish-price">${dish.price}₽</p>
        <button class="btn-select">Выбрать</button>
    `;

    const handler = (event) => {
        event.stopPropagation();
        
        addToOrder(dish); 
        updateSelectionHighlight(dish.category); 
        updateCheckoutPanel(); 
    };

    const button = card.querySelector('.btn-select');
    if (button) {
        button.addEventListener('click', handler);
    }
    card.addEventListener('click', handler);
    
    return card;
}


function renderDishes(category, kind = null) {
    let gridElement;
    let categoryKeyword = category;

    if (category === 'main-course') categoryKeyword = 'main';

    switch (categoryKeyword) {
        case 'soup':
            gridElement = soupsGrid;
            break;
        case 'salad':
            gridElement = saladsGrid;
            break;
        case 'main':
            gridElement = mainsGrid;
            category = 'main-course'; 
            break;
        case 'drink':
            gridElement = drinksGrid;
            break;
        case 'dessert':
            gridElement = dessertsGrid;
            break;
        default:
            return;
    }

    gridElement.innerHTML = '';

    const filteredDishes = dishes.filter(dish => {
        if (dish.category !== category) return false;
        if (kind && dish.kind !== kind) return false;
        return true;
    });

    filteredDishes.forEach(dish => {
        const card = createDishCard(dish);
        gridElement.appendChild(card);
    });
}

function renderAllDishes() {
    renderDishes('soup');
    renderDishes('salad');
    renderDishes('main-course'); 
    renderDishes('drink');
    renderDishes('dessert');
}

function addToOrder(dish) {
    let categoryKey = getCategoryKey(dish.category); 

    if (currentOrder[categoryKey] === dish.keyword) {
        currentOrder[categoryKey] = null; 
        console.log('Удалено из заказа:', dish.name);
    } else {
        currentOrder[categoryKey] = dish.keyword;
        console.log('Добавлено в заказ:', dish.name);
    }
    
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
}


// --- ОБРАБОТЧИК КНОПКИ "ПЕРЕЙТИ К ОФОРМЛЕНИЮ" ---
if (checkoutLink) {
    checkoutLink.addEventListener('click', (event) => {
        const isValidCombo = checkComboValidity(currentOrder);
        
        if (!isValidCombo) {
            event.preventDefault(); // Блокируем переход
            
            const isOrderEmpty = calculateTotalPrice(currentOrder) === 0;
            
            if (!isOrderEmpty) {
                 showNotification('Для оформления заказа необходимо собрать комбо: Главное блюдо + (Суп или Салат) + Напиток.');
            } else {
                 // Этот блок не должен срабатывать, так как пустая панель скрыта
                 showNotification('Ваш заказ пуст. Выберите блюда для продолжения.');
            }
        }
        // Если isValidCombo == true, переход происходит по умолчанию
    });
}

// Обработчик закрытия диалога
if (notificationButton) {
    notificationButton.addEventListener('click', () => {
        if(dialog) dialog.close();
    });
}


// Обработчики фильтров (без изменений)
const menuSections = document.querySelectorAll('.menu-section');
menuSections.forEach(section => {
    let category = section.dataset.category; 
    let filterCategory = category;

    if (category === 'main') filterCategory = 'main-course'; 

    const filterButtons = section.querySelectorAll('.filters button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kind = button.dataset.kind;
            if (activeFilters[filterCategory] === kind) {
                activeFilters[filterCategory] = null;
                button.classList.remove('active');
            } else {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                activeFilters[filterCategory] = kind;
                button.classList.add('active');
            }
            renderDishes(filterCategory, activeFilters[filterCategory]);
        });
    });
});

// Запуск
loadDishes();