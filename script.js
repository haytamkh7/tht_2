document.addEventListener("DOMContentLoaded", function () {
// FAQ Toggle Functionality
const faqItems = document.querySelectorAll('.faq-wrapper .text-container ul li');
faqItems.forEach((item) => {
  item.addEventListener('click', function() {
    const answer = this.querySelector('p');
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});

// Navigation Smooth Scroll
document.getElementById('about-nav').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('about').scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById('menu-nav').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('order-container').scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById('contact-nav').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('contact').scrollIntoView({
    behavior: "smooth"
  });
});
  const DEFAULT_TOTAL = 25;
  const SHIPPING_COST = 50;
  const priceData = {
  "בורגר שייטל": {"100": 48, "150": 55, "200": 62, "250": 69, "300": 76},
  "סטייק שייטל": {"100": 48, "150": 55, "200": 62, "250": 69, "300": 76},
  "סטייק הודו": {"100": 40, "150": 46, "200": 52, "250": 58, "300": 64},
  "בורגר עוף": {"100": 40, "150": 46, "200": 52, "250": 58, "300": 64},
  "שווארמה עוף": {"100": 40, "150": 46, "200": 52, "250": 58, "300": 64},
  "חזה עוף": {"100": 40, "150": 46, "200": 52, "250": 58, "300": 64},
  "אמנון": {"100": 39, "150": 44, "200": 49, "250": 54, "300": 59},
  "סלמון": {"100": 49, "150": 57, "200": 65, "250": 73, "300": 81},
};


  const typeToSubtypes = {
    'חלבונים': ["בורגר שייטל", "סטייק שייטל", "סטייק הודו", "בורגר עוף", "שווארמה עוף", "חזה עוף", "אמנון", "סלמון"],
    'פחמניות': ["אורז", "תפוח אדמה", "בטטה", "פסטה", "בורגול", "קינואה"],
    'ירקות': ["ברוקולי", "שעועית", "אפונה"]
  };

  function populateSubtypeOptions(selectedType, subtypeSelector) {
    subtypeSelector.innerHTML = '<option selected="selected" value="">בחר מנה</option>';
    if (typeToSubtypes[selectedType]) {
      typeToSubtypes[selectedType].forEach((subtype) => {
        const option = document.createElement('option');
        option.value = subtype;
        option.text = subtype;
        subtypeSelector.add(option);
      });
    }
  }

  function updateTotalPrice() {
    let totalPrice = 0;
    let hasProtein = false;
    let anyOptionSelected = false;

    const quantityInput = document.querySelector('.order-quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    document.querySelectorAll('.order-line').forEach((orderLine) => {
      const type = orderLine.querySelector('.type-selector').value;
      const subtype = orderLine.querySelector('.subtype-selector').value;
      const grams = orderLine.querySelector('.grams').value;

      if (type && subtype && grams) {
        anyOptionSelected = true;
      }

      if (type === 'חלבונים' && subtype && grams && priceData[subtype]) {
        hasProtein = true;
        totalPrice += priceData[subtype][grams] * quantity;
      }
    });

    if (!anyOptionSelected) {
      totalPrice = 0;
    } else if (!hasProtein) {
      const selectedType = document.querySelector('.type-selector').value;
      if (selectedType !== 'חלבונים') {
        totalPrice = DEFAULT_TOTAL * quantity;
      }
    }

    document.getElementById('total-order').textContent = `${totalPrice} ₪`;
  }

  function initializeOrderLine(orderLine) {
    const typeSelector = orderLine.querySelector('.type-selector');
    const subtypeSelector = orderLine.querySelector('.subtype-selector');

    typeSelector.addEventListener('change', function () {
      const selectedType = this.value;
      populateSubtypeOptions(selectedType, subtypeSelector);
    });

    document.querySelectorAll('.type-selector, .subtype-selector, .grams, .order-quantity').forEach((element) => {
      element.addEventListener('change', updateTotalPrice);
    });

    typeSelector.dispatchEvent(new Event('change'));
  }

  document.querySelectorAll('.order-line').forEach(line => initializeOrderLine(line));
  updateTotalPrice();

//CART
const cart = new Map();
const cartIcon = document.getElementById('cart-icon');
const secondaryCartIcon = document.getElementById('secondary-cart-icon');
secondaryCartIcon.addEventListener('click', showCart);
const cartCounter = document.getElementById('cart-counter');
const cartModal = document.createElement('div');
cartModal.className = "cart-modal";
document.body.appendChild(cartModal);

function updateCartCounter() {
    let totalCount = 0;
    for (const quantity of cart.values()) {
        totalCount += quantity;
    }
    cartCounter.textContent = totalCount;
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = totalCount;
}


function updateTotal() {
  let totalPrice = 0;
  let hasProtein = false;
  let anyOptionSelected = false;

  document.querySelectorAll('.order-line').forEach((orderLine) => {
    const type = orderLine.querySelector('.type-selector').value;
    const subtype = orderLine.querySelector('.subtype-selector').value;
    const grams = orderLine.querySelector('.grams').value;

    if (type && subtype && grams) {
      anyOptionSelected = true;
    }

    if (type === 'חלבונים' && subtype && grams && priceData[subtype]) {
      hasProtein = true;
      totalPrice += priceData[subtype][grams];
    }
  });

  if (!anyOptionSelected) {
    totalPrice = 0;
  } else if (!hasProtein) {
    const selectedType = document.querySelector('.type-selector').value;
    if (selectedType !== 'חלבונים') {
      totalPrice = DEFAULT_TOTAL;
    }
  }

  document.getElementById('total-order').innerText = totalPrice.toFixed(0) + " ₪";
}

function addToCart() {
    let meal = [];
    const mealContainer = document.querySelector('.meal');
    const mealQuantity = parseInt(document.getElementById('order-quantity').value) || 1;

    mealContainer.querySelectorAll('.order-line').forEach(line => {
        const type = line.querySelector('.type-selector').value;
        const subtype = line.querySelector('.subtype-selector').value;
        const grams = line.querySelector('.grams').value;
        if (type && subtype && grams) {
            meal.push({ type, subtype, grams });
        }
    });

    if (meal.length > 0) {
        const mealString = JSON.stringify(meal);
        const existingQuantity = cart.get(mealString) || 0;
        cart.set(mealString, existingQuantity + mealQuantity);
        updateCartCounter();
    }

    // Clear the form
    document.querySelectorAll('.order-line').forEach(line => {
        line.querySelector('.type-selector').value = '';
        const subtypeSelector = line.querySelector('.subtype-selector');
        subtypeSelector.innerHTML = '';
        let defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.textContent = "בחר מנה";
        subtypeSelector.appendChild(defaultOpt);
        line.querySelector('.grams').value = '100';
    });

    document.getElementById('total-order').innerText = '0';
    document.getElementById('order-quantity').value = '1';
    updateTotal();
    if (meal.length > 0) {
        const cartMessage = document.getElementById('cart-message');
        cartMessage.innerText = "מנות נוספו לסל בהצלחה";
        cartMessage.style.display = 'block';
        cartMessage.style.color = '#27ae60';
        cartMessage.style.fontSize = '1rem';
        cartMessage.style.fontWeight = 'bold';
        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 4000);
    }
}
// New showcart
function showCart() {
    cartModal.innerHTML = `
  <div class="cart-modal-header" style="display: flex; justify-content: center; align-items: center;">
    <h3 class="cart-modal-title">העגלה</h3>
    <button class="close-btn">×</button>
  </div>
  <div class="cart-modal-content"></div>
  <div class="cart-total">
    <p>סה"כ לתשלום: <span id="cart-total-price">0.00</span>₪</p>
    <p style="color: #FF4136;">כולל דמי משלוח</p>
    <button id="send-cart-to-whatsapp">
    <i class="fab fa-whatsapp"></i> שלח הזמנה לחנות
  </button>
  </div>
  `;
  
    const cartContent = cartModal.querySelector('.cart-modal-content');
    let cartTotalPrice = 0;
  
    const calculateLineTotal = (item) => {
      return priceData[item.subtype] && priceData[item.subtype][item.grams] ?
          priceData[item.subtype][item.grams] :
          0;
    };
  
    cart.forEach((quantity, mealString) => {
      let meal = JSON.parse(mealString);
      let mealDiv = document.createElement('div');
      mealDiv.className = 'cart-modal-item';
      mealDiv.dataset.mealString = mealString;
      
      let mealInfo = `<h3>מנה (X${quantity})</h3>`;
      mealInfo += '<button class="delete-item modern-btn">מחק מנה</button>';
      
      let tableContent = `<table><thead><tr><th>שם המנה</th><th>גרם</th></tr></thead><tbody>`;
      let mealTotalPrice = 0;
      let hasProtein = false;
  
      meal.forEach(item => {
        const lineTotal = calculateLineTotal(item);
        if (typeToSubtypes['חלבונים'].includes(item.subtype)) {
          hasProtein = true;
        }
        mealTotalPrice += lineTotal;
        tableContent += `<tr><td>${item.subtype}</td><td>${item.grams}g</td></tr>`;
      });
  
      if (!hasProtein) {
        mealTotalPrice = 25;
      }
  
      tableContent += `</tbody></table>`;
      mealTotalPrice *= quantity;
      mealInfo += tableContent + `<p>סה"כ למנה: ${Math.ceil(mealTotalPrice)}₪</p>`;
      mealDiv.innerHTML = mealInfo;
      cartContent.appendChild(mealDiv);
  
      cartTotalPrice += mealTotalPrice;
    });
  
    cartTotalPrice += SHIPPING_COST;
  
    document.getElementById('cart-total-price').innerText = Math.ceil(cartTotalPrice);
  
    document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const mealString = e.target.closest('.cart-modal-item').dataset.mealString;
      cart.delete(mealString);
      showCart();
      updateCartCounter();  // Update the cart counter
    });
  });
  
  
    cartModal.style.display = 'block';
  }
  
// END new showcart
  

  function hideCart() {
    cartModal.style.display = 'none';
}

document.getElementById('add-to-cart').addEventListener('click', addToCart);
cartIcon.addEventListener('click', showCart);
document.addEventListener('click', function(event) {
    if (event.target.matches('.close-btn')) {
        hideCart();
    }
});
function resetMeal() {
    document.querySelectorAll('.order-line').forEach(line => {
        line.querySelector('.type-selector').value = '';
        const subtypeSelector = line.querySelector('.subtype-selector');
        subtypeSelector.innerHTML = '';
        const defaultOpt = new Option('בחר מנה', '', true);
        subtypeSelector.appendChild(defaultOpt);
        line.querySelector('.grams').value = '100';
    });

    document.getElementById('total-order').innerText = '0';
    document.getElementById('order-quantity').value = '1';
}

document.getElementById('new-meal').addEventListener('click', resetMeal);


//TILL HERE EVERYTHING IS GOOD

// Create user information modal
const userModal = document.createElement('div');
userModal.id = 'userModal';
userModal.style.display = 'none';

userModal.innerHTML = `
<div class="user-modal-content">
    <label>שם<input type="text" id="user-name" required></label><br>
    <label>טלפון<input type="text" id="user-phone" required></label><br>
    <label>כתובת מלאה<input type="text" id="user-address" required></label><br>
    <label>דרישות מיוחדות<textarea id="user-requests"></textarea></label><br>
    <button id="submit-user-info">שלח</button>
    <button id="close-user-modal">סגור</button>
</div>
`;
document.body.appendChild(userModal);

function showUserModal() {
    userModal.style.display = 'block';
}

function hideUserModal() {
    userModal.style.display = 'none';
}
// Close the User Modal
document.getElementById('close-user-modal').addEventListener('click', hideUserModal);

document.addEventListener('click', function(event) {
  if (event.target.matches('#send-cart-to-whatsapp')) {
    showUserModal();
  }
  if (event.target.matches('#close-user-modal')) {
    hideUserModal();
  }
});

  function generateWhatsAppMessage(userName, userPhone, userAddress, userRequests) {
    // Mapping for food subtype to emojis
    const foodEmojis = {
      'בורגר שייטל': "🍔",
      'סטייק שייטל': "🥩",
      'סטייק הודו': "🍗",
      'בורגר עוף': "🍔",
      'שווארמה עוף': "🌯",
      'חזה עוף': "🍗",
      'אמנון': "🐟",
      'סלמון': "🐟",
      'טונה': "🐟",
      'אורז': "🍚",
      'תפוח אדמה': "🥔",
      'בטטה': "🍠",
      'פסטה': "🍝",
      'בורגול': "🍚",
      'קינואה': "🍚",
      'ברוקולי': "🥦",
      'שעועית': "🌱",
      'אפונה': "🌽"
  };
  

    let userInfo = `\u200B
\u200B📌 שם: ${userName}
\u200B📞 טלפון: ${userPhone}
\u200B🏠 כתובת: ${userAddress}
\u200B💬 בקשות מיוחדות: ${userRequests || 'אין'}
`;
  
    let message = userInfo + "\n\n==========\n🍽 ההזמנה שלך:\n==========\n";
    let cartModalItems = Array.from(document.querySelectorAll('.cart-modal-item p'));
  
    let index = 0;
    cart.forEach((quantity, mealString) => {
        let meal = JSON.parse(mealString);
        message += `🍛 מנה (x${quantity}):\n`;
        meal.forEach(item => {
            const emoji = foodEmojis[item.subtype] || "";
            message += `   ${emoji} - ${item.subtype}, ${item.grams}g\n`;
        });
        let mealTotalPrice = cartModalItems[index] ? cartModalItems[index].innerText.split(': ')[1] : '25';
        message += `💵 סה"כ למנה: ${mealTotalPrice}\n\n`;
        index++;
    });

    message += "==========\n";
  
    message += `🚚 עלות משלוח: 50₪\n`;
    message += `💰 סך הכול: ${document.getElementById('cart-total-price').innerText}₪\n`;
    message += "\n==========\n🎉 נעים שבחרתם בנו! תודה ובתיאבון!";
    
    return encodeURIComponent(message);
}
	
// Add click event listener to show user info modal
const sendCartButton = document.getElementById('send-cart-to-whatsapp');
if (sendCartButton) {
    sendCartButton.addEventListener('click', showUserModal);
}

// Add click event listener to submit user info
document.getElementById('submit-user-info').addEventListener('click', () => {
    const userName = document.getElementById('user-name').value;
    const userPhone = document.getElementById('user-phone').value;
    const userAddress = document.getElementById('user-address').value;
    const userRequests = document.getElementById('user-requests').value;

    if (!userName || !userPhone || !userAddress) {
        alert("Please fill in all the fields");
        return;
    }

    const message = generateWhatsAppMessage(userName, userPhone, userAddress, userRequests);
    const phoneNumber = "+972585555016";  // Replace with the store's phone number
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');

    hideUserModal();
});

//END WhatsApp Section






































    // Slideshow
	let index = 0;
    let intervalId;
    
    const images = document.querySelectorAll(".image");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    
    function displayImages() {
      // Hide all images
      images.forEach(image => {
        image.style.opacity = '0';
      });
      
      // Show the current image
      images[index].style.opacity = '1';
    }
    
    function nextImage() {
      index = (index + 1) % images.length;
      displayImages();
    }
    
    function prevImage() {
      index = (index - 1 + images.length) % images.length;
      displayImages();
    }
    
    // Add prev and next button functionality
    prevButton.addEventListener("click", () => {
      clearInterval(intervalId);  // Stop auto-changing when user intervenes
      prevImage();
      intervalId = setInterval(nextImage, 3000);  // Restart auto-changing
    });
    
    nextButton.addEventListener("click", () => {
      clearInterval(intervalId);  // Stop auto-changing when user intervenes
      nextImage();
      intervalId = setInterval(nextImage, 3000);  // Restart auto-changing
    });
    
    // Initialize
    displayImages();
    intervalId = setInterval(nextImage, 2500);  // Auto-change every 3 seconds
    
        // End slideshow
  

});
