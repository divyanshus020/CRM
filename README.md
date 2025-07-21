# CRM
CUSTOMER RESOURCE MANAGMENT
Complete Roadmap: MERN Stack Billing Challan Application
This document provides a comprehensive roadmap for creating a web application for generating billing challans using the MERN (MongoDB, Express.js, React.js, Node.js) stack.
Part 1: Project Vision & Architecture
1.1. Core Features:
User Management: Users can register and log in to the application.
User Profile: A dedicated section for users to save their business details (Name, Address, GST No., Logo), which will be auto-filled on every challan.
Customer Management: Ability to save and manage a list of customers to quickly select them when creating a new challan.
Challan Creation: A dynamic form to create a new challan, including customer details and a table for adding multiple line items (product/service, quantity, rate, etc.).
Automatic Calculations: The application will automatically calculate the total amount for each line item, the sub-total, GST, and the final grand total.
Challan Dashboard: A central place to view, search, and manage all created challans.
Print Functionality: A clean, professional, and printer-friendly template for the challan that can be printed with a single click.
1.2. Technology Stack:
Frontend: React.js, React Router, Axios (for API calls), Tailwind CSS (for styling).
Backend: Node.js, Express.js.
Database: MongoDB with Mongoose (for object data modeling).
Authentication: JSON Web Tokens (JWT).
1.3. Project Folder Structure:
A standard monorepo structure is recommended to keep the frontend and backend code separate but in the same project directory.
/billing-app
|-- /client           // React Frontend
|   |-- /public
|   |-- /src
|   |   |-- /api
|   |   |-- /components
|   |   |-- /pages
|   |   |-- /context
|   |   |-- App.js
|   |   |-- index.js
|   |-- package.json
|
|-- /server           // Node.js Backend
|   |-- /config
|   |-- /controllers
|   |-- /middlewares
|   |-- /models
|   |-- /routes
|   |-- server.js
|   |-- package.json
|
|-- .gitignore


Part 2: Backend Development (Server)
The backend is the engine of your application, handling all data, logic, and security.
2.1. Database Models (Mongoose Schemas):
You'll need three main data models. Create these in the /server/models directory.
userModel.js: Stores the business owner's information.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String },
    businessAddress: { type: String },
    businessGst: { type: String },
    // Add logo URL if you want to support image uploads
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


customerModel.js: Stores customer details, linked to a user.
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    gstin: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);


challanModel.js: The core model for the challan itself.
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
});

const challanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    challanNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [itemSchema],
    subTotal: { type: Number, required: true },
    gstPercentage: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Challan', challanSchema);


2.2. API Endpoints (Routes):
Define your API routes in the /server/routes directory. These are the URLs your frontend will communicate with.
Auth Routes (/api/auth):
POST /register: Create a new user.
POST /login: Log a user in and return a JWT.
GET /me: Get the logged-in user's profile.
Challan Routes (/api/challans):
POST /: Create a new challan.
GET /: Get all challans for the logged-in user.
GET /:id: Get a single challan by its ID.
PUT /:id: Update a challan.
DELETE /:id: Delete a challan.
Customer Routes (/api/customers):
POST /: Create a new customer.
GET /: Get all customers for the logged-in user.
Part 3: Frontend Development (Client)
The frontend is what your users will see and interact with.
3.1. Pages (in /src/pages):
These are the main views of your application.
HomePage.js: Landing page for non-logged-in users.
RegisterPage.js: User registration form.
LoginPage.js: User login form.
DashboardPage.js: The main screen after login. It will display a list or table of all existing challans.
NewChallanPage.js: The core page with the form for creating a new challan.
ViewChallanPage.js: A page to display a single challan in a clean, printable format. This is the page you'll style for printing.
SettingsPage.js: A form for the user to update their business profile information.
3.2. Components (in /src/components):
These are reusable pieces of UI that you'll use to build your pages.
Navbar.js: Top navigation bar with links and a logout button.
ChallanForm.js: The main form, which will include:
A section for customer details (either by selecting an existing one or creating a new one).
A dynamic table (ItemsTable.js) where users can add, edit, or remove line items.
A summary section (TotalsSummary.js) that displays the sub-total, GST, and grand total in real-time.
ChallanList.js: A table or list of challans to be displayed on the DashboardPage.
PrintChallan.js: The component that formats the challan for printing. It will have a specific print-friendly stylesheet. You can use a library like react-to-print to make this easier.
3.3. Print Styling:
To create a nice UI for the printed challan, you will use a dedicated CSS file.
Create a print.css file.
In this file, hide all elements you don't want to print (like the navbar, buttons, sidebars).
@media print {
  body * {
    visibility: hidden;
  }
  #printableArea, #printableArea * {
    visibility: visible;
  }
  #printableArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .no-print {
    display: none;
  }
}


In your ViewChallanPage.js, wrap the challan content in a div with id="printableArea". The "Print" button will call window.print().
Part 4: Step-by-Step Development Plan
Phase 1: Setup (1-2 Days)
Initialize a Node.js project in the server folder (npm init -y).
Install backend dependencies: express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken.
Set up the basic Express server and connect to your MongoDB database (use MongoDB Atlas for a free cloud database).
Initialize a React project in the client folder (npx create-react-app client).
Install frontend dependencies: axios, react-router-dom, tailwindcss.
Phase 2: Backend APIs (3-5 Days)
Create all the Mongoose models.
Implement the user registration and login logic with JWT authentication.
Create the CRUD (Create, Read, Update, Delete) API endpoints for challans and customers.
Test all your endpoints thoroughly using a tool like Postman or Insomnia.
Phase 3: Frontend - Auth & Layout (2-3 Days)
Set up React Router for page navigation.
Build the main layout (Navbar, Footer).
Create the RegisterPage and LoginPage and connect them to your backend auth APIs.
Implement state management (React Context is great for this) to keep track of the logged-in user.
Phase 4: Core Feature - Challan Creation (4-6 Days)
Build the NewChallanPage and the ChallanForm component.
Implement the dynamic ItemsTable where users can add/remove rows.
Write the JavaScript logic for real-time calculations of totals.
Connect the form to the POST /api/challans endpoint to save the challan.
Phase 5: Display and Print (2-3 Days)
Build the DashboardPage to fetch and display a list of all challans.
Create the ViewChallanPage to display a single challan's details.
Implement the print functionality using window.print() and the special print stylesheet.
Phase 6: Final Touches & Deployment (2-3 Days)
Build the SettingsPage so users can update their profiles.
Refine the UI/UX, add loading states, and handle errors gracefully.
Prepare the app for deployment. You can deploy the backend to Heroku or Render and the frontend to Vercel or Netlify.
This roadmap provides a structured path from concept to a fully functional application. Good luck with your project!
