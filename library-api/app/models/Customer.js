class Customer {

    constructor(id, firstname, lastname, streetAddress, postCode, createdAt, updatedAt, userId, user) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.streetAddress = streetAddress;
        this.postCode = postCode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.user = user;
    }
}

module.exports = Customer;