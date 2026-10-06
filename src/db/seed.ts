// Food catalog seed. Category is stored for future use only; it never affects Eat By.
export const CATALOG: Record<string, string[]> = {
  dairy: [
    'Milk', 'Whole Milk', 'Skim Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk', 'Lactose-Free Milk',
    'Buttermilk', 'Heavy Cream', 'Whipping Cream', 'Half and Half', 'Sour Cream', 'Cream Cheese',
    'Butter', 'Yogurt', 'Greek Yogurt', 'Drinkable Yogurt', 'Kefir', 'Cheese', 'Cheddar',
    'Mozzarella', 'Fresh Mozzarella', 'Parmesan', 'Feta', 'Brie', 'Gouda', 'Swiss Cheese',
    'Cottage Cheese', 'Ricotta', 'Mascarpone', 'Goat Cheese', 'Sliced Cheese', 'Shredded Cheese',
    'String Cheese', 'Pudding',
  ],
  eggs: ['Eggs', 'Quail Eggs', 'Boiled Eggs', 'Egg Whites'],
  meat: [
    'Beef', 'Ground Beef', 'Steak', 'Beef Brisket', 'Short Ribs', 'Bulgogi', 'Pork', 'Ground Pork',
    'Pork Belly', 'Pork Chops', 'Pork Shoulder', 'Bacon', 'Ham', 'Sliced Ham', 'Sausage',
    'Hot Dogs', 'Chorizo', 'Salami', 'Pepperoni', 'Prosciutto', 'Chicken', 'Chicken Breast',
    'Chicken Thighs', 'Chicken Wings', 'Chicken Drumsticks', 'Whole Chicken', 'Ground Chicken',
    'Rotisserie Chicken', 'Turkey', 'Ground Turkey', 'Sliced Turkey', 'Duck', 'Lamb',
    'Ground Lamb', 'Deli Meat', 'Meatballs',
  ],
  seafood: [
    'Salmon', 'Smoked Salmon', 'Tuna', 'Cod', 'Tilapia', 'Mackerel', 'Pollock', 'Halibut',
    'Sea Bass', 'Trout', 'Sardines', 'Anchovies', 'Shrimp', 'Prawns', 'Crab', 'Imitation Crab',
    'Lobster', 'Scallops', 'Clams', 'Mussels', 'Oysters', 'Squid', 'Octopus', 'Fish Cake',
    'Roe', 'Seaweed', 'Fish',
  ],
  vegetables: [
    'Spinach', 'Lettuce', 'Romaine', 'Iceberg Lettuce', 'Mixed Greens', 'Arugula', 'Kale',
    'Cabbage', 'Napa Cabbage', 'Red Cabbage', 'Bok Choy', 'Broccoli', 'Broccolini',
    'Cauliflower', 'Brussels Sprouts', 'Asparagus', 'Green Beans', 'Snap Peas', 'Snow Peas',
    'Peas', 'Edamame', 'Corn', 'Carrots', 'Baby Carrots', 'Celery', 'Cucumber', 'Zucchini',
    'Squash', 'Butternut Squash', 'Pumpkin', 'Eggplant', 'Tomatoes', 'Cherry Tomatoes',
    'Bell Pepper', 'Red Pepper', 'Green Pepper', 'Jalapeño', 'Chili Peppers', 'Onion',
    'Red Onion', 'Green Onion', 'Shallots', 'Leeks', 'Garlic', 'Ginger', 'Potato',
    'Sweet Potato', 'Radish', 'Daikon', 'Beets', 'Turnip', 'Parsnip', 'Mushrooms',
    'Shiitake Mushrooms', 'Enoki Mushrooms', 'Oyster Mushrooms', 'Portobello', 'Bean Sprouts',
    'Soybean Sprouts', 'Alfalfa Sprouts', 'Artichoke', 'Okra', 'Fennel', 'Watercress',
    'Perilla Leaves', 'Chives', 'Lotus Root', 'Burdock Root', 'Salad Kit', 'Coleslaw Mix',
    'Stir-Fry Vegetables',
  ],
  herbs: [
    'Basil', 'Cilantro', 'Parsley', 'Mint', 'Dill', 'Rosemary', 'Thyme', 'Oregano', 'Sage',
    'Lemongrass',
  ],
  fruit: [
    'Apple', 'Banana', 'Orange', 'Mandarin', 'Clementine', 'Grapefruit', 'Lemon', 'Lime',
    'Grapes', 'Green Grapes', 'Strawberries', 'Blueberries', 'Raspberries', 'Blackberries',
    'Cherries', 'Peach', 'Nectarine', 'Plum', 'Apricot', 'Pear', 'Asian Pear', 'Kiwi', 'Mango',
    'Pineapple', 'Papaya', 'Watermelon', 'Cantaloupe', 'Honeydew', 'Melon', 'Avocado',
    'Pomegranate', 'Figs', 'Persimmon', 'Dragon Fruit', 'Passion Fruit', 'Coconut',
    'Cut Fruit', 'Fruit Salad',
  ],
  tofu: [
    'Tofu', 'Firm Tofu', 'Soft Tofu', 'Silken Tofu', 'Fried Tofu', 'Tempeh', 'Seitan',
    'Hummus', 'Bean Curd',
  ],
  kimchi: [
    'Kimchi', 'Radish Kimchi', 'Cucumber Kimchi', 'Pickles', 'Pickled Radish', 'Sauerkraut',
    'Banchan', 'Japchae', 'Seasoned Spinach', 'Braised Potatoes', 'Anchovy Side Dish',
    'Seasoned Seaweed',
  ],
  grains: [
    'Rice', 'Cooked Rice', 'Brown Rice', 'Fried Rice', 'Bread', 'Sandwich Bread', 'Bagels',
    'Tortillas', 'Pita', 'Naan', 'Croissants', 'Muffins', 'English Muffins', 'Buns',
    'Dinner Rolls', 'Pizza Dough', 'Fresh Pasta', 'Cooked Pasta', 'Noodles', 'Udon',
    'Ramen Noodles', 'Rice Cakes', 'Tteok', 'Dumplings', 'Gnocchi', 'Tortilla Wraps',
  ],
  sauces: [
    'Ketchup', 'Mustard', 'Mayonnaise', 'Salsa', 'Guacamole', 'Pesto', 'Tomato Sauce',
    'Pasta Sauce', 'Alfredo Sauce', 'BBQ Sauce', 'Hot Sauce', 'Sriracha', 'Soy Sauce',
    'Gochujang', 'Doenjang', 'Ssamjang', 'Fish Sauce', 'Oyster Sauce', 'Hoisin Sauce',
    'Teriyaki Sauce', 'Salad Dressing', 'Ranch', 'Tahini', 'Jam', 'Peanut Butter',
    'Maple Syrup', 'Honey', 'Chutney', 'Curry Paste', 'Miso',
  ],
  prepared: [
    'Leftovers', 'Soup', 'Stew', 'Curry', 'Chili', 'Pizza', 'Leftover Pizza', 'Takeout',
    'Sandwich', 'Salad', 'Pasta Salad', 'Potato Salad', 'Sushi', 'Kimbap', 'Burrito', 'Tacos',
    'Lasagna', 'Casserole', 'Mac and Cheese', 'Fried Chicken', 'Roast Chicken', 'Stir Fry',
    'Meal Prep', 'Bibimbap', 'Tteokbokki', 'Kimchi Stew', 'Soybean Paste Stew', 'Bone Broth',
    'Broth', 'Stock', 'Dip', 'Spring Rolls', 'Quiche', 'Frittata',
  ],
  drinks: [
    'Orange Juice', 'Apple Juice', 'Juice', 'Smoothie', 'Iced Tea', 'Cold Brew', 'Kombucha',
    'Coconut Water', 'Lemonade', 'Sparkling Water', 'Soda', 'Beer', 'White Wine', 'Wine',
    'Sake', 'Soju', 'Makgeolli',
  ],
  desserts: [
    'Cake', 'Cheesecake', 'Pie', 'Cookie Dough', 'Brownies', 'Chocolate', 'Ice Cream', 'Mochi',
    'Jelly', 'Custard', 'Tiramisu', 'Whipped Cream', 'Pastries', 'Donuts',
  ],
  other: [
    'Baby Food', 'Pet Food', 'Yeast', 'Nuts', 'Dried Fruit', 'Olives', 'Capers',
    'Sun-Dried Tomatoes', 'Roasted Peppers', 'Canned Beans (Opened)', 'Coconut Milk',
    'Tomato Paste', 'Fresh Juice', 'Pie Crust', 'Puff Pastry',
  ],
};

// Shown in the "Common" section of the Add screen.
export const COMMON_FOODS = [
  'Milk', 'Eggs', 'Chicken', 'Beef', 'Pork', 'Salmon', 'Spinach', 'Lettuce', 'Onion', 'Potato',
  'Tomatoes', 'Apple', 'Banana', 'Strawberries', 'Yogurt', 'Cheese', 'Butter', 'Tofu', 'Kimchi',
  'Cooked Rice', 'Bread', 'Leftovers', 'Mushrooms', 'Carrots',
];
