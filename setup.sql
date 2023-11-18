CREATE DATABASE babyteacher;

USE babyteacher;

GRANT ALL PRIVILEGES ON *.* TO 'babyuser'@'%';

CREATE TABLE ActivityZone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codeDep INT NOT NULL,
    id_post INT NOT NULL
);

CREATE TABLE Availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idPost INT,
    day VARCHAR(255),
    startHour VARCHAR(255),
    endHour VARCHAR(255)
);

CREATE TABLE Categorie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProfile INT NOT NULL,
    idUserComment INT NOT NULL,
    date DATETIME NOT NULL,
    content TEXT,
    note INT NOT NULL
);

CREATE TABLE Contract (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idParent INT NOT NULL,
    idBabysitter INT NOT NULL,
    validateAt DATETIME NOT NULL,
    numberOfHours INT NOT NULL,
    hourlyWage DECIMAL(10, 2) NOT NULL,
    qrCode INT,
    numberOfSitting INT NOT NULL,
    numberOfHoursDone INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    step INT NOT NULL
);

CREATE TABLE Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    cityCode VARCHAR(255) NOT NULL,
    hourlyWage DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    ageChild VARCHAR(255),
    numberChild INT,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE Session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expirationDate DATETIME,
    createdAt DATETIME,
    id_user INT,
    token VARCHAR(255)
);

CREATE TABLE Signalement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProfile INT NOT NULL,
    idSignaler INT NOT NULL,
    dateTime DATETIME NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE Test (
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);

CREATE TABLE Skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idCategorie INT,
    idPost INT,
    name VARCHAR(255) NOT NULL,
    certified BOOLEAN NOT NULL,
    detail TEXT
);

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lastname VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255),
    age INT,
    sexe INT,
    photo VARCHAR(255),
    email VARCHAR(255),
    description TEXT
);