class User {

    constructor(id, email, password, createdAt, updatedAt, roleId, role, token) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roleId = roleId;
        this.role = role;
        this.token = token;
    }
}

module.exports = User;