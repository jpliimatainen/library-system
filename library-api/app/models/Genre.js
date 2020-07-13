class Genre {

    constructor(id, classification, name, createdAt, updatedAt) {
        this.id = id;
        this.classification = classification;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Genre;