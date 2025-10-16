CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile TEXT,
    last_login TIMESTAMP,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);


//demo users inseted into users TABLE

INSERT INTO users (
    firstname, lastname, email, password, phone, profile, last_login, isVerified, isDeleted
) VALUES
    (
        'yanshika', 'nigam', 'john.doe@example.com', 'hashed_password_123',
        '9876543210', 'Software Developer', NOW(), TRUE, FALSE
    ),
    (
         'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_456',
        '9123456780', 'Data Analyst', NOW(), FALSE, FALSE
    );


