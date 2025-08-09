// Real-world marketplace categories for items commonly sold online

export const MARKETPLACE_CATEGORIES = [
    // ELECTRONICS & TECHNOLOGY
    {
      label: "Electronics",
      value: 1,
      backgroundColor: '#2196F3',
      Icon: 'cellphone',
      description: 'Phones, tablets, computers, accessories'
    },
    {
      label: "Computers",
      value: 2,
      backgroundColor: '#607D8B',
      Icon: 'laptop',
      description: 'Laptops, desktops, gaming PCs, components'
    },
    {
      label: "Gaming",
      value: 3,
      backgroundColor: '#9C27B0',
      Icon: 'gamepad-variant',
      description: 'Consoles, games, gaming accessories'
    },
    {
      label: "Audio & Video",
      value: 4,
      backgroundColor: '#FF5722',
      Icon: 'headphones',
      description: 'Headphones, speakers, cameras, TVs'
    },
  
    // VEHICLES & TRANSPORTATION
    {
      label: "Cars",
      value: 5,
      backgroundColor: '#F44336',
      Icon: 'car',
      description: 'Used cars, car parts, automotive accessories'
    },
    {
      label: "Motorcycles",
      value: 6,
      backgroundColor: '#795548',
      Icon: 'motorbike',
      description: 'Motorcycles, scooters, bike parts'
    },
    {
      label: "Bicycles",
      value: 7,
      backgroundColor: '#4CAF50',
      Icon: 'bike',
      description: 'Bikes, cycling gear, accessories'
    },
  
    // HOME & LIVING
    {
      label: "Furniture",
      value: 8,
      backgroundColor: '#8BC34A',
      Icon: 'sofa',
      description: 'Sofas, tables, chairs, home furniture'
    },
    {
      label: "Home Appliances",
      value: 9,
      backgroundColor: '#00BCD4',
      Icon: 'washing-machine',
      description: 'Kitchen appliances, washing machines, fridges'
    },
    {
      label: "Home Decor",
      value: 10,
      backgroundColor: '#FFEB3B',
      Icon: 'lamp',
      description: 'Decorations, lighting, artwork, plants'
    },
    {
      label: "Garden & Outdoor",
      value: 11,
      backgroundColor: '#4CAF50',
      Icon: 'flower',
      description: 'Garden tools, outdoor furniture, plants'
    },
  
    // FASHION & BEAUTY
    {
      label: "Clothing",
      value: 12,
      backgroundColor: '#E91E63',
      Icon: 'tshirt-crew',
      description: 'Men\'s, women\'s, kids\' clothing'
    },
    {
      label: "Shoes",
      value: 13,
      backgroundColor: '#795548',
      Icon: 'shoe-formal',
      description: 'Sneakers, boots, formal shoes, sandals'
    },
    {
      label: "Bags & Accessories",
      value: 14,
      backgroundColor: '#9C27B0',
      Icon: 'bag-personal',
      description: 'Handbags, wallets, jewelry, watches'
    },
    {
      label: "Beauty & Health",
      value: 15,
      backgroundColor: '#FF9800',
      Icon: 'face-woman',
      description: 'Cosmetics, skincare, health products'
    },
  
    // SPORTS & HOBBIES
    {
      label: "Sports Equipment",
      value: 16,
      backgroundColor: '#FF5722',
      Icon: 'basketball',
      description: 'Gym equipment, sports gear, fitness'
    },
    {
      label: "Books",
      value: 17,
      backgroundColor: '#3F51B5',
      Icon: 'book-open-variant',
      description: 'Textbooks, novels, educational books'
    },
    {
      label: "Music & Instruments",
      value: 18,
      backgroundColor: '#673AB7',
      Icon: 'guitar-acoustic',
      description: 'Musical instruments, sheet music, audio gear'
    },
    {
      label: "Art & Crafts",
      value: 19,
      backgroundColor: '#E91E63',
      Icon: 'palette',
      description: 'Art supplies, handmade items, crafts'
    },
  
    // BABY & KIDS
    {
      label: "Baby & Kids",
      value: 20,
      backgroundColor: '#FFEB3B',
      Icon: 'baby-carriage',
      description: 'Baby gear, toys, kids\' clothing, strollers'
    },
    {
      label: "Toys & Games",
      value: 21,
      backgroundColor: '#FF9800',
      Icon: 'toy-brick',
      description: 'Board games, toys, puzzles, collectibles'
    },
  
    // PROFESSIONAL & EDUCATION
    {
      label: "Office Supplies",
      value: 22,
      backgroundColor: '#607D8B',
      Icon: 'briefcase',
      description: 'Office furniture, supplies, equipment'
    },
    {
      label: "Tools & Equipment",
      value: 23,
      backgroundColor: '#795548',
      Icon: 'hammer',
      description: 'Power tools, hand tools, workshop equipment'
    },
    {
      label: "Industrial",
      value: 24,
      backgroundColor: '#424242',
      Icon: 'factory',
      description: 'Heavy machinery, industrial equipment'
    },
  
    // SERVICES (if you want to allow service listings)
    {
      label: "Services",
      value: 25,
      backgroundColor: '#00BCD4',
      Icon: 'account-group',
      description: 'Tutoring, cleaning, repair services'
    },
  
    // PETS & ANIMALS
    {
      label: "Pets & Animals",
      value: 26,
      backgroundColor: '#4CAF50',
      Icon: 'dog',
      description: 'Pet supplies, pet food, accessories'
    },
  
    // FOOD & BEVERAGES (if applicable)
    {
      label: "Food & Drinks",
      value: 27,
      backgroundColor: '#FF5722',
      Icon: 'food-apple',
      description: 'Specialty foods, beverages, kitchen items'
    },
  
    // COLLECTIBLES & ANTIQUES
    {
      label: "Collectibles",
      value: 28,
      backgroundColor: '#9C27B0',
      Icon: 'star',
      description: 'Antiques, vintage items, collectibles'
    },
  
    // REAL ESTATE (if applicable)
    {
      label: "Real Estate",
      value: 29,
      backgroundColor: '#795548',
      Icon: 'home',
      description: 'Properties, land, real estate listings'
    },
  
    // MISCELLANEOUS
    {
      label: "Other",
      value: 30,
      backgroundColor: '#9E9E9E',
      Icon: 'dots-horizontal',
      description: 'Items that don\'t fit other categories'
    }
  ];
  
  // HELPER FUNCTIONS for working with categories
  
  /**
   * Get category by value
   * @param {number} value - Category value
   * @returns {Object|null} - Category object or null if not found
   */
  export const getCategoryByValue = (value) => {
    return MARKETPLACE_CATEGORIES.find(category => category.value === value) || null;
  };
  
  /**
   * Get category by label
   * @param {string} label - Category label
   * @returns {Object|null} - Category object or null if not found
   */
  export const getCategoryByLabel = (label) => {
    return MARKETPLACE_CATEGORIES.find(
      category => category.label.toLowerCase() === label.toLowerCase()
    ) || null;
  };
  
  /**
   * Get popular categories (first 8 most commonly used)
   * @returns {Array} - Array of popular category objects
   */
  export const getPopularCategories = () => {
    return MARKETPLACE_CATEGORIES.slice(0, 8);
  };
  
  /**
   * Search categories by name
   * @param {string} searchTerm - Search term
   * @returns {Array} - Array of matching categories
   */
  export const searchCategories = (searchTerm) => {
    if (!searchTerm.trim()) return MARKETPLACE_CATEGORIES;
    
    const term = searchTerm.toLowerCase();
    return MARKETPLACE_CATEGORIES.filter(category =>
      category.label.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term)
    );
  };
  
  /**
   * Get categories grouped by main types
   * @returns {Object} - Categories grouped by type
   */
  export const getCategoriesGrouped = () => {
    return {
      'Electronics & Technology': MARKETPLACE_CATEGORIES.slice(0, 4),
      'Vehicles & Transportation': MARKETPLACE_CATEGORIES.slice(4, 7),
      'Home & Living': MARKETPLACE_CATEGORIES.slice(7, 11),
      'Fashion & Beauty': MARKETPLACE_CATEGORIES.slice(11, 15),
      'Sports & Hobbies': MARKETPLACE_CATEGORIES.slice(15, 19),
      'Baby & Kids': MARKETPLACE_CATEGORIES.slice(19, 21),
      'Professional': MARKETPLACE_CATEGORIES.slice(21, 24),
      'Other': MARKETPLACE_CATEGORIES.slice(24)
    };
  };
  
  // Export default categories for easy import
  export default MARKETPLACE_CATEGORIES;