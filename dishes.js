const dishes = [
    // Супы (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
    {
        keyword: 'borsch',
        name: 'Борщ с говядиной',
        price: 395,
        category: 'soup',
        count: '350 г',
        image: 'folo2.jpg',
        kind: 'meat' // Мясной
    },

    {
        keyword: 'cream_soup',
        name: 'Венгерский суп-гуляш',
        price: 240,
        category: 'soup',
        count: '350 г',
        image: 'folo10.jpg', 
        kind: 'meat' // Мясной
    },

    {
        keyword: 'mushroom_soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'folo9.jpg',
        kind: 'veg' // Вегетарианский
    },
    {
        keyword: 'okroshka',
        name: 'Окрошка',
        price: 270,
        category: 'soup',
        count: '330 г',
        image: 'folo3.jpg',
        kind: 'veg' // Вегетарианский
    },
    {
        keyword: 'gazpacho',
        name: 'Рыбная солянка',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'folo11.jpg', 
        kind: 'fish' // Рыбный
    },
    {
        keyword: 'fish_soup',
        name: 'Уха из лосося',
        price: 350,
        category: 'soup',
        count: '300 г',
        image: 'folo12.jpg', 
        kind: 'fish' // Рыбный
    },
    
    // Главные блюда (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
    {
        keyword: 'potatoes',
        name: 'Жареная картошка с грибами',
        price: 150,
        category: 'main',
        count: '250 г',
        image: 'folo5.jpg',
        kind: 'veg' // Вегетарианское
    },

   {
        keyword: 'lasagna',
        name: 'Овощное рагу с тофу',
        price: 385,
        category: 'main',
        count: '310 г',
        image: 'folo13.jpg', 
        kind: 'veg' // Вегетарианское
    },

    {
        keyword: 'carbonara',
        name: 'Паста "Карбонара"',
        price: 385,
        category: 'main',
        count: '310 г',
        image: 'folo1.jpg',
        kind: 'meat' // Мясное
    },
    {
        keyword: 'pizza',
        name: 'Пицца "Маргарита"',
        price: 450,
        category: 'main',
        count: '380 г',
        image: 'folo4.jpg',
        kind: 'meat' // Мясное
    },
    {
        keyword: 'salmon_steak',
        name: 'Стейк из лосося',
        price: 520,
        category: 'main',
        count: '200 г',
        image: 'folo14.jpg', 
        kind: 'fish' // Рыбное
    },
 
    {
        keyword: 'fish_cutlet',
        name: 'Рыбная котлета с пюре',
        price: 320,
        category: 'main',
        count: '270 г',
        image: 'folo15.jpg', 
        kind: 'fish' // Рыбное
    },

    // Салаты и стартеры (6 блюд: 1 рыбный, 1 мясной, 4 вегетарианских)
    {
        keyword: 'caesar_chicken',
        name: 'Салат "Цезарь" с курицей',
        price: 370,
        category: 'salad',
        count: '220 г',
        image: 'folo16.jpg', 
        kind: 'meat' // Мясной
    },
    {
        keyword: 'tuna_salad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'salad',
        count: '250 г',
        image: 'folo17.jpg', 
        kind: 'fish' // Рыбный
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'salad',
        count: '235 г',
        image: 'folo18.jpg', 
        kind: 'veg' // Вегетарианский
    },
    {
        keyword: 'korean_salad',
        name: 'Корейский салат с яйцом',
        price: 330,
        category: 'salad',
        count: '250 г',
        image: 'folo19.jpg', 
        kind: 'veg' // Вегетарианский
    },
    {
        keyword: 'fries',
        name: 'Картофель фри',
        price: 260,
        category: 'salad',
        count: '235 г',
        image: 'folo20.jpg', 
        kind: 'veg' // Вегетарианский
    },
    {
        keyword: 'ceasar_fries',
        name: 'салат "Греческий"',
        price: 280,
        category: 'salad',
        count: '235 г',
        image: 'folo21.jpg', 
        kind: 'veg' // Вегетарианский
    },

    // Напитки (6 блюд: 3 холодных, 3 горячих)
    {
        keyword: 'tea',
        name: 'Чай без сахара',
        price: 80,
        category: 'drink',
        count: '300 мл',
        image: 'folo6.jpg',
        kind: 'hot' // Горячий
    },

   {
        keyword: 'cappuccino',
        name: 'Капучино',
        price: 180,
        category: 'drink',
        count: '300 мл',
        image: 'folo23.jpg',
        kind: 'hot' // Горячий
    },

    {
        keyword: 'green_tea',
        name: 'Зеленый чай',
        price: 100,
        category: 'drink',
        count: '300 мл',
        image: 'folo22.jpg', 
        kind: 'hot' // Горячий
    },

    {
        keyword: 'apple_juice',
        name: 'Яблочный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'folo7.jpg',
        kind: 'cold' // Холодный
    },
    {
        keyword: 'smoothie',
        name: 'Клубничный смузи',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'folo8.jpg',
        kind: 'cold' // Холодный
    },
 
    {
        keyword: 'carrot_juice',
        name: 'Морковный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'folo24.jpg', 
        kind: 'cold' // Холодный
    },
    
    // Десерты (6 блюд: 3 маленьких, 2 средних, 1 большой)
    {
        keyword: 'tiramisu',
        name: 'Тирамису',
        price: 290,
        category: 'dessert',
        count: '120 г',
        image: 'folo25.jpg', 
        kind: 'small' // Маленькая порция
    },

  {
        keyword: 'brownie',
        name: 'Брауни',
        price: 180,
        category: 'dessert',
        count: '80 г',
        image: 'folo26.jpg', 
        kind: 'small' // Маленькая порция
    },

    {
        keyword: 'chocolate_fondant',
        name: 'Шоколадный фондан',
        price: 210,
        category: 'dessert',
        count: '100 г',
        image: 'folo27.jpg', 
        kind: 'small' // Маленькая порция
    },

    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 350,
        category: 'dessert',
        count: '150 г',
        image: 'folo28.jpg',
        kind: 'medium' // Средняя порция
    },
  
    {
        keyword: 'fruit_salad',
        name: 'Панна-котта',
        price: 220,
        category: 'dessert',
        count: '180 г',
        image: 'folo29.jpg', 
        kind: 'medium' // Средняя порция
    },
    {
        keyword: 'big_cake',
        name: 'Торт "Наполеон"',
        price: 590,
        category: 'dessert',
        count: '450 г',
        image: 'folo30.jpg', 
        kind: 'large' // Большая порция
    },
];