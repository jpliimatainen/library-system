class BookingRow {

    constructor(createdAt, updatedAt, book, booking) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.book = book;
        this.booking = booking;
    }
}

module.exports = BookingRow;