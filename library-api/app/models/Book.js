class Book {

    constructor(id, name, description, isbn, pages, createdAt, updatedAt, authorId, author, genreId, genre) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isbn = isbn;
        this.pages = pages;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorId = authorId;
        this.author = author;
        this.genreId = genreId;
        this.genre = genre;
    }
}

module.exports = Book;