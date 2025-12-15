
const MOCK_ORDERS = [
    {
        id: 101,
        date: '2025-12-09T10:30:00.000Z', 
        dishes: [
            {name: "Салат \"Цезарь\" с курицей", price: 350}, 
            {name: "Борщ с говядиной", price: 300}, 
            {name: "Чай черный", price: 65}, 
            {name: "Чизкейк", price: 200}
        ],
        totalPrice: 915, 
        deliveryTimeType: 'specified',
        deliveryTime: '13:00',
        phone: '+79001112233',
        address: 'ул. Пушкина, 10, кв 5',
        name: 'Иванов Иван',
        email: 'ivan@example.com',
        comments: 'Позвонить за 5 минут до приезда.'
    },
    {
        id: 102,
        date: '2025-12-08T15:45:00.000Z', 
        dishes: [{name: "Пицца Маргарита", price: 500}, {name: "Кока-кола", price: 80}],
        totalPrice: 580,
        deliveryTimeType: 'asap',
        deliveryTime: null,
        phone: '+79004445566',
        address: 'пр. Ленина, 25, офис 10',
        name: 'Петров Алексей',
        email: 'alex@example.com',
        comments: 'Доставить строго до 16:30.'
    },
    {
        id: 103,
        date: '2025-12-09T11:00:00.000Z',
        dishes: [{name: "Стейк из лосося", price: 650}, {name: "Жареная картошка с грибами", price: 150}, {name: "Латте", price: 100}],
        totalPrice: 900,
        deliveryTimeType: 'asap',
        deliveryTime: null,
        phone: '+79007778899',
        address: 'ул. Садовая, 5, под. 3',
        name: 'Сидорова Елена',
        email: 'elena@example.com',
        comments: ''
    },
];

const ORDERS_STORAGE_KEY = 'userOrders';
const MOCK_KEY = 'ordersMockLoaded';

// --- DOM-элементы ---
const tableBody = document.getElementById('orders-table-body');
const emptyMessage = document.getElementById('empty-orders-message');
const tableWrapper = document.getElementById('orders-table-wrapper');

// Модальные окна и их элементы
const detailsModal = document.getElementById('details-modal');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const notification = document.getElementById('notification');

const editForm = document.getElementById('edit-form');
const deleteConfirmBtn = deleteModal.querySelector('.btn-delete');



// Загрузка заказов
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
    
    if (orders.length === 0 && !localStorage.getItem(MOCK_KEY)) {
        const ordersToSave = JSON.parse(JSON.stringify(MOCK_ORDERS));
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersToSave));
        localStorage.setItem(MOCK_KEY, 'true');
        orders = ordersToSave;
    }
    return orders;
}

// Поиск заказа по ID
function findOrder(orderId) {
    const orders = loadOrders();
    return orders.find(order => order.id == orderId);
}

// Показать уведомление
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4CAF50';
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Открыть модальное окно
function openModal(modalElement) {
    modalElement.style.display = 'flex';
}

// Закрыть модальное окно
function closeModal(modalElement) {
    modalElement.style.display = 'none';
}

// Форматирование даты
function formatOrderDate(isoDateString) {
    const date = new Date(isoDateString);
    if (isNaN(date)) return 'Неизвестная дата';
    
    return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', ''); 
}



// Рендеринг заказов
function renderOrders() {
    const orders = loadOrders();

    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (orders.length === 0) {
        emptyMessage.style.display = 'block';
        tableWrapper.style.display = 'none';
        return;
    }

    emptyMessage.style.display = 'none';
    tableWrapper.style.display = 'block';
    tableBody.innerHTML = ''; 

    orders.forEach((order, index) => {
        const formattedDate = formatOrderDate(order.date);
        
        let deliveryInfo = '';
        let deliveryClass = '';

        if (order.deliveryTimeType === 'asap') {
            deliveryInfo = 'Как можно скорее';
            deliveryClass = 'order-delivery-asap';
        } else if (order.deliveryTimeType === 'specified' && order.deliveryTime) {
            deliveryInfo = `${order.deliveryTime}`;
            deliveryClass = 'order-delivery-specified';
        } else {
             deliveryInfo = 'Не указано';
             deliveryClass = '';
        }
        
        const dishesNames = Array.isArray(order.dishes) ? 
            order.dishes.map(d => d.name || d).join(', ') : 
            (Array.isArray(order.dishes) ? order.dishes.join(', ') : 'Не указаны');


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formattedDate}</td>
            <td title="${dishesNames}">${order.dishes ? order.dishes.length : 0} блюд</td>
            <td class="order-total-price">${order.totalPrice || 0}₽</td>
            <td class="${deliveryClass}">${deliveryInfo}</td>
            <td>
                <div class="action-buttons">
                    <button title="Подробнее" data-action="details" data-id="${order.id}"><i class="bi bi-eye"></i></button>
                    <button title="Редактировать" data-action="edit" data-id="${order.id}"><i class="bi bi-pencil"></i></button>
                    <button title="Удалить" data-action="delete" data-id="${order.id}" class="delete-order-btn"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    addOrderActionListeners();
}

// Обработчики действий 

function addOrderActionListeners() {
    document.querySelectorAll('.action-buttons button').forEach(button => {
        const new_button = button.cloneNode(true);
        button.parentNode.replaceChild(new_button, button);

        new_button.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const orderId = e.currentTarget.dataset.id;
            
            switch (action) {
                case 'details':
                    showDetailsModal(orderId);
                    break;
                case 'edit':
                    showEditModal(orderId);
                    break;
                case 'delete':
                    showDeleteModal(orderId);
                    break;
            }
        });
    });
}


// 1. Подробнее (Просмотр)
function showDetailsModal(orderId) {
    const order = findOrder(orderId);
    if (!order) return showNotification('Ошибка: Заказ не найден.', true);

    const formattedDate = formatOrderDate(order.date);
    
    let deliveryInfo = (order.deliveryTimeType === 'asap') ? 
        'Как можно скорее' : (order.deliveryTime ? `${order.deliveryTime}` : 'Не указано');
    
 
    let dishesListHtml = '';

    if (Array.isArray(order.dishes) && order.dishes.length > 0) {
        order.dishes.forEach(dish => {
            const name = dish.name || dish;
            const price = dish.price || 0;
            
            let displayPrice = '';
            if (price > 0) {
                 displayPrice = ` (${price}₽)`;
            }

            dishesListHtml += `
                <div class="dish-detail-row">
                    <p class="details-label">${name}</p>
                    <p class="details-value">${displayPrice}</p>
                </div>
            `;
        });
    } else {
        dishesListHtml = '<p class="details-multiline-value">Нет данных о составе</p>';
    }
    
    // Заполнение элементов модального окна
    document.getElementById('details-date').textContent = formattedDate;
    document.getElementById('details-phone').textContent = order.phone || 'Не указан';
    document.getElementById('details-address').textContent = order.address || 'Не указан';
    document.getElementById('details-delivery-time').textContent = deliveryInfo;
    document.getElementById('details-comments').textContent = order.comments || 'Нет комментариев';
    document.getElementById('details-total-price').textContent = `${order.totalPrice || 0}₽`;
    document.getElementById('details-dishes-list').innerHTML = dishesListHtml;
    
    openModal(detailsModal);
}



function showEditModal(orderId) {
    const order = findOrder(orderId);
    if (!order) return showNotification('Ошибка: Заказ не найден.', true);

    // Обновлен ID для отображения
    document.getElementById('edit-order-id-display').textContent = orderId; 
    document.getElementById('edit-order-hidden-id').value = orderId;
    
    // Заполнение формы текущими данными
    document.getElementById('edit-date').textContent = formatOrderDate(order.date);
    document.getElementById('edit-phone').value = order.phone || '';
    document.getElementById('edit-address').value = order.address || '';
    
    // НОВЫЕ ПОЛЯ ИЗ МАКЕТА
    document.getElementById('edit-name').value = order.name || ''; 
    document.getElementById('edit-email').value = order.email || '';
    document.getElementById('edit-comments').value = order.comments || ''; 
    
    // Поле времени (теперь единственное)
    document.getElementById('edit-delivery-time-display').value = order.deliveryTime || '';
    
    // Устанавливаем скрытый тип времени, чтобы сохранить текущее значение, хотя логика формы его не использует напрямую
    document.getElementById('edit-delivery-time-type-hidden').value = order.deliveryTimeType || 'asap';
    

    
    // НОВЫЙ БЛОК: Заполнение состава заказа и стоимости
    let dishesListHtml = '';
    
    if (Array.isArray(order.dishes) && order.dishes.length > 0) {
        order.dishes.forEach(dish => {
            const name = dish.name || dish;
            const price = dish.price || 0;
            
            let displayPrice = '';
            if (price > 0) {
                 displayPrice = ` (${price}₽)`;
            }

            dishesListHtml += `
                <div class="dish-detail-row">
                    <p class="details-label">${name}</p>
                    <p class="details-value">${displayPrice}</p>
                </div>
            `;
        });
    } else {
        dishesListHtml = '<p class="details-multiline-value">Нет данных о составе</p>';
    }
    document.getElementById('edit-dishes-list').innerHTML = dishesListHtml;
    
    // Заполнение общей стоимости
    document.getElementById('edit-total-price').textContent = `${order.totalPrice || 0}₽`;

    openModal(editModal);
}

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const orderId = formData.get('id');
    const deliveryTime = formData.get('delivery_time');

    // Логика определения типа времени доставки на основе наличия времени в поле
    const deliveryTimeType = deliveryTime ? 'specified' : 'asap';
    
    try {
        let orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
        const orderIndex = orders.findIndex(order => order.id == orderId);
        
        if (orderIndex === -1) {
            return showNotification('Ошибка: Заказ для редактирования не найден.', true);
        }

        // Обновление данных заказа, включая новые поля
        orders[orderIndex] = {
            ...orders[orderIndex],
            name: formData.get('name'), 
            email: formData.get('email'),
            comments: formData.get('comments'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            deliveryTimeType: deliveryTimeType,
            deliveryTime: deliveryTimeType === 'specified' ? deliveryTime : null,
            updatedAt: new Date().toISOString() 
        };
        
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        
        closeModal(editModal);
        renderOrders();
        showNotification('✅ Заказ успешно изменён!', false);
    } catch (error) {
        console.error('Ошибка сохранения заказа:', error);
        showNotification('❌ Ошибка при сохранении заказа.', true);
    }
});


// **3. Удаление**
function showDeleteModal(orderId) {
    document.getElementById('delete-order-id-confirm').textContent = orderId;
    deleteConfirmBtn.dataset.id = orderId; 
    openModal(deleteModal);
}

function deleteOrder(orderId) {
    try {
        let orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
        const initialLength = orders.length;
        orders = orders.filter(order => order.id != orderId);
        
        if (orders.length === initialLength) {
             return showNotification('Ошибка: Заказ для удаления не найден.', true);
        }

        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        
        closeModal(deleteModal);
        renderOrders(); 
        showNotification('🗑️ Заказ успешно удалён!', false);
    } catch (error) {
        console.error('Ошибка удаления заказа:', error);
        showNotification('❌ Ошибка при удалении заказа.', true);
    }
}

// Обработчик кнопки "Да, удалить" в модальном окне
deleteConfirmBtn.addEventListener('click', (e) => {
    const orderId = e.currentTarget.dataset.id;
    if (orderId) {
        deleteOrder(orderId);
    }
});


document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', (e) => {
        let modal = e.target.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    });
});

document.addEventListener('DOMContentLoaded', renderOrders);