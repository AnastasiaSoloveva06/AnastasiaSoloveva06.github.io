

const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
let allDishes = [];
let savedOrder = JSON.parse(localStorage.getItem('currentOrder')) || {};

// Элементы DOM
const cartGrid = document.getElementById('cart-grid');
const emptyMessage = document.getElementById('empty-cart-message');
const checkoutSection = document.getElementById('checkout-form-section');
const totalPriceElement = document.getElementById('total-price-value');

// Глобальный объект для хранения полных данных о выбранных блюдах
let orderDetails = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

async function init() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Ошибка сети');
        allDishes = await response.json();
        
        // После загрузки всех блюд, сопоставляем ID из localStorage с реальными объектами
        matchDishes();
        renderCart();
        updateFormSummary();
    } catch (error) {
        console.error(error);
        alert('Ошибка загрузки меню');
    }
}

// Сопоставление ID с объектами блюд
function matchDishes() {
    // Проходим по ключам: soup, main, salad, drink, dessert
    for (const [key, id] of Object.entries(savedOrder)) {
        if (id) {
            const dish = allDishes.find(d => d.keyword === id);
            if (dish) {
                orderDetails[key] = dish;
            }
        }
    }
}

// Отрисовка карточек в разделе "Состав заказа"
function renderCart() {
    cartGrid.innerHTML = '';
    let hasItems = false;

    // Порядок отображения (можно менять)
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];

    categories.forEach(cat => {
        const dish = orderDetails[cat];
        if (dish) {
            hasItems = true;
            const card = createDeleteCard(dish, cat);
            cartGrid.appendChild(card);
        }
    });

    if (!hasItems) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        checkoutSection.style.display = 'block';
    }
}

// Создание карточки с кнопкой "Удалить"
function createDeleteCard(dish, categoryKey) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    
    const img = document.createElement('img');
    img.src = dish.image;
    img.alt = dish.name;

    const price = document.createElement('p');
    price.className = 'dish-price';
    price.textContent = `${dish.price}₽`;

    const name = document.createElement('p');
    name.className = 'dish-name';
    name.textContent = dish.name;

    const weight = document.createElement('p');
    weight.className = 'dish-weight';
    weight.textContent = dish.count;

    const button = document.createElement('button');
    button.textContent = 'Удалить';

    button.addEventListener('click', (e) => {
        e.stopPropagation(); 
        removeFromOrder(categoryKey);
    });

    card.appendChild(img);
    card.appendChild(price);
    card.appendChild(name);
    card.appendChild(weight);
    card.appendChild(button);

    return card;
}

// Удаление блюда
function removeFromOrder(categoryKey) {
    // 1. Удаляем из объекта деталей
    orderDetails[categoryKey] = null;
    
    // 2. Обновляем localStorage (удаляем ID)
    savedOrder[categoryKey] = null;
    localStorage.setItem('currentOrder', JSON.stringify(savedOrder));

    // 3. Перерисовываем интерфейс
    renderCart();
    updateFormSummary();
}

// Обновление левой части формы (список и цена)
function updateFormSummary() {
    let total = 0;

    // Функция-хелпер для обновления строки
    const updateRow = (id, dish) => {
        const rowVal = document.querySelector(`#${id} .order-item-value`);
        const hiddenInput = document.querySelector(`#input-${id.replace('summary-', '')}`);
        
        if (dish) {
            rowVal.textContent = `${dish.name} ${dish.price}₽`;
            total += dish.price;
            if (hiddenInput) hiddenInput.value = dish.keyword;
        } else {
            // Для главного блюда пишем "Не выбрано", для остальных "Не выбран" (как в ТЗ)
            if (id === 'summary-main') {
                rowVal.textContent = 'Не выбрано';
            } else {
                rowVal.textContent = 'Не выбран';
            }
            if (hiddenInput) hiddenInput.value = '';
        }
    };

    updateRow('summary-soup', orderDetails.soup);
    updateRow('summary-main', orderDetails.main);
    updateRow('summary-salad', orderDetails.salad);
    updateRow('summary-drink', orderDetails.drink);
    updateRow('summary-dessert', orderDetails.dessert);

    totalPriceElement.textContent = `${total}₽`;
}


function validateOrder() {
    const hasSoup = !!orderDetails.soup;
    const hasSalad = !!orderDetails.salad;
    const hasMain = !!orderDetails.main;
    const hasDrink = !!orderDetails.drink;
    
    const hasBaseComponent = hasSoup || hasSalad || hasMain;

    if (!hasBaseComponent && !hasDrink && !orderDetails.dessert) {
        return 'Ничего не выбрано.'; 
    }
    
    if ((hasDrink || orderDetails.dessert) && !hasBaseComponent) {
        return 'Выберите главное блюдо'; 
    }

    if (hasSoup && !hasMain && !hasSalad) {
        return 'Выберите главное блюдо/салат/стартер'; 
    }
    
    if (hasSalad && !hasMain && !hasSoup) {
        return 'Выберите суп или главное блюдо'; 
    }
    
    if (hasSoup && hasSalad && !hasMain) {
        return 'Выберите главное блюдо';
    }

    const isBaseComboSelected = (hasSoup && hasMain) || (hasSalad && hasMain);

    if (isBaseComboSelected) {
        if (!hasDrink) {
            return 'Выберите напиток'; 
        }
        return null; 
    }
    
    return 'Некорректный набор блюд. Требуется комбинация Главное+Суп/Салат и Напиток.';
}

// Уведомление 
function showNotification(message) {
    let existingDialog = document.getElementById('validation-dialog');
    if (existingDialog) existingDialog.remove();

    const dialog = document.createElement('dialog');
    dialog.id = 'validation-dialog';
    dialog.innerHTML = `
        <div class="notification-content">
            <p class="notification-message">${message}</p>
            <button class="notification-button">Окей 👌</button>
        </div>
    `;

    dialog.style.padding = '20px';
    dialog.style.borderRadius = '10px';
    dialog.style.border = '1px solid #ccc';
    
    document.body.appendChild(dialog);
    dialog.querySelector('button').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    dialog.showModal();
}

const orderForm = document.querySelector('.order-form');
orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const error = validateOrder();
    if (error) {
        showNotification(error);
    } else {

        const ORDERS_STORAGE_KEY = 'userOrders';
        const formData = new FormData(orderForm);
        const deliveryTimeType = formData.get('delivery_time_type');
        const deliveryTime = formData.get('delivery_time');
        
        // Получаем общую стоимость
        const rawTotalPrice = totalPriceElement.textContent.replace('₽', '').trim();
        const finalPrice = parseFloat(rawTotalPrice); 

        // Собираем список названий блюд
        const dishesList = Object.values(orderDetails)
                                .filter(dish => dish !== null)
                                .map(dish => dish.name);
                                
        // Создание объекта нового заказа
        const newOrder = {
    id: Date.now(), 
    date: new Date().toISOString(),
    dishes: dishesList,
    totalPrice: finalPrice,
    deliveryTimeType: deliveryTimeType,
    deliveryTime: deliveryTimeType === 'specified' ? deliveryTime : null,
    address: formData.get('address'),
    phone: formData.get('phone'),
    name: formData.get('name'), 
    email: formData.get('email'),
    comments: formData.get('comments') 
};
        
        // Загрузка существующих заказов и сохранение нового
        let existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
        existingOrders.push(newOrder);

        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));

        // Очистка временного заказа
        localStorage.removeItem('currentOrder');
        
        // Успешное уведомление
        showNotification('✅ Ваш заказ успешно оформлен и добавлен в историю! Переход на страницу "Заказы"...');
        
        // Задержка перед переходом на страницу "Заказы"
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1500);
        
       
    }
});


init();