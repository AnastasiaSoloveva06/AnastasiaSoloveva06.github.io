// Сортировка блюд по алфавиту
dishes.sort((a, b) => a.name.localeCompare(b.name));

let currentOrder = {
    soup: null,
    salad: null, // Новая категория
    main: null,
    drink: null,
    dessert: null // Новая категория
};

// Хранение активных фильтров для каждой категории
const activeFilters = {
    soup: null,
    salad: null,
    main: null,
    drink: null,
    dessert: null
};

// Получение элементов-контейнеров
// Контейнеры для новых категорий: saladsGrid и dessertsGrid
const soupsGrid = document.getElementById('soups-grid');
const saladsGrid = document.getElementById('salads-grid'); 
const mainsGrid = document.getElementById('mains-grid');
const drinksGrid = document.getElementById('drinks-grid');
const dessertsGrid = document.getElementById('desserts-grid');


// Функция создания карточки блюда
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.dataset.dish = dish.keyword; 

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
    button.textContent = 'Добавить';

    card.appendChild(img);
    card.appendChild(price);
    card.appendChild(name);
    card.appendChild(weight);
    card.appendChild(button);


    card.addEventListener('click', () => {
        addToOrder(dish);
    });

    return card;
}

// Универсальная функция отображения блюд в сетке с учетом фильтра
function renderDishes(category, filterKind = null) {
    // Определяем нужный контейнер по категории
    let gridElement;
    if (category === 'soup') gridElement = soupsGrid;
    else if (category === 'salad') gridElement = saladsGrid;
    else if (category === 'main') gridElement = mainsGrid;
    else if (category === 'drink') gridElement = drinksGrid;
    else if (category === 'dessert') gridElement = dessertsGrid;
    else return;

    gridElement.innerHTML = ''; // Очищаем сетку

    const filteredDishes = dishes.filter(dish => {
        // Условие 1: Блюдо принадлежит нужной категории
        const categoryMatch = dish.category === category;
        // Условие 2: Если фильтр задан, проверяем совпадение kind, иначе true
        const kindMatch = !filterKind || dish.kind === filterKind;
        return categoryMatch && kindMatch;
    });

    filteredDishes.forEach(dish => {
        const card = createDishCard(dish);
        gridElement.appendChild(card);
    });
}


// Логика добавления в заказ
function addToOrder(dish) {

    if (dish.category === 'soup') currentOrder.soup = dish;
     // Новая категория
    if (dish.category === 'main') currentOrder.main = dish;
    if (dish.category === 'salad') currentOrder.salad = dish;
    if (dish.category === 'drink') currentOrder.drink = dish;
    if (dish.category === 'dessert') currentOrder.dessert = dish; // Новая категория

    updateOrderDisplay();
}

// Функция обновления отображения заказа и итоговой стоимости (обновлена для 5 категорий)
function updateOrderDisplay() {
    const emptyMessage = document.getElementById('nothing-selected');
    const orderSummary = document.getElementById('order-summary');
    const totalPriceBlock = document.getElementById('total-price-block');
    const totalPriceValue = document.getElementById('total-price-value');

   
    const inputSoup = document.getElementById('input-soup');
    const inputSalad = document.getElementById('input-salad'); // Новое скрытое поле
    const inputMain = document.getElementById('input-main');
    const inputDrink = document.getElementById('input-drink');
    const inputDessert = document.getElementById('input-dessert'); // Новое скрытое поле

    const isAnySelected = currentOrder.soup || currentOrder.salad || currentOrder.main || currentOrder.drink || currentOrder.dessert;

    if (!isAnySelected) {
        // Если ничего не выбрано
        emptyMessage.style.display = 'block';
        orderSummary.style.display = 'none';
        totalPriceBlock.style.display = 'none';
    } else {
        // Если выбрано хотя бы одно блюдо
        emptyMessage.style.display = 'none';
        orderSummary.style.display = 'block';
        totalPriceBlock.style.display = 'block';

        // Обновляем строки для всех 5 категорий
        updateSummaryRow('soup', 'Суп');
        updateSummaryRow('salad', 'Салат/Стартер'); 
        updateSummaryRow('main', 'Главное блюдо');
        updateSummaryRow('drink', 'Напиток');
        updateSummaryRow('dessert', 'Десерт'); 

        // Считаем итоговую стоимость
        let total = 0;
        if (currentOrder.soup) total += currentOrder.soup.price;
        if (currentOrder.salad) total += currentOrder.salad.price; 
        if (currentOrder.main) total += currentOrder.main.price;
        if (currentOrder.drink) total += currentOrder.drink.price;
        if (currentOrder.dessert) total += currentOrder.dessert.price; 

        totalPriceValue.textContent = `${total}₽`;
    }

    // Обновляем значения скрытых полей для отправки формы
    inputSoup.value = currentOrder.soup ? currentOrder.soup.keyword : '';
    inputSalad.value = currentOrder.salad ? currentOrder.salad.keyword : ''; 
    inputMain.value = currentOrder.main ? currentOrder.main.keyword : '';
    inputDrink.value = currentOrder.drink ? currentOrder.drink.keyword : '';
    inputDessert.value = currentOrder.dessert ? currentOrder.dessert.keyword : ''; 
}


function updateSummaryRow(type, labelText) {
    const row = document.getElementById(`order-${type}`);
    const dish = currentOrder[type];
    
    // Очистка содержания
    row.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'order-item-label';
    label.textContent = `${labelText}`;

    const value = document.createElement('span');
    value.className = 'order-item-value';

    if (dish) {
        value.textContent = `${dish.name} ${dish.price}₽`;
        value.style.color = 'black';
    } else {
        value.textContent = 'Блюдо не выбрано'; 
        value.style.color = '#888';
    }

    row.appendChild(label);
    row.appendChild(value);
}

// --- Инициализация и Логика фильтрации ---

// Изначальное отображение всех блюд
renderDishes('soup');
renderDishes('salad'); 
renderDishes('main');
renderDishes('drink');
renderDishes('dessert'); 

// Находим все секции меню, содержащие фильтры
const menuSections = document.querySelectorAll('.menu-section');

menuSections.forEach(section => {
    const category = section.dataset.category; // soup, salad, main, drink, dessert
    const filterButtons = section.querySelectorAll('.filters button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kind = button.dataset.kind;

            // 1. Управление активным состоянием и сбросом фильтра
            if (activeFilters[category] === kind) {
                // Если кликнули по уже активному фильтру -> Сброс
                activeFilters[category] = null;
                button.classList.remove('active');
            } else {
                // Иначе -> Активация нового фильтра
                
                // Сначала удаляем класс 'active' со ВСЕХ кнопок в этой секции
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Устанавливаем новый активный фильтр
                activeFilters[category] = kind;
                button.classList.add('active');
            }

            // 2. Перерисовка блюд для данной категории с учетом нового/сброшенного фильтра
            renderDishes(category, activeFilters[category]);
        });
    });
});

// Инициализируем отображение заказа при загрузке страницы
updateOrderDisplay();