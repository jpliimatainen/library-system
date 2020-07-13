class Booking {

    constructor(id, bookingDate, dueDate, createdAt, updatedAt, customer, bookingRows) {
        this.id = id;
        this.bookingDate = bookingDate;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customer = customer;
        this.bookingRows = bookingRows;
    }
}

module.exports = Booking;