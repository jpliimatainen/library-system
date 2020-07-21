class Booking {

    constructor(id, bookingDate, dueDate, createdAt, updatedAt, customerId, customer, bookBookings) {
        this.id = id;
        this.bookingDate = bookingDate;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customerId = customerId;
        this.customer = customer;
        this.bookBookings = bookBookings;
    }
}

module.exports = Booking;