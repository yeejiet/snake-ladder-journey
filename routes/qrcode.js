// Require the necessary packages
const QRCode = require('qrcode');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',    // Replace with your database host
    user: 'root',         // Replace with your database user
    password: '',         // Replace with your database password
    database: 'snake_ladder_journey' // Replace with your database name
});

// Connect to the database
connection.connect(err => {
    if (err) {
        return console.error('Error connecting to the database:', err);
    }
    console.log('Connected to the database');

    // Query the database for a random question
    connection.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1', (err, results) => {
        if (err) {
            return console.error('Error fetching data from the database:', err);
        }

        if (results.length > 0) {
            // Get the random question data
            let data = results[0];

            // Convert the data into String format
            let stringdata = JSON.stringify(data);

            // Print the QR code to terminal
            QRCode.toString(stringdata, { type: 'terminal' }, function (err, QRcode) {
                if (err) return console.log("Error occurred");

                // Printing the generated code
                console.log(QRcode);
            });

            // Converting the data into base64 
            QRCode.toDataURL(stringdata, function (err, code) {
                if (err) return console.log("Error occurred");

                // Printing the code
                console.log(code);
            });
        } else {
            console.log('No data found');
        }

        // Close the database connection
        connection.end();
    });
});
