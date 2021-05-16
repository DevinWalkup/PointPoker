import api from "./Api";

export async function getAllUsers() {
    let users = await api.get('/api/users');

    return users.data;
}

export async function createUser(data) {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
    })
    return await response.json();
}