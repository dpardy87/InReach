CREATE DATABASE IF NOT EXISTS `InReach`;
USE `InReach`;

CREATE TABLE IF NOT EXISTS `locations` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locationName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL
);

CREATE TABLE IF NOT EXISTS `checkins` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    locationId INT NOT NULL,
    notes TEXT,
    distance DECIMAL(10, 2) NOT NULL,
    checkInTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (locationId) REFERENCES locations(id)
);

CREATE TABLE IF NOT EXISTS `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    googleId VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    picture TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
