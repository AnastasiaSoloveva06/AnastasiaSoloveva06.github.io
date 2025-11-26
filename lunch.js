// Сортировка блюд по алфавиту
dishes.sort((a, b) => a.name.localeCompare(b.name));

let currentOrder = {
    soup: null,
    salad: null, 
    main: null,
    drink: null,
    dessert: null 
};


const activeFilters = {
    soup: null,
    salad: null,
    main: null,
    drink: null,
    dessert: null
};

// Получение элементов-контейнеров
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

// Универсальная функция отображения блюд
function renderDishes(category, filterKind = null) {
    let gridElement;
    if (category === 'soup') gridElement = soupsGrid;
    else if (category === 'salad') gridElement = saladsGrid;
    else if (category === 'main') gridElement = mainsGrid;
    else if (category === 'drink') gridElement = drinksGrid;
    else if (category === 'dessert') gridElement = dessertsGrid;
    else return;

    gridElement.innerHTML = ''; 

    const filteredDishes = dishes.filter(dish => {
        const categoryMatch = dish.category === category;
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
    if (dish.category === 'main') currentOrder.main = dish;
    if (dish.category === 'salad') currentOrder.salad = dish;
    if (dish.category === 'drink') currentOrder.drink = dish;
    if (dish.category === 'dessert') currentOrder.dessert = dish; 

    updateOrderDisplay();
}

// Функция обновления отображения заказа и итоговой стоимости
function updateOrderDisplay() {
    const emptyMessage = document.getElementById('nothing-selected');
    const orderSummary = document.getElementById('order-summary');
    const totalPriceBlock = document.getElementById('total-price-block');
    const totalPriceValue = document.getElementById('total-price-value');

   
    const inputSoup = document.getElementById('input-soup');
    const inputSalad = document.getElementById('input-salad'); 
    const inputMain = document.getElementById('input-main');
    const inputDrink = document.getElementById('input-drink');
    const inputDessert = document.getElementById('input-dessert'); 

    const isAnySelected = currentOrder.soup || currentOrder.salad || currentOrder.main || currentOrder.drink || currentOrder.dessert;

    if (!isAnySelected) {
        emptyMessage.style.display = 'block';
        orderSummary.style.display = 'none';
        totalPriceBlock.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        orderSummary.style.display = 'block';
        totalPriceBlock.style.display = 'block';

        updateSummaryRow('soup', 'Суп');
        updateSummaryRow('salad', 'Салат/Стартер'); 
        updateSummaryRow('main', 'Главное блюдо');
        updateSummaryRow('drink', 'Напиток');
        updateSummaryRow('dessert', 'Десерт'); 

        let total = 0;
        if (currentOrder.soup) total += currentOrder.soup.price;
        if (currentOrder.salad) total += currentOrder.salad.price; 
        if (currentOrder.main) total += currentOrder.main.price;
        if (currentOrder.drink) total += currentOrder.drink.price;
        if (currentOrder.dessert) total += currentOrder.dessert.price; 

        totalPriceValue.textContent = `${total}₽`;
    }

    inputSoup.value = currentOrder.soup ? currentOrder.soup.keyword : '';
    inputSalad.value = currentOrder.salad ? currentOrder.salad.keyword : ''; 
    inputMain.value = currentOrder.main ? currentOrder.main.keyword : '';
    inputDrink.value = currentOrder.drink ? currentOrder.drink.keyword : '';
    inputDessert.value = currentOrder.dessert ? currentOrder.dessert.keyword : ''; 
}


function updateSummaryRow(type, labelText) {
    const row = document.getElementById(`order-${type}`);
    const dish = currentOrder[type];
    
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


renderDishes('soup');
renderDishes('salad'); 
renderDishes('main');
renderDishes('drink');
renderDishes('dessert'); 

const menuSections = document.querySelectorAll('.menu-section');

menuSections.forEach(section => {
    const category = section.dataset.category; 
    const filterButtons = section.querySelectorAll('.filters button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kind = button.dataset.kind;

            if (activeFilters[category] === kind) {
                activeFilters[category] = null;
                button.classList.remove('active');
            } else {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                activeFilters[category] = kind;
                button.classList.add('active');
            }

            renderDishes(category, activeFilters[category]);
        });
    });
});

updateOrderDisplay();


// ФУНКЦИИ ДЛЯ УВЕДОМЛЕНИЯ 

function showNotification(message) {
    let existingDialog = document.getElementById('validation-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('dialog');
    dialog.id = 'validation-dialog';

    dialog.innerHTML = `
        <div class="notification-content">
            <p class="notification-message">${message}</p>
            <button class="notification-button">Окей 👌</button>
        </div>
    `; 


    const button = dialog.querySelector('.notification-button');
    
    button.addEventListener('click', () => {
        dialog.close(); 
        dialog.remove();
    });
    
    document.body.appendChild(dialog);
    dialog.showModal(); 
}

/**
 * Проверяет, соответствует ли текущий заказ одному из комбо.
 * Возвращает null, если комбо выбрано, или сообщение об ошибке, если нет.
 */
function validateOrder() {
    const hasSoup = !!currentOrder.soup;
    const hasSalad = !!currentOrder.salad;
    const hasMain = !!currentOrder.main;
    const hasDrink = !!currentOrder.drink;
    const hasDessert = !!currentOrder.dessert;
    
    const hasBaseComponent = hasSoup || hasSalad || hasMain;


    // 1. Уведомление: Ничего не выбрано
    if (!hasBaseComponent && !hasDrink && !hasDessert) {
        return 'Ничего не выбрано. Выберите блюда для заказа'; // Уведомление 1
    }
    
    // 5. Уведомление: Выбран только напиток/десерт, но нет основных блюд 
    if ((hasDrink || hasDessert) && !hasBaseComponent) {
        return 'Выберите главное блюдо'; // Уведомление 5
    }

    // 3. Уведомление: Выбран суп, но не выбраны главное блюдо/салат/стартер
    if (hasSoup && !hasMain && !hasSalad) {
        return 'Выберите главное блюдо/салат/стартер'; // Уведомление 3
    }
    
    // 4. Уведомление: Выбран салат/стартер, но не выбраны суп/главное блюдо
    if (hasSalad && !hasMain && !hasSoup) {
        return 'Выберите суп или главное блюдо'; // Уведомление 4
    }
    
    // Дополнительная проверка: Выбраны Суп и Салат, но нет Главного
    if (hasSoup && hasSalad && !hasMain) {
        return 'Выберите главное блюдо';
    }


    // Главная логика проверки комбо:
    // Комбо-база считается выбранной, если есть (Суп И Главное) ИЛИ (Салат И Главное).
    const isBaseComboSelected = (hasSoup && hasMain) || (hasSalad && hasMain);

    if (isBaseComboSelected) {
        // 2. Уведомление: База выбрана, но не выбран НАПИТОК. (Десерт не заменяет напиток для прохождения этого теста)
        if (!hasDrink) {
            return 'Выберите напиток'; // Уведомление 2
        }
        
        // Если база есть И Напиток есть, то все ОК (наличие десерта игнорируется, т.к. он опционален)
        return null; 
    }
    
    // Если ни одно из правил не сработало, значит, выбрана какая-то невалидная комбинация
    return 'Некорректный набор блюд. Требуется комбинация Главное+Суп/Салат и Напиток.';
}


const orderForm = document.querySelector('.order-form');


orderForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const validationMessage = validateOrder();

    if (validationMessage) {
        showNotification(validationMessage);
    } else {
        console.log('Заказ валиден и готов к отправке!');
        event.target.submit(); 
    }
});

orderForm.addEventListener('reset', (event) => {
    currentOrder = {
        soup: null,
        salad: null,
        main: null,
        drink: null,
        dessert: null
    };
    updateOrderDisplay();

    let existingDialog = document.getElementById('validation-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }
});