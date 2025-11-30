# Employee Attendance System

A full-stack attendance tracking system built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## 🚀 Features

### Employee Features
- ✅ Register/Login authentication
- ✅ Mark daily attendance (Check In / Check Out)
- ✅ View attendance history with calendar and table views
- ✅ Monthly attendance summary (Present/Absent/Late days)
- ✅ Dashboard with real-time stats
- ✅ Profile management

### Manager Features
- ✅ Login authentication
- ✅ View all employees' attendance
- ✅ Advanced filtering (by employee, date, status)
- ✅ Team calendar view
- ✅ Export attendance reports (CSV)
- ✅ Dashboard with team stats and analytics
- ✅ Interactive charts (Weekly trends, Department-wise attendance)

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Employee_Management
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://sashidhar:fqgMeFpB95ZKxeXG@tapacademy.iyxp7kh.mongodb.net/
JWT_SECRET=tapacademy
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
```

This will create:
- 1 Manager account
- 5 Employee accounts
- 30 days of sample attendance records

**Default Credentials:**
- **Manager:** manager@example.com / password123
- **Employees:** 
  - alice@example.com / password123
  - bob@example.com / password123
  - charlie@example.com / password123
  - diana@example.com / password123
  - eve@example.com / password123

## 🚀 Running the Application

### Start Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start Frontend

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

## 📁 Project Structure

```
Employee_Management/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── employee/       # Employee pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MarkAttendance.jsx
│   │   │   │   ├── AttendanceHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── manager/        # Manager pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── AllEmployeesAttendance.jsx
│   │   │   │   ├── TeamCalendar.jsx
│   │   │   │   └── Reports.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── store/              # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── attendanceSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/                      # Backend Node.js application
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── managerAttendanceController.js
│   │   └── dashboardController.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   └── role.js
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── managerAttendanceRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── jwt.js              # JWT utilities
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Get my attendance history
- `GET /api/attendance/my-summary` - Get monthly summary
- `GET /api/attendance/today` - Get today's status

### Attendance (Manager)
- `GET /api/manager/attendance/all` - Get all employees' attendance
- `GET /api/manager/attendance/employee/:id` - Get specific employee attendance
- `GET /api/manager/attendance/summary` - Get team summary
- `GET /api/manager/attendance/export` - Export CSV
- `GET /api/manager/attendance/today-status` - Get today's team status

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  employeeId: String (unique),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (present/absent/late/half-day),
  totalHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Features Showcase

### Employee Dashboard
- Real-time check-in/check-out status
- Monthly attendance summary with statistics
- Recent attendance records (last 7 days)
- Quick action buttons

### Manager Dashboard
- Total employees count
- Today's attendance overview
- Weekly attendance trends (bar chart)
- Department-wise attendance distribution
- Interactive data visualization

### Attendance History
- **Calendar View**: Color-coded monthly calendar
- **Table View**: Detailed attendance records
- Filter by month
- Status indicators (Present, Absent, Late, Half-Day)

### Team Calendar (Manager)
- Monthly overview of all employees
- Click on any date to see details
- Color-coded status indicators
- Employee-wise breakdown

### Reports (Manager)
- Advanced filtering (date range, employee)
- Summary statistics
- Export to CSV functionality
- Comprehensive attendance data table

## 🔒 Authentication & Authorization

- JWT-based authentication
- Protected routes for employee and manager
- Role-based access control
- Secure password hashing with bcryptjs

## 🎯 Key Highlights

1. **Modern UI/UX** - Clean, responsive design with intuitive navigation
2. **Real-time Updates** - Redux state management for instant updates
3. **Data Visualization** - Interactive charts using Recharts
4. **Comprehensive Filtering** - Search and filter capabilities
5. **Export Functionality** - Download reports as CSV
6. **Calendar Views** - Visual representation of attendance
7. **Mobile Responsive** - Works seamlessly on all devices







**Note:** Make sure to update the MongoDB URI and JWT secret in the `.env` files before running the application.
