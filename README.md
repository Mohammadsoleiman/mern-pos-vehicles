# 🚗 Vehicles Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application that provides a complete **POS and accounting management platform** for vehicle dealerships.  
It offers **role-based dashboards** for Admin, Accountant, and Clerk, allowing seamless management of sales, purchases, inventory, and financial records.

---

## 🌟 Features

- 🔐 **Role-Based Access Control**
  - Separate dashboards for Admin, Accountant, and Clerk
- 💰 **Point of Sale (POS)**
  - Manage vehicle sales, invoices, and transactions
- 📊 **Accounting Module**
  - Track income, expenses, and profit reports
- 🚘 **Inventory Management**
  - Add, edit, and monitor vehicles (cars, motorcycles, boats)
- 👥 **Customer Management**
  - Track customer details and purchase history
- 📈 **Dynamic Dashboards**
  - Real-time KPIs and charts for financial insights
- 💾 **MongoDB Integration**
  - Robust schema structure with automated data seeding
- ⚡ **Optimized Frontend**
  - Built with React + Vite for high-performance UI
- 🧾 **Reporting Tools**
  - Generate summaries, transaction history, and analytics

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, React Router, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Styling** | CSS (Custom Responsive Styling, no Tailwind) |
| **Tools** | Postman, Git, VS Code, JWT Auth |

---
## 📁 Folder Structure

<details>
<summary>Show Full Project Structure</summary>

mern-pos-vehicles/
├── client/ # React Frontend
│ └── src/
│ ├── components/ # UI Components (for each role)
│ ├── context/ # React Context Providers
│ ├── pages/ # Accountant, Clerk, Admin Pages
│ └── styles/ # CSS Stylesheets (Custom Responsive, No Tailwind)
│ └── package.json
│
├── server/ # Express + Node Backend
│ ├── models/ # Mongoose Schemas
│ ├── routes/ # API Endpoints
│ ├── controllers/ # Business Logic
│ ├── config/ # Database Connection
│ ├── middleware/ # Auth & Validation Middleware
│ └── package.json
│
└── README.md

</details>


---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MohammadBalqis/mern-pos-vehicles.git
cd mern-pos-vehicles

 ##Install Dependencies
 # Backend
cd server
npm install

# Frontend
cd ../client
npm install


Inside the /server folder, create a .env file and add:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key


Run the Application:
# Run backend
cd server
npm run dev

# Run frontend
cd ../client
npm run dev

Then visit:
👉 http://localhost:5173

📊 Future Enhancements

🔄 Real-time synchronization across dashboards

🧾 Printable receipts and PDF reports

📦 Inventory stock alerts and low-quantity warnings

🧠 AI-based sales and expense predictions

🌐 Deployment with Docker and CI/CD integration


👨‍💻 Author

Mohammad Balqis
🚀 Full-Stack Developer (MERN) | Digital Hub Trainee
📫 GitHub Profile: https://github.com/MohammadBalqis

💼 Passionate about building scalable and data-driven web applications.


📜 License:

This project is open source and available under the MIT License
.


🏷️ Badges

---

### ✅ Next Step
1. Copy the above text into a new file named `README.md` inside your project root.  
2. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add project README"
   git push origin main