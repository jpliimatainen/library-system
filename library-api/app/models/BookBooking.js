class BookBooking {

    constructor(createdAt, updatedAt, bookId, bookingId) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.bookId = bookId;
        this.bookingId = bookingId;
    }
}

module.exports = BookBooking;