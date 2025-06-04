require('dotenv').config();

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const favoriteRoutes = require('./routes/favorites');
const nextInspectionRoutes = require('./routes/nextInspections');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const userByCarRoutes = require('./routes/userByCar'); 

// ...

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);
app.use('/api/next-inspection', nextInspectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-by-car', userByCarRoutes); 
