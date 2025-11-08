# 🚗 Vehicles Management System

<div align="center">
  
  ![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Vehicle+Management+System+%F0%9F%9A%97;MERN+Stack+Application+%F0%9F%92%BB;POS+%26+Accounting+Platform+%F0%9F%92%B0)

</div>

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application that provides a complete **POS and accounting management platform** for vehicle dealerships.  

It offers **role-based dashboards** for Admin, Accountant, and Clerk, allowing seamless management of sales, purchases, inventory, and financial records.

---

## 🎥 Live Dashboard Overview

<p align="center">
  <img src="./client/public/preview.gif" width="800" style="border-radius:12px; box-shadow:0 0 10px #0003;" />
</p>

<p align="center">
  <i>Admin → Accountant → Clerk dashboards preview</i>
</p>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔐 Security & Access
- **Role-Based Access Control**
- Separate dashboards for each role
- JWT Authentication
- Secure password hashing

</td>
<td width="50%">

### 💰 Sales & POS
- **Point of Sale System**
- Invoice generation
- Transaction management
- Payment tracking

</td>
</tr>
<tr>
<td width="50%">

### 📊 Financial Management
- **Accounting Module**
- Income & expense tracking
- Profit reports
- Financial analytics

</td>
<td width="50%">

### 🚘 Inventory & Customers
- **Vehicle Management**
- Customer database
- Purchase history
- Stock monitoring

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, React Router, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Styling** | CSS (Custom Responsive Styling) |
| **Tools** | Postman, Git, VS Code, JWT Auth |

---

## 📦 Key Backend Dependencies

<details>
<summary>Click to expand dependencies</summary>

| Package | Purpose | Version |
|--------|---------|---------|
| **bcryptjs** | Secure password hashing | ![npm](https://img.shields.io/npm/v/bcryptjs?style=flat-square) |
| **jsonwebtoken** | Token-based authentication | ![npm](https://img.shields.io/npm/v/jsonwebtoken?style=flat-square) |
| **validator** | Validate and sanitize input | ![npm](https://img.shields.io/npm/v/validator?style=flat-square) |
| **morgan** | Log incoming requests | ![npm](https://img.shields.io/npm/v/morgan?style=flat-square) |
| **multer** | Image / file upload handling | ![npm](https://img.shields.io/npm/v/multer?style=flat-square) |
| **mongoose** | MongoDB schema modeling | ![npm](https://img.shields.io/npm/v/mongoose?style=flat-square) |
| **cors** | Allow frontend → backend communication | ![npm](https://img.shields.io/npm/v/cors?style=flat-square) |
| **dotenv** | Load environment variables | ![npm](https://img.shields.io/npm/v/dotenv?style=flat-square) |

</details>

---

## 🎨 Key Frontend Dependencies

<details>
<summary>Click to expand dependencies</summary>

| Package | Purpose | Version |
|--------|---------|---------|
| **axios** | API communication requests | ![npm](https://img.shields.io/npm/v/axios?style=flat-square) |
| **react-router-dom** | SPA navigation & routing | ![npm](https://img.shields.io/npm/v/react-router-dom?style=flat-square) |
| **lucide-react** | Modern icons | ![npm](https://img.shields.io/npm/v/lucide-react?style=flat-square) |
| **recharts** | Analytics & Dashboard charts | ![npm](https://img.shields.io/npm/v/recharts?style=flat-square) |
| **react-toastify** | Success / Error notifications | ![npm](https://img.shields.io/npm/v/react-toastify?style=flat-square) |
| **classnames** | Conditional styling utility | ![npm](https://img.shields.io/npm/v/classnames?style=flat-square) |

</details>

---

## 📁 Folder Structure
```
mern-pos-vehicles/
├── 📂 client/                 # React Frontend
│   └── src/
│       ├── 🧩 components/     # UI Components (for each role)
│       ├── 🔄 context/        # React Context Providers
│       ├── 📄 pages/          # Accountant, Clerk, Admin Pages
│       ├── 🎨 styles/         # CSS Stylesheets (Custom Responsive)
│       └── 📦 package.json
│
├── 📂 server/                 # Express + Node Backend
│   ├── 📊 models/             # Mongoose Schemas
│   ├── 🛣️ routes/             # API Endpoints
│   ├── 🎮 controllers/        # Business Logic
│   ├── ⚙️ config/             # Database Connection
│   ├── 🔐 middleware/         # Auth & Validation Middleware
│   └── 📦 package.json
│
└── 📝 README.md
```

---

## 🚀 Getting Started

<details open>
<summary><b>📋 Installation Steps</b></summary>

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Mohammadsoleiman/mern-pos-vehicles.git
cd mern-pos-vehicles
```

### 2️⃣ Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Environment Variables

Inside the `/server` folder, create a `.env` file and add:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application
```bash
# Run backend
cd server
npm run dev

# Run frontend (in a new terminal)
cd ../client
npm run dev
```

Then visit: 👉 **http://localhost:5173**

</details>

---

## 📊 Future Enhancements

<div align="center">

| Feature | Status | Priority |
|---------|--------|----------|
| 🔄 Real-time synchronization | 🔜 Planned | High |
| 🧾 Printable PDF reports | 🔜 Planned | High |
| 📦 Stock alerts | 🔜 Planned | Medium |
| 🧠 AI predictions | 💡 Idea | Low |
| 🌐 Docker deployment | 💡 Idea | Medium |

</div>

---
## 👨‍💻 About the Developer

<div align="center">

<img src="https://avatars.githubusercontent.com/Mohammadsoleiman" width="200" style="border-radius: 50%; border: 4px solid #6366f1; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);" />

<br/><br/>

### Mohammad Soleiman
**Full-Stack Developer — MERN Stack**

Focused on building real business systems with clean structure & meaningful logic.

🌍 Saida, Lebanon  
📩 Always learning, improving, shipping solutions.

<br/>

### 🔗 Connect With Me

<a href="https://github.com/Mohammadsoleiman">
  <img src="https://img.shields.io/badge/GitHub-View_Profile-111?style=for-the-badge&logo=github" />
</a>

<a href="https://www.linkedin.com/in/mohammad-suleiman" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<a href="mailto:mohammadsoleiman6@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
</a>

</div>

---

<p align="center">
  <i>"I build systems designed to scale — clean structure, meaningful logic, and real-world value."</i>
</p>

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Mohammadsoleiman/mern-pos-vehicles/issues).

<div align="center">

### Show your support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by [Mohammad Soleiman](https://github.com/Mohammadsoleiman)

</div>