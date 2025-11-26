// Сортировка блюд по алфавиту
dishes.sort((a, b) => a.name.localeCompare(b.name));

let currentOrder = {
    soup: null,
    main: null,
    drink: null
};

const soupsGrid = document.getElementById('soups-grid');
const mainsGrid = document.getElementById('mains-grid');
const drinksGrid = document.getElementById('drinks-grid');

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

// Отображение блюд на странице
dishes.forEach(dish => {
    const card = createDishCard(dish);
    if (dish.category === 'soup') {
        soupsGrid.appendChild(card);
    } else if (dish.category === 'main') {
        mainsGrid.appendChild(card);
    } else if (dish.category === 'drink') {
        drinksGrid.appendChild(card);
    }
});

// Логика добавления в заказ
function addToOrder(dish) {

    if (dish.category === 'soup') currentOrder.soup = dish;
    if (dish.category === 'main') currentOrder.main = dish;
    if (dish.category === 'drink') currentOrder.drink = dish;

    updateOrderDisplay();
}

// Функция обновления отображения заказа и итоговой стоимости
function updateOrderDisplay() {
    const emptyMessage = document.getElementById('nothing-selected');
    const orderSummary = document.getElementById('order-summary');
    const totalPriceBlock = document.getElementById('total-price-block');
    const totalPriceValue = document.getElementById('total-price-value');

   
    const inputSoup = document.getElementById('input-soup');
    const inputMain = document.getElementById('input-main');
    const inputDrink = document.getElementById('input-drink');

    const isAnySelected = currentOrder.soup || currentOrder.main || currentOrder.drink;

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

        // Обновляем строки
        updateSummaryRow('soup', 'Суп');
        updateSummaryRow('main', 'Главное блюдо');
        updateSummaryRow('drink', 'Напиток');

        // Считаем итоговую стоимость
        let total = 0;
        if (currentOrder.soup) total += currentOrder.soup.price;
        if (currentOrder.main) total += currentOrder.main.price;
        if (currentOrder.drink) total += currentOrder.drink.price;

        totalPriceValue.textContent = `${total}₽`;
    }

   
    inputSoup.value = currentOrder.soup ? currentOrder.soup.keyword : '';
    inputMain.value = currentOrder.main ? currentOrder.main.keyword : '';
    inputDrink.value = currentOrder.drink ? currentOrder.drink.keyword : '';
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