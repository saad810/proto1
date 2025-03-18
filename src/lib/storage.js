// Create a new item in localStorage
export function createItem(key, value) {
    if (localStorage.getItem(key) !== null) {
        console.error(`Item with key "${key}" already exists.`);
        return false;
    }
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Error creating item:", error);
        return false;
    }
}

// Read an item from localStorage
export function readItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error reading item:", error);
        return null;
    }
}

// Update an existing item in localStorage
export function updateItem(key, newValue) {
    if (localStorage.getItem(key) === null) {
        console.error(`Item with key "${key}" does not exist.`);
        return false;
    }
    try {
        localStorage.setItem(key, JSON.stringify(newValue));
        return true;
    } catch (error) {
        console.error("Error updating item:", error);
        return false;
    }
}

// Delete an item from localStorage
export function deleteItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Error deleting item:", error);
        return false;
    }
}

// Example usage:
//   createItem("user", { name: "Alice", age: 30 });
//   const user = readItem("user");
//   console.log("User from localStorage:", user);
//   updateItem("user", { name: "Alice", age: 31 });
//   deleteItem("user");
