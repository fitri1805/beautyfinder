document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendedProducts();
});

let fetchedProducts = []; // Store fetched products for filtering

function buttonClicked() {
    const brand = document.getElementById("beauty_input").value.trim().toLowerCase();
    if (brand) {  
         // Reset previous search results and visibility
         document.querySelector('.all-products').style.display = 'none';
         document.getElementById("results-container").innerHTML = ''; // Clear previous results
         const recommendedSection = document.querySelector('.recommended-products');
         const partnershipSection = document.querySelector('.partnership-section');
         const filterSection = document.getElementById("filter-section");
 
         // Hide the recommended and partnership sections
         recommendedSection.style.display = 'none';
         partnershipSection.style.display = 'none'; 
         filterSection.style.display = 'none'; // Hide the filter section

        // Fetch and display products for the entered brand
        fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`)
            .then(response => response.json())
            .then(data => {
                fetchedProducts = data; // Save products for filtering
                displayProducts(fetchedProducts);
                document.getElementById("filter-section").style.display = 'block'; // Show filter section
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

function displayProducts(products) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ''; // Clear previous results

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'service-card';
        
        productCard.innerHTML = `
           <img src="${product.image_link}" alt="${product.name}">
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Rating:</strong> ${product.rating ? product.rating : 'N/A'}</p>
            <p><strong>Product Type:</strong> ${product.product_type ? product.product_type : 'N/A'}</p>
            <p><strong>Product Link:</strong> <a href="${product.product_link}" target="_blank">View Product</a></p>
            <p><strong>Website Link:</strong> <a href="${product.website_link}" target="_blank">Visit Website</a></p>

            <div class="note-container">
            <label for="note">Add Note:</label>
            <input type="text" id="note-${product.id}" placeholder="Enter a note" />
            </div>

        `;

        productCard.onclick = (e) => {
            if (!e.target.closest('button') && !e.target.closest('input')) {
                const colors = product.product_colors || [];
                const colorsString = JSON.stringify(colors);
                
                // Redirect with note included
                const note = document.getElementById(`note-${product.id}`).value;
                window.location.href = `prodetail.html?name=${encodeURIComponent(product.name)}&brand=${encodeURIComponent(product.brand)}&price=${product.price}&note=${encodeURIComponent(note)}&description=${encodeURIComponent(product.description || '')}&image=${encodeURIComponent(product.image_link)}&link=${encodeURIComponent(product.product_link)}&colors=${encodeURIComponent(colorsString)}`;                
            }
        };        

        // Add colors section if available
        if (product.product_colors && product.product_colors.length > 0) {
            let colorsHTML = '<p><strong>Available Colors:</strong></p><div class="colors-container">';
            product.product_colors.forEach(color => {
                colorsHTML += `
                    <div class="color-item">
                        <div class="color-box" title="${color.colour_name}" style="background-color: ${color.hex_value};"></div>
                        <span class="color-label">${color.colour_name}</span>
                    </div>
                `;
            });
            colorsHTML += '</div>';
            productCard.innerHTML += colorsHTML;
        } else {
            productCard.innerHTML += '<p><strong>Colors:</strong> Not available</p>';
        }

        resultsContainer.appendChild(productCard);
    });
}

// function for filters 
function applyFilters() {
    const priceFilter = document.getElementById("price-filter").value;
    const ratingFilter = document.getElementById("rating-filter").value;

    const filteredProducts = fetchedProducts.filter(product => {
        let isPriceMatch = true;
        let isRatingMatch = true;

        // Filter by price
        const price = parseFloat(product.price);
        if (priceFilter === "0-10" && !(price < 10)) isPriceMatch = false;
        else if (priceFilter === "10-20" && !(price >= 10 && price <= 20)) isPriceMatch = false;
        else if (priceFilter === "20-50" && !(price >= 20 && price <= 50)) isPriceMatch = false;
        else if (priceFilter === "50+" && !(price > 50)) isPriceMatch = false;

        // Filter by rating
        const rating = parseFloat(product.rating);
        if (ratingFilter === "4+" && !(rating >= 4)) isRatingMatch = false;
        else if (ratingFilter === "3+" && !(rating >= 3)) isRatingMatch = false;
        else if (ratingFilter === "2+" && !(rating >= 2)) isRatingMatch = false;
        else if (ratingFilter === "1+" && !(rating >= 1)) isRatingMatch = false;

        return isPriceMatch && isRatingMatch;
    });

    displayProducts(filteredProducts);
}

let currentIndex = 0; // To keep track of the current index of products
const productsPerPage = 3; // Number of products to show at once
let allProducts = []; // To store all fetched products

function fetchRecommendedProducts() {
    // Fetching all products from the API
    fetch('https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline')
        .then(response => response.json())
        .then(data => {
            // Filter for Maybelline products
            allProducts = data.filter(product => product.brand.toLowerCase() === 'maybelline');
            displayRecommendedProducts(); // Show the first batch of products
        })
        .catch(error => console.error('Error fetching recommended products:', error));
}

function displayRecommendedProducts() {
    const recommendedContainer = document.getElementById("recommended-products-container");
    recommendedContainer.innerHTML = ''; 

    // Calculate the range of products to display
    const start = currentIndex * productsPerPage;
    const end = start + productsPerPage;
    const productsToDisplay = allProducts.slice(start, end);

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'recommended-product';
        productCard.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <p><strong>${product.name}</strong></p>
            <p>$${product.price ? product.price : 'N/A'}</p>
        `;
        recommendedContainer.appendChild(productCard);
    });
}

function nextProducts() {
    if ((currentIndex + 1) * productsPerPage < allProducts.length) {
        currentIndex++; // Move to the next set of products
        displayRecommendedProducts(); // Update the display
    }
}

function prevProducts() {
    if (currentIndex > 0) {
        currentIndex--; // Move to the previous set of products
        displayRecommendedProducts(); // Update the display
    }
}

// Initial fetch of recommended products
fetchRecommendedProducts();

