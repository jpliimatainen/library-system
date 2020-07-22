class BookBooking {

    constructor(createdAt, updatedAt, bookId, bookingId, bookStateId, bookState) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.bookId = bookId;
        this.bookingId = bookingId;
        this.bookStateId = bookStateId;
        this.bookState = bookState;
    }
}

module.exports = BookBooking;