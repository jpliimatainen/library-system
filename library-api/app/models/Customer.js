class Customer {

    constructor(id, firstname, lastname, streetAddress, createdAt, updatedAt, userId, user, postCode, post) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.streetAddress = streetAddress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.user = user;
        this.postCode = postCode;
        this.post = post;
    }
}

module.exports = Customer;