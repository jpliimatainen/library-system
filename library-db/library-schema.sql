-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema librarydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `librarydb` ;

-- -----------------------------------------------------
-- Schema librarydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `librarydb` DEFAULT CHARACTER SET utf8 ;
USE `librarydb` ;

-- -----------------------------------------------------
-- Table `librarydb`.`authors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`authors` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`authors` (
  `author_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `lastname` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`author_id`),
  UNIQUE INDEX `author_id_UNIQUE` (`author_id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`roles` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`roles` (
  `role_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `role_id_UNIQUE` (`role_id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`users` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`users` (
  `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `password` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_users_roles_idx` (`role_id` ASC),
  CONSTRAINT `fk_users_roles`
    FOREIGN KEY (`role_id`)
    REFERENCES `librarydb`.`roles` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`posts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`posts` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`posts` (
  `post_code` CHAR(5) NOT NULL,
  `town` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`post_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`customers` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`customers` (
  `customer_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `lastname` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `street_address` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `post_code` CHAR(5) NOT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC),
  INDEX `fk_customers_users1_idx` (`user_id` ASC),
  INDEX `fk_customers_posts1_idx` (`post_code` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  CONSTRAINT `fk_customers_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `librarydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_customers_posts1`
    FOREIGN KEY (`post_code`)
    REFERENCES `librarydb`.`posts` (`post_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`bookings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`bookings` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`bookings` (
  `booking_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE INDEX `booking_id_UNIQUE` (`booking_id` ASC),
  INDEX `fk_bookings_customers1_idx` (`customer_id` ASC),
  CONSTRAINT `fk_bookings_customers1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `librarydb`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`genres` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`genres` (
  `genre_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `classification` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `name` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`genre_id`),
  UNIQUE INDEX `genre_id_UNIQUE` (`genre_id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`books`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`books` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`books` (
  `book_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `description` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `isbn` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `pages` INT(10) UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `author_id` INT(10) UNSIGNED NOT NULL,
  `genre_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE INDEX `book_id_UNIQUE` (`book_id` ASC),
  INDEX `fk_books_authors1_idx` (`author_id` ASC),
  INDEX `fk_books_genres1_idx` (`genre_id` ASC),
  CONSTRAINT `fk_books_authors1`
    FOREIGN KEY (`author_id`)
    REFERENCES `librarydb`.`authors` (`author_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_books_genres1`
    FOREIGN KEY (`genre_id`)
    REFERENCES `librarydb`.`genres` (`genre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`book_states`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`book_states` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`book_states` (
  `book_state_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`book_state_id`),
  UNIQUE INDEX `book_state_id_UNIQUE` (`book_state_id` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`books_bookings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`books_bookings` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`books_bookings` (
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `book_id` INT(10) UNSIGNED NOT NULL,
  `booking_id` INT(10) UNSIGNED NOT NULL,
  `book_state_id` INT UNSIGNED NOT NULL,
  INDEX `fk_books_bookings_bookings1_idx` (`booking_id` ASC),
  INDEX `fk_books_bookings_books1_idx` (`book_id` ASC),
  INDEX `fk_books_bookings_book_states1_idx` (`book_state_id` ASC),
  CONSTRAINT `fk_books_bookings_bookings1`
    FOREIGN KEY (`booking_id`)
    REFERENCES `librarydb`.`bookings` (`booking_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_books_bookings_books1`
    FOREIGN KEY (`book_id`)
    REFERENCES `librarydb`.`books` (`book_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_books_bookings_book_states1`
    FOREIGN KEY (`book_state_id`)
    REFERENCES `librarydb`.`book_states` (`book_state_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


-- -----------------------------------------------------
-- Table `librarydb`.`logs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `librarydb`.`logs` ;

CREATE TABLE IF NOT EXISTS `librarydb`.`logs` (
  `log_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  `user_id` INT(10) UNSIGNED NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE INDEX `log_id_UNIQUE` (`log_id` ASC),
  INDEX `fk_logs_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_logs_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `librarydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
