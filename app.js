const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web-app'
});
connection.connect();

// Set EJS as the view engine
app.set('view engine', 'ejs');

//___________________________for student______________________
//******************************************************** */

// Endpoint to render the login form
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM students WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    req.session.user = results[0];
                    res.redirect('/');
                } else {
                    res.render('login', { error: 'Invalid username or password' });
                }
            });
        } else {
            res.render('login', { error: 'User does not exist' });
        }
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const query = 'INSERT INTO students (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [username, email, hash], (err) => {
            if (err) {
                res.render('signup', { error: 'Username already exists' });
            } else {
                res.redirect('/login');
            }
        });
    });
});

// Endpoint to render index page with list of rooms and their associated time slots
app.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id; // Assuming user ID is stored in session
    
    // Query to fetch rooms
    const roomsQuery = 'SELECT * FROM rooms';
    connection.query(roomsQuery, (error, rooms) => {
        if (error) {
            throw error;
        }

        // Query to fetch time slots for each room
        const slotsQuery = 'SELECT * FROM slots1';
        connection.query(slotsQuery, (error, slots1) => {
            if (error) {
                throw error;
            }

            // Organize time slots by room
            rooms.forEach(room => {
                room.timeSlots = slots1.filter(slot => slot.room_id === room.room_id);
            });

            // Render the index page with rooms and their associated time slots
            res.render('index', { rooms: rooms, userId: userId });
        });
    });
});

// Endpoint to render booking form
app.get('/bookings/new', isAuthenticated, (req, res) => {
    const { roomId, slotId } = req.query;
    const userId = req.session.user.id; // Assuming user ID is stored in session
    
    // Assuming you fetch the room name, start time, and end time based on roomId and slotId from your database
    const roomQuery = 'SELECT room_name FROM rooms WHERE room_id = ?';
    connection.query(roomQuery, [roomId], (error, room) => {
        if (error) {
            console.error('Error fetching room name:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        // Assuming you fetch the start time and end time based on slotId
        const slotQuery = 'SELECT start_time, end_time FROM slots1 WHERE id = ?';
        connection.query(slotQuery, [slotId], (error, slot) => {
            if (error) {
                console.error('Error fetching time slot:', error);
                return res.status(500).send('Internal Server Error');
            }
            
            // Render the booking form with the provided data
            res.render('bookingForm', {
                roomId: roomId,
                roomName: room[0].room_name,
                startTime: slot[0].start_time,
                endTime: slot[0].end_time,
                slotId: slotId,
                userId: userId
            });
        });
    });
});

// Endpoint to handle booking form submission
app.post('/bookings', isAuthenticated, (req, res) => {
    const { roomId, slotId, objective } = req.body;
    const userId = req.session.user.id; // Assuming user ID is stored in session

    // Assuming you want to set the default status to 'pending' when creating a new booking
    const status = 'pending';

    // Start a transaction
    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Insert booking into bookings1 table
        const bookingQuery = 'INSERT INTO bookings1 (room_id, slot_id, student_id, objective, status) VALUES (?, ?, ?, ?, ?)';
        connection.query(bookingQuery, [roomId, slotId, userId, objective, status], (error, results) => {
            if (error) {
                console.error('Error creating booking:', error);
                connection.rollback(() => {
                    res.status(500).send('Internal Server Error');
                });
                return;
            }

            // Update slot status in slots1 table to 'pending'
            const slotUpdateQuery = 'UPDATE slots1 SET status = ? WHERE id = ?';
            connection.query(slotUpdateQuery, ['pending', slotId], (err, result) => {
                if (err) {
                    console.error('Error updating slot status:', err);
                    connection.rollback(() => {
                        res.status(500).send('Internal Server Error');
                    });
                    return;
                }

                // Commit the transaction
                connection.commit((error) => {
                    if (error) {
                        console.error('Error committing transaction:', error);
                        connection.rollback(() => {
                            res.status(500).send('Internal Server Error');
                        });
                        return;
                    }

                    // Transaction successfully committed
                    res.redirect('/');
                });
            });
        });
    });
});

app.get('/history', isAuthenticated, (req, res) => {
    const userId = req.session.user.id; // Assuming user ID is stored in session

    // Query database to get booking history with room names and time slots for the current user
    const query = `
        SELECT b.id, r.room_name, s.start_time, s.end_time, b.objective, b.status
        FROM bookings1 AS b
        INNER JOIN rooms AS r ON b.room_id = r.room_id
        INNER JOIN slots1 AS s ON b.slot_id = s.id
        WHERE b.student_id = ?`;

    connection.query(query, [userId], (error, bookings) => {
        if (error) {
            console.error('Error fetching booking history:', error);
            return res.status(500).send('Internal Server Error');
        }
        // Render the booking history page with bookings data
        res.render('student-history', { bookings: bookings });
    });
});

//____________________________for Lecturer________________________
//************************************************************* */

// Lecturer Login
app.get('/lecturer/login', (req,res) => {
    res.render('lecturer/login');
});

// Lecturer Login
app.post('/lecturer/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM lecturers WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    req.session.user = results[0];
                    res.redirect('/lecturer/dashboard');
                } else {
                    res.render('lecturer/login', { error: 'Invalid username or password' });
                }
            });
        } else {
            res.render('lecturer/login', { error: 'User does not exist' });
        }
    });
});

// Lecturer Signup
app.get('/lecturer/signup', (req, res) => {
    res.render('lecturer/signup');
});

// Lecturer Signup
app.post('/lecturer/signup', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const query = 'INSERT INTO lecturers (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [username, email, hash], (err) => {
            if (err) {
                res.render('lecturer/signup', { error: 'Username already exists' });
            } else {
                res.redirect('/lecturer/login');
            }
        });
    });
});

// Endpoint to render the lecturer dashboard
app.get('/lecturer/dashboard', isAuthenticated, (req, res) => {
    // Query database to get counts for different slot and room statuses
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM slots1 WHERE status = 'free') AS freeSlots,
            (SELECT COUNT(*) FROM slots1 WHERE status = 'pending') AS pendingSlots,
            (SELECT COUNT(*) FROM slots1 WHERE status = 'reserved') AS reservedSlots
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching counts:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        const { freeSlots, pendingSlots, reservedSlots, disabledRooms } = results[0];

        // Render the lecturer dashboard with counts
        res.render('lecturer/dashboard', { freeSlots, pendingSlots, reservedSlots, disabledRooms });
    });
});

// Lecturer history
app.get('/lecturer/history', isAuthenticated, (req, res) => {
    const lecturerId = req.session.user.id; // Assuming lecturer ID is stored in session

    // Query database to get booking history with room names, time slots, and approval/rejection details for the lecturer
    const query = `
        SELECT b.id, r.room_name, s.start_time, s.end_time, b.objective, b.status, 
               b.approved_by, b.rejected_by
        FROM bookings1 AS b
        INNER JOIN rooms AS r ON b.room_id = r.room_id
        INNER JOIN slots1 AS s ON b.slot_id = s.id
        WHERE b.approved_by = ? OR b.rejected_by = ?`;

    connection.query(query, [lecturerId, lecturerId], (error, bookings) => {
        if (error) {
            console.error('Error fetching booking history:', error);
            return res.status(500).send('Internal Server Error');
        }
        // Render the lecturer booking history page with bookings data
        res.render('lecturer/lecturer-history', { bookings: bookings });
    });
});

// Endpoint to handrender student booking request 
app.get('/student-request', isAuthenticated, (req, res) => {

        // Query database to get all bookings
        const query = 'SELECT bookings1.*, rooms.room_name FROM bookings1 JOIN rooms ON bookings1.room_id = rooms.room_id';
        connection.query(query, (error, bookings) => {
            if (error) {
                // Handle error
                console.error('Error fetching bookings:', error);
                return res.status(500).send('Internal Server Error');
            }
            // Render the lecturer dashboard with bookings data
            res.render('lecturer/request', { bookings: bookings });
        });

});

// Endpoint to handle booking approval
app.post('/approve-booking', isAuthenticated, (req, res) => {
    const { bookingId } = req.body;
    const lecturerId = req.session.user.id; // Assuming lecturer ID is stored in session
    
    const query = 'UPDATE bookings1 SET status = "approved", approved_by = ? WHERE id = ?';
    connection.query(query, [lecturerId, bookingId], (err, result) => {
        if (err) {
            // Handle error
            console.error('Error approving booking:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Update status of slot in slots1 table to 'reserved'
        const updateSlotQuery = 'UPDATE slots1 SET status = "reserved" WHERE id = (SELECT slot_id FROM bookings1 WHERE id = ?)';
        connection.query(updateSlotQuery, [bookingId], (error, result) => {
            if (error) {
                // Handle error
                console.error('Error updating slot status:', error);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect back to the dashboard or any other appropriate page
            res.redirect('/lecturer/dashboard');
        });
    });
});

// Endpoint to handle booking rejection
app.post('/reject-booking', isAuthenticated, (req, res) => {
    const { bookingId } = req.body;
    const lecturerId = req.session.user.id;

    const query = 'UPDATE bookings1 SET status = "rejected", rejected_by = ? WHERE id = ?';
    connection.query(query, [lecturerId, bookingId], (err) => {
        if (err) {
            // Handle error
            console.error('Error rejecting booking:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Update status of slot in slots1 table to 'free'
        const updateSlotQuery = 'UPDATE slots1 SET status = "free" WHERE id = (SELECT slot_id FROM bookings1 WHERE id = ?)';
        connection.query(updateSlotQuery, [bookingId], (error, result) => {
            if (error) {
                // Handle error
                console.error('Error updating slot status:', error);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect back to the dashboard or any other appropriate page
            res.redirect('/lecturer/dashboard');
        });
    });
});

// Lecturer history
app.get('/lecturer/history', isAuthenticated, (req, res) => {
    const lecturerId = req.session.user.id; // Assuming lecturer ID is stored in session

    // Query database to get booking history with room names and time slots for the lecturer
    const query = `
        SELECT b.id, r.room_name, s.start_time, s.end_time, b.objective, b.status
        FROM bookings1 AS b
        INNER JOIN rooms AS r ON b.room_id = r.room_id
        INNER JOIN slots1 AS s ON b.slot_id = s.id
        WHERE b.student_id = ?`;

    connection.query(query, [lecturerId], (error, bookings) => {
        if (error) {
            console.error('Error fetching booking history:', error);
            return res.status(500).send('Internal Server Error');
        }
        // Render the lecturer booking history page with bookings data
        res.render('lecturer/lecturer-history', { bookings: bookings });
    });
});

//___________________________for staff_________________
//************************************************** */

// Staff Login
app.get('/staff/login', (req, res) => {
    res.render('staff/login');
});

// Staff Login
app.post('/staff/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM staffs WHERE username = ? AND password = ?';

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching staff member:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const staffMember = results[0];
            req.session.user = staffMember;
            res.redirect('/staff/dashboard');
        } else {
            res.render('staff/login', { error: 'Invalid username or password' });
        }
    });
});

// Staff Dashboard
app.get('/staff/dashboard', isAuthenticated, (req, res) => {
    // Query to fetch rooms
    const roomsQuery = 'SELECT * FROM rooms';
    connection.query(roomsQuery, (error, rooms) => {
        if (error) {
            console.error('Error fetching rooms:', error);
            return res.status(500).send('Internal Server Error');
        }

        const slotsQuery = 'SELECT * FROM slots1';
        connection.query(slotsQuery, (error, slots1) => {
            if (error) {
                console.error('Error fetching time slots:', error);
                return res.status(500).send('Internal Server Error');
            }

            rooms.forEach(room => {
                room.timeSlots = slots1.filter(slot => slot.room_id === room.room_id);
            });

            // Render the dashboard with rooms and their associated time slots
            res.render('staff/dashboard', { rooms: rooms });
        });
    });
});

// Staff add room
app.get('/staff/addroom', isAuthenticated, (req, res) => {
    res.render('staff/addRoom');
});

// Staff add room 
app.post('/staff/addroom', isAuthenticated, (req, res) => {
    const { roomName } = req.body;

    // Validate the request data
    if (!roomName) {
        return res.status(400).send('Room name is required');
    }

    // Insert the new room into the database
    const query = 'INSERT INTO rooms (room_name) VALUES (?)';
    connection.query(query, [roomName], (error, results) => {
        if (error) {
            console.error('Error adding room:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/staff/dashboard'); // Redirect back to the dashboard
    });
});


app.post('/staff/disableroom', isAuthenticated, (req, res) => {
    const { roomId, slotIds } = req.body;
    const disableSlot = req.body.disableSlot;

    // Check if the room should be disabled
    if (disableSlot && slotIds && slotIds.length > 0) {
        // Update the status of time slots associated with the room to 'disabled' in the database
        const slotQuery = 'UPDATE slots1 SET status = "disabled" WHERE id IN (?) AND room_id = ?';
        connection.query(slotQuery, [slotIds, roomId], (slotError, slotResult) => {
            if (slotError) {
                console.error('Error disabling slots:', slotError);
                return res.status(500).send('Internal Server Error');
            }
            
            // Redirect back to the staff dashboard after disabling the time slots
            res.redirect('/staff/dashboard');
        });
    } else {
        // If the room should not be disabled or no slots selected, redirect back to the staff dashboard
        res.redirect('/staff/dashboard');
    }
});


// Define route to render the editSlot.ejs page
app.get('/staff/editslot/:id', isAuthenticated, (req, res) => {
    const slotId = req.params.id;
    // Fetch the slot data from the database based on the provided ID
    const query = 'SELECT * FROM slots1 WHERE id = ?';
    connection.query(query, [slotId], (error, slot) => {
        if (error) {
            console.error('Error fetching slot:', error);
            return res.status(500).send('Internal Server Error');
        }
        // Render the editSlot.ejs template with the slot data
        res.render('staff/editSlot', { slot: slot });
    });
});







// Staff history
app.get('/staff/history', isAuthenticated, (req, res) => {

    // Query database to get booking history with room names and time slots for the lecturer
    const query = `
        SELECT b.id, r.room_name, s.start_time, s.end_time, b.objective, b.status
        FROM bookings1 AS b
        INNER JOIN rooms AS r ON b.room_id = r.room_id
        INNER JOIN slots1 AS s ON b.slot_id = s.id`;

    connection.query(query, (error, bookings) => {
        if (error) {
            console.error('Error fetching booking history:', error);
            return res.status(500).send('Internal Server Error');
        }
        // Render the lecturer booking history page with bookings data
        res.render('staff/history', { bookings: bookings });
    });
});


// _____________Logout_______________________________
//************************************************** */
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login');
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
