const BASE_URL = 'http://localhost:5000/api';

// USER
async function createUser(userData) {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
}

// CART
async function getCart(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart`);
    return response.json();
}

// ORDER
async function placeOrderFromUser(userId, clientData) {
    const response = await fetch(`${BASE_URL}/orders/from-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
    });
    return response.json();
}

// ORDER ITEMS
async function getOrderItems(orderId) {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/items`);
    return response.json();
}

async function addOrderItem(orderId, gameId) {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ GameID: gameId })
    });
    return response.json();
}

async function removeOrderItem(orderId, gameId) {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/items/${gameId}`, {
        method: 'DELETE'
    });
    return response.json();
}

// EXPORTS
window.api = {
    createUser,
    getCart,
    placeOrderFromUser,
    getOrderItems,
    addOrderItem,
    removeOrderItem
};
