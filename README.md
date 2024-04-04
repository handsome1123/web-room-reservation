# web-room-reservation

npm install express 
npm install mysql 
npm install ejs
npm install mysql body-parser
npm install express-session
npm install bcrypt


Dtatbase name -> web-app

Table 


Routes For Students 
app.get(‘/login’, (req, res)
app.post(‘/login’, (req, res)
app.get(‘/signup’, (req, res)
app.post(‘/signup’, (req, res)
app.get(‘/’, isAuthenticated, (req, res) 
app.get(‘/requesting/new’, isAuthenticated, (req, res)
app.post(‘/requesting’, isAuthenticated, (req, res)
app.get(‘/history’, isAuthenticated, (req, res)
app.post(‘/logout’, (req, res)

Routes For Lecturers 
app.get(‘/lecturer’, (req, res)
app.post(‘/lecturer/login’, (req, res)
app.get(‘/lecturer/dashboard’, isAuthenticated, (req, res) 
app.get(‘/lecturer/student-requests’, isAuthenticated, (req, res)
app.post(‘/lecturer/approve-requesting’, isAuthenticated, (req, res)
app.post(‘/lecturer/reject-requesting’, isAuthenticated, (req, res)
app.get(‘/lecturer/history’, isAuthenticated, (req, res)
app.post(‘/logout’, (req, res)


Routes For Staff
app.get(‘/staff, (req, res)
app.post(‘/staff/login’, (req, res)
app.get(‘/staff/dashboard’, isAuthenticated, (req, res) 
app.get(‘/staff/add-room’, isAuthenticated, async(req, res)
app.post(‘/staff/add-room’, isAuthenticated, async (req, res) 
app.post(‘/staff/delete/:id’, isAuthenticated, async (req, res) 
app.get(‘/staff/edit/:id’, isAuthenticated, async (req, res) 
app.post(‘/staff/edit/:id’, isAuthenticated, async (req, res) 
app.post(‘/staff/disable-room’, isAuthenticated, (req, res)
app.get(‘/staff/all-lecturers-history’, isAuthenticated, (req, res)
app.post(‘/logout’, (req, res)


