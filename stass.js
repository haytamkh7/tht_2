document.addEventListener("DOMContentLoaded", function () {
  const priceData = {
    "בורגר שייטל": {"100": 37, "150": 55, "200": 62, "250": 69, "300": 76},
    "סטייק שייטל": {"100": 37, "150": 55, "200": 62, "250": 69, "300": 76},
    "סטייק הודו": {"100": 31, "150": 46, "200": 52, "250": 58, "300": 64},
    "בורגר עוף": {"100": 31, "150": 46, "200": 52, "250": 58, "300": 64},
    "שווארמה עוף": {"100": 31, "150": 46, "200": 52, "250": 58, "300": 64},
    "חזה עוף": {"100": 31, "150": 46, "200": 52, "250": 58, "300": 64},
    "אמנון": {"100": 30, "150": 44, "200": 49, "250": 54, "300": 59},
    "סלמון": {"100": 38, "150": 57, "200": 65, "250": 73, "300": 81},
    "טונה": {"100": 40, "150": 60, "200": 70, "250": 80, "300": 90},
  };

  const typeToSubtypes = {
    'חלבונים': ["בורגר שייטל", "סטייק שייטל", "סטייק הודו", "בורגר עוף", "שווארמה עוף", "חזה עוף", "אמנון", "סלמון", "טונה"],
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
        totalPrice = 25 * quantity;
      }
    }

    document.getElementById('total-order').textContent = ` ${totalPrice} ₪`;
  }

  // Event listeners
  document.querySelectorAll('.type-selector').forEach((dropdown) => {
    dropdown.addEventListener('change', function () {
      const selectedType = this.value;
      const subtypeSelector = this.closest('.order-line').querySelector('.subtype-selector');
      const gramsSelector = this.closest('.order-line').querySelector('.grams');

      gramsSelector.value = "100";
      populateSubtypeOptions(selectedType, subtypeSelector);
    });
  });

  document.querySelectorAll('.type-selector, .subtype-selector, .grams, .order-quantity').forEach((dropdown) => {
    dropdown.addEventListener('change', updateTotalPrice);
  });
  updateTotalPrice();












// Event listener for the "Add to Cart" button
const addToCartButton = document.querySelector('.add-to-cart');
addToCartButton.addEventListener('click', function () {
  // Initialize an array to store the details of each meal
  const mealDetails = [];
  let mealPrice = 0; // Initialize the meal price

  // Select all order-line elements
  const orderLines = document.querySelectorAll('.order-line');

  // Iterate through order-line elements in groups of 3
  for (let i = 0; i < orderLines.length; i += 3) {
    const typeSelectors = orderLines[i].querySelectorAll('.type-selector');
    const subtypeSelectors = orderLines[i].querySelectorAll('.subtype-selector');
    const gramsSelectors = orderLines[i].querySelectorAll('.grams');
    const quantity = document.querySelector('.order-quantity').value;

    // Initialize arrays to store the filled selectors in this group
    const filledTypeSelectors = [];
    const filledSubtypeSelectors = [];
    const filledGramsSelectors = [];

    // Check and collect filled selectors in this group
    for (let j = 0; j < 3; j++) {
      if (typeSelectors[j].value && subtypeSelectors[j].value && gramsSelectors[j].value) {
        filledTypeSelectors.push(typeSelectors[j]);
        filledSubtypeSelectors.push(subtypeSelectors[j]);
        filledGramsSelectors.push(gramsSelectors[j]);
      }
    }

    // Check if there are any filled selectors in this group
    if (filledTypeSelectors.length > 0) {
      let mealPriceGroup = 0; // Initialize the meal price for this group

      // Iterate through the filled selectors in this group
      for (let j = 0; j < filledTypeSelectors.length; j++) {
        const type = filledTypeSelectors[j].value;
        const subtype = filledSubtypeSelectors[j].value; // Get subtype value
        const grams = filledGramsSelectors[j].value;

        let itemPrice = 0; // Initialize item price

        if (type === 'חלבונים' && priceData[subtype]) {
          hasProtein = true;
          itemPrice = priceData[subtype][grams] * quantity;
        } else {
          itemPrice = 25 * quantity;
        }

        // Push the details of the meal to the mealDetails array
        mealDetails.push({
          meal: subtype, // Use subtype as meal name
          grams: grams,
          quantity: quantity,
          price: itemPrice
        });

        // Add the item price to the meal price for this group
        mealPriceGroup += itemPrice;
      }

      // Add the meal price for this group to the total meal price
      mealPrice += mealPriceGroup;
    }
  }

  // Create a table to display the meal details
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Meal</th>
        <th>Grams</th>
        <th>Quantity</th>
        <th>Price (₪)</th>
      </tr>
    </thead>
    <tbody>
  `;

  mealDetails.forEach((meal) => {
    table.innerHTML += `
      <tr>
        <td>${meal.meal}</td>
        <td>${meal.grams}</td>
        <td>${meal.quantity}</td>
        <td>${meal.price} ₪</td>
      </tr>
    `;
  });

  table.innerHTML += `
    </tbody>
    <tfoot>
      <tr>
        <th colspan="3">Total Price for All Meals:</th>
        <td>${mealPrice} ₪</td>
      </tr>
    </tfoot>
  `;

  // Insert the table into the HTML (replace "table-container" with the appropriate container ID)
  const tableContainer = document.getElementById('table-container');
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);

  // Perform your desired action with the gathered information
  if (mealDetails.length === 0) {
    // Handle the case where no items were selected
    console.log("No items selected.");
  }
});



});
