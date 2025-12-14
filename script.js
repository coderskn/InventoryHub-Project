const API_URL = "http://localhost:5000/api/inventory";

// OPTIMIZATION: Fetch data asynchronously to prevent UI blocking
document.addEventListener("DOMContentLoaded", fetchInventory);

async function fetchInventory() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        // JSON STRUCTURE: Parsing the structured response
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Error loading inventory:", error);
        alert("Could not load inventory. Ensure the backend is running.");
    }
}

function renderTable(items) {
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    items.forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// INTEGRATION: Sending data to the backend via POST
async function addItem() {
    const name = document.getElementById("itemName").value;
    const qty = parseInt(document.getElementById("itemQty").value);
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!name || !qty || !price) {
        alert("Please fill in all fields.");
        return;
    }

    const newItem = { name: name, quantity: qty, price: price };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            // OPTIMIZATION: Re-fetch only after successful add
            fetchInventory(); 
            // Clear inputs
            document.getElementById("itemName").value = "";
            document.getElementById("itemQty").value = "";
            document.getElementById("itemPrice").value = "";
        } else {
            alert("Failed to add item.");
        }
    } catch (error) {
        console.error("Error adding item:", error);
    }
}
