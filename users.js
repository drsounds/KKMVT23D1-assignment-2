const fs = require('fs')
const os = require('os')

const filename = os.homedir() + "/.kkmvt-users.json";

function loadUsers() { 
    if (!fs.existsSync(filename)) {
        return {}
    }
    const usersStr = fs.readFileSync(filename, "UTF-8")
    try {
        return JSON.parse(usersStr)
    } catch (e) {
        throw new Error("Can't load users")
    }
}

function saveUsers(users) {
    fs.writeFileSync(filename, JSON.stringify(users))
}

function clearUsers() {
    saveUsers({})
}

function changePassword(username, password, newPassword) {
    const users = loadUsers()
    console.log("username", username)
    const user = users[username]
    if (!user) {
        throw new Error("Invalid username")
    }
    if (password !== user.password) {
        throw new Error("Invalid password")
    }
    user.password = newPassword

    const newUsers = {
        ...users,
        [user.username]: user
    }
    saveUsers(newUsers)
}

function registerUser(email, username, password) {
    const users = loadUsers()
    
    const newUsers = {
        ...users,
        [username]: {
            username,
            password,
            email
        }
    }
    saveUsers(newUsers)
}

function login(username, password) {
    const users = loadUsers()
    const user = users[username]
    
    if (!user) {
        throw new Error("Wrong username")
    }
    if (password != user.password) {
        throw new Error("Wrong password")
    }
    return user
}

module.exports = {
    saveUsers,
    registerUser,
    loadUsers,
    login,
    clearUsers,
    changePassword
}
