USE babyteacher;

GRANT ALL PRIVILEGES ON *.* TO 'babyuser'@'%';

CREATE TABLE activityZone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codeDep INT NOT NULL,
    id_post INT NOT NULL
);

CREATE TABLE availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idPost INT,
    day VARCHAR(255),
    startHour VARCHAR(255),
    endHour VARCHAR(255)
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProfile INT NOT NULL,
    idUserComment INT NOT NULL,
    date DATETIME NOT NULL,
    content TEXT,
    note INT NOT NULL
);

CREATE TABLE contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idParent INT NOT NULL,
    idBabysitter INT NOT NULL,
    validateAt DATETIME NOT NULL,
    numberOfHours INT NOT NULL,
    hourlyWage DECIMAL(10, 2) NOT NULL,
    qrCode INT,
    numberOfSitting INT NOT NULL,
    numberOfHourDone INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    step INT NOT NULL
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT NOT NULL,
    cityCode VARCHAR(255) NOT NULL,
    hourlyWage DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    ageChild VARCHAR(255),
    numberChild INT,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expirationDate DATETIME,
    createdAt DATETIME,
    id_user INT,
    token VARCHAR(255)
);

CREATE TABLE signalements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProfile INT NOT NULL,
    idSignaler INT NOT NULL,
    dateTime DATETIME NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE test (
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUser INT,
    idCategorie INT,
    idPost INT,
    name VARCHAR(255) NOT NULL,
    certified BOOLEAN NOT NULL,
    detail TEXT
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lastname VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    id_role INT,
    age INT,
    sexe INT,
    photo VARCHAR(255),
    email VARCHAR(255),
    description TEXT
);

INSERT INTO role (role) VALUES ('admin');
INSERT INTO role (role) VALUES ('babysitter');
INSERT INTO role (role) VALUES ('parent');

INSERT INTO users (name, lastname, login, password, id_role, age, sexe, photo, email, description) VALUES ('admin', 'admin', 'admin', 'admin', 1, 0, 0, 'admin', 'admin', 'admin');
