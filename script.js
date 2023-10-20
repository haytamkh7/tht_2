document.addEventListener("DOMContentLoaded", function() {
	const MAX_PROTEIN_GRAMS = 150;
	const DEFAULT_TOTAL = 25;
	const SHIPPING_COST = 50;
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

	// Pricing and Options Data
	const PRICES = {
		"בורגר עוף": 46 / 150,
		"שווארמה עוף": 46 / 150,
		"חזה עוף": 46 / 150,
		"בורגר שייטל": 55 / 150,
		"סטייק שייטל": 55 / 150,
		"סטייק הודו": 46 / 150,
		"סלמון": 57 / 150,
		"טונה": 60 / 150,
		"אמנון": 44 / 150
	};

	const EXTRA_PRICES = {
		"בורגר שייטל": 7,
		"סטייק שייטל": 7,
		"בורגר עוף": 6,
		"שווארמה עוף": 6,
		"חזה עוף": 6,
		"אמנון": 5,
		"סלמון": 8,
		"טונה": 10,
		"סטייק הודו": 6
	};


	const OPTIONS = {
		"חלבונים": ["בורגר שייטל", "סטייק שייטל", "סטייק הודו", "בורגר עוף", "שווארמה עוף", "חזה עוף", "אמנון", "סלמון", "טונה"],
		"פחמניות": ["אורז", "תפוח אדמה", "בטטה", "פסטה", "בורגול", "קינואה"],
		"ירקות": ["ברוקולי", "שעועית", "אפונה"]
	};


	function initializeOrderLine(orderLine) {
		const typeSelector = orderLine.querySelector('.type-selector');
		const subtypeSelector = orderLine.querySelector('.subtype-selector');
		const gramsInput = orderLine.querySelector('.grams');
		const lineTotalSpan = orderLine.querySelector('.line-total');

		typeSelector.addEventListener('change', function() {
			subtypeSelector.innerHTML = '';

			let defaultOpt = document.createElement('option');
			defaultOpt.value = "";
			defaultOpt.textContent = "בחר מנה";
			subtypeSelector.appendChild(defaultOpt);

			if (this.value !== "") {
				OPTIONS[this.value].forEach(option => {
					let opt = document.createElement('option');
					opt.value = option;
					opt.textContent = option;
					subtypeSelector.appendChild(opt);
				});
			}

			subtypeSelector.value = "";
		});

		typeSelector.dispatchEvent(new Event('change'));

		const calculateLineTotal = () => {
			const subtypePrice = PRICES[subtypeSelector.value] || 0;
			const grams = parseFloat(gramsInput.value);
			let price = 0;

			if (typeSelector.value === "חלבונים") {
				if (grams <= MAX_PROTEIN_GRAMS) {
					price = subtypePrice * grams;
				} else {
					price = (subtypePrice * 150) + (((grams - 150) / 50) * EXTRA_PRICES[subtypeSelector.value]);
				}
			} else {
				price = subtypePrice * grams;
			}

			return Math.ceil(price);
		};

		function updateTotal() {
			let total = 0;
			let proteinSelected = false;
			let anyItemSelected = false;  // New variable to track if any item is selected
		
			document.querySelectorAll('.order-line').forEach(line => {
				const lineTotal = parseFloat(line.querySelector('.line-total').innerText) || 0;
				total += lineTotal;
		
				const typeSelector = line.querySelector('.type-selector');
				const subtypeSelector = line.querySelector('.subtype-selector');
				if (typeSelector && typeSelector.value === "חלבונים") {
					proteinSelected = true;
				}
				
				// Check if any item is selected in this line
				if (typeSelector && typeSelector.value !== "" && subtypeSelector && subtypeSelector.value !== "") {
					anyItemSelected = true;
				}
			});
		
			if (anyItemSelected) {
				total = proteinSelected ? total : DEFAULT_TOTAL;
			} else {
				total = 0;  // If nothing is selected, total should be zero
			}
			const totalPriceForMeal = total;
		
			document.getElementById('total-order').innerText = totalPriceForMeal.toFixed(0);
		}
		

		document.getElementById('order-quantity').addEventListener('change', updateTotal);

		orderLine.addEventListener('change', function() {
			const lineTotal = calculateLineTotal();
			lineTotalSpan.innerText = lineTotal.toFixed(2);
			updateTotal();
		});
	}

	document.querySelectorAll('.order-line').forEach(line => initializeOrderLine(line));

	const cart = [];
	const cartIcon = document.getElementById('cart-icon');
	const secondaryCartIcon = document.getElementById('secondary-cart-icon');
	secondaryCartIcon.addEventListener('click', showCart);
	const cartCounter = document.getElementById('cart-counter');
	const cartModal = document.createElement('div');

	cartModal.className = "cart-modal";
	document.body.appendChild(cartModal);

	function updateCartCounter() {
		cartCounter.textContent = cart.length;
		const cartCountElement = document.getElementById('cart-count');
		cartCountElement.textContent = cart.length;
	}

    function updateTotal() {
		let total = 0;
		let proteinSelected = false;
		let anyItemSelected = false;  // New variable to track if any item is selected
	
		document.querySelectorAll('.order-line').forEach(line => {
			const lineTotal = parseFloat(line.querySelector('.line-total').innerText) || 0;
			total += lineTotal;
	
			const typeSelector = line.querySelector('.type-selector');
			const subtypeSelector = line.querySelector('.subtype-selector');
			if (typeSelector && typeSelector.value === "חלבונים") {
				proteinSelected = true;
			}
			
			// Check if any item is selected in this line
			if (typeSelector && typeSelector.value !== "" && subtypeSelector && subtypeSelector.value !== "") {
				anyItemSelected = true;
			}
		});
	
		if (anyItemSelected) {
			total = proteinSelected ? total : DEFAULT_TOTAL;
		} else {
			total = 0;  // If nothing is selected, total should be zero
		}
		const totalPriceForMeal = total;
	
		document.getElementById('total-order').innerText = totalPriceForMeal.toFixed(0);
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
				meal.push({
					type,
					subtype,
					grams
				});
			}
		});

		if (meal.length > 0) {
			for (let i = 0; i < mealQuantity; i++) {
				cart.push(meal);
			}
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

		cart.forEach((meal, idx) => {
            let mealDiv = document.createElement('div');
            mealDiv.className = 'cart-modal-item';
        
            let mealInfo = `<h3>מנה ${idx + 1}</h3>`;
            let tableContent = `<table>
                                    <thead>
                                        <tr>
                                            <th>שם המנה</th>
                                            <th>גרם</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
            meal.forEach(item => {
                tableContent += `<tr>
                                    <td>${item.subtype}</td>
                                    <td>${item.grams}g</td>
                                 </tr>`;
            });
            tableContent += `</tbody></table>`;
            mealInfo += tableContent;
        
            let mealTotalPrice = meal.reduce((total, item) => {
                const pricePerGram = PRICES[item.subtype] || 0;
                const grams = item.grams;
                const extraPricePerGram = EXTRA_PRICES[item.subtype] || 0;
                let lineTotal;
        
                if (grams <= 150) {
                    lineTotal = pricePerGram * grams;
                } else {
                    lineTotal = (pricePerGram * 150) + (((grams - 150) / 50) * extraPricePerGram);
                }
        
                return total + lineTotal;
            }, 0);
        
            mealTotalPrice = mealTotalPrice === 0 ? DEFAULT_TOTAL : Math.ceil(mealTotalPrice);
            mealInfo += `<p>סה"כ למנה: ${mealTotalPrice}₪</p>`;
        
            mealDiv.innerHTML = mealInfo;
            cartContent.appendChild(mealDiv);
        });
        

        // Helper function to calculate line total for each item
        const calculateLineTotal = (item) => {
            const pricePerGram = PRICES[item.subtype] || 0;
            const grams = item.grams;
            const extraPricePerGram = EXTRA_PRICES[item.subtype] || 0;

            return grams <= 150 
                ? pricePerGram * grams 
                : (pricePerGram * 150) + (((grams - 150) / 50) * extraPricePerGram);
        };

        let cartTotalPrice = cart.reduce((total, meal) => {
            let mealTotalPrice = meal.reduce((mealTotal, item) => {
                return mealTotal + calculateLineTotal(item);
            }, 0);

            return total + (mealTotalPrice || DEFAULT_TOTAL);
        }, 0);


		cartTotalPrice += SHIPPING_COST;

		document.getElementById('cart-total-price').innerText = Math.ceil(cartTotalPrice);

		cartModal.style.display = 'block';
	}


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
			let defaultOpt = document.createElement('option');
			defaultOpt.value = "";
			defaultOpt.textContent = "בחר מנה";
			subtypeSelector.appendChild(defaultOpt);
			line.querySelector('.grams').value = '100';
		});
	
		document.getElementById('total-order').innerText = '0';
		document.getElementById('order-quantity').value = '1';
	}

	document.getElementById('new-meal').addEventListener('click', resetMeal);

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

	// Trigger the user info modal when "send cart to whatsapp" is clicked
	const sendCartButton = document.getElementById('send-cart-to-whatsapp');
	if (sendCartButton) {
		sendCartButton.addEventListener('click', showUserModal);
	}



	function sendCartToWhatsApp(userName, userPhone, userAddress, userRequests) {
		const whatsappNumber = "+972585555016";

		let userInfo = `
            שם: ${userName}
            טלפון: ${userPhone}
            כתובת: ${userAddress}
            דרישות מיוחדות: ${userRequests || 'אין'}
        `;

		let cartText = userInfo + "\n\n";
		let totalCartPrice = 0;

		cart.forEach((meal, idx) => {
			let mealTotal = 0;
			cartText += `מנה ${idx + 1}:\n`;

			meal.forEach(item => {
            const pricePerGram = PRICES[item.subtype] || 0;
            const grams = item.grams;
            const extraPricePerGram = EXTRA_PRICES[item.subtype] || 0;
            let price = 0;
            if(grams <= 150) {
                price = pricePerGram * grams;
            } else {
                price = pricePerGram * grams + ((grams - 150) / 50) * extraPricePerGram;
            }
            mealTotal += price;
				cartText += `${item.subtype}, ${item.grams}g\n`;
			});

			mealTotal = mealTotal === 0 ? 25 : mealTotal;
            cartText += `סה"כ למנה ${idx + 1}: ${parseInt(mealTotal)}₪\n\n`;

			totalCartPrice += mealTotal;
		});

		totalCartPrice = Math.ceil(totalCartPrice + 50);
        cartText += `משלוח: 50₪\nסה"כ לתשלום: ${totalCartPrice}₪`;


		const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(cartText)}`;
		window.open(whatsappURL, '_blank');
	}



	// Send user info to WhatsApp
	document.getElementById('submit-user-info').addEventListener('click', () => {
		const userName = document.getElementById('user-name').value;
		const userPhone = document.getElementById('user-phone').value;
		const userAddress = document.getElementById('user-address').value;
		const userRequests = document.getElementById('user-requests').value;

		if (!userName || !userPhone || !userAddress) {
			alert("אנא מלא את כל השדות");
			return;
		}

		const cartText = sendCartToWhatsApp(userName, userPhone, userAddress, userRequests);
		hideUserModal();
	});




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