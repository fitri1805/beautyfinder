function displayWishlist() {
    const wishlistDisplay = document.getElementById('wishlistDisplay');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    wishlistDisplay.innerHTML = ''; // Clear previous items

    wishlist.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'wishlist-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>Brand:</strong> ${item.brand}</p>
            <p><strong>Price:</strong> $${item.price}</p>
            <p><strong>Current Note:</strong> <span id="current-note-${index}">${item.note || 'No note added.'}</span></p>
            <input type="text" value="${item.note || ''}" id="note-${index}" placeholder="Enter a new note" style="display: none;" />
            <button class="update-btn" onclick="toggleNoteInput(${index})">Update Note</button>
            <button class="save-btn" id="save-btn-${index}" style="display: none;" onclick="updateNote(${index})">Save Note</button>
            <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
        `;
        wishlistDisplay.appendChild(itemDiv);
    });
}

//noteinput 
function toggleNoteInput(index) {
    const noteInput = document.getElementById(`note-${index}`);
    const saveButton = document.getElementById(`save-btn-${index}`);
    const currentNoteSpan = document.getElementById(`current-note-${index}`);

    // Toggle visibility of the note input and save button
    if (noteInput.style.display === 'none') {
        noteInput.style.display = 'block';  // Show the note input
        saveButton.style.display = 'inline-block';  // Show the save button
        currentNoteSpan.style.display = 'none';  // Hide the current note display
    } else {
        noteInput.style.display = 'none';  // Hide the note input
        saveButton.style.display = 'none';  // Hide the save button
        currentNoteSpan.style.display = 'inline';  // Show the current note display
    }
}

//update note
function updateNote(index) {
    const noteInput = document.getElementById(`note-${index}`);
    const currentNoteSpan = document.getElementById(`current-note-${index}`);

    // Get the new note value
    const newNote = noteInput.value;

    // Update the note in localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist[index].note = newNote;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update the displayed note and hide the input field
    currentNoteSpan.textContent = newNote || 'No note added.'; // Update displayed note
    noteInput.style.display = 'none';  // Hide the note input after saving
    document.getElementById(`save-btn-${index}`).style.display = 'none'; // Hide save button
    currentNoteSpan.style.display = 'inline';  // Show the current note display
}

// delete product 
function deleteItem(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (index >= 0 && index < wishlist.length) {
        wishlist.splice(index, 1); // Remove item from wishlist
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist(); // Refresh display
        alert("Item deleted successfully.");
    } else {
        alert("Invalid item index.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayWishlist();
});
