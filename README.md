# 🚀 Team Task Management Web Application

A full-stack web application that enables teams to collaborate efficiently by creating projects, assigning tasks, and tracking progress.

---

## 📌 Features

### 🔐 Authentication

* User Signup & Login
* Password hashing using **bcrypt**
* Session-based authentication

### 📁 Project Management

* Create new projects
* Project creator becomes **Admin**
* Add/remove members (Admin only)
* View only assigned projects

### ✅ Task Management

* Create tasks with:

  * Title
  * Description
  * Due Date
  * Priority (Low, Medium, High)
* Assign tasks to users
* Update task status:

  * To Do
  * In Progress
  * Done

### 📊 Dashboard

* Total tasks count
* Tasks grouped by status
* Overdue tasks tracking

### 🔒 Role-Based Access

* **Admin (Project Creator):**

  * Manage members
  * Create/edit/delete tasks
* **Member:**

  * View assigned tasks
  * Update task status only

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, EJS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** Express Session + bcrypt

---

## 🗄️ Database Design

### 👤 User

* name
* email
* password

### 📁 Project

* name
* description
* createdBy (Admin)
* members (array of users)

### ✅ Task

* title
* description
* dueDate
* priority
* status
* projectId
* assignedTo

---

## 🔗 Relationships

* One user can be part of multiple projects
* One project can have multiple tasks
* Each task is assigned to one user

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/team-task-manager.git

# Navigate into the folder
cd team-task-manager

# Install dependencies
npm install

# Start the server
npm start
```

---

## 🌐 Environment Variables

Create a `.env` file in root:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

---

## ▶️ Run the App

Open browser and go to:

```
http://localhost:3000
```

---

## 📌 Main API Endpoints

### Auth

* POST `/auth/signup`
* POST `/auth/login`

### Projects


* GET `/`
* POST `/`
* POST `/:id`
* PUT `/:id`
* DELETE `/:id`



### Tasks

* POST `/tasks`
* PUT `/tasks/:id`
* DELETE `/tasks/:id`

---

## ⚠️ Validations & Error Handling

* Required field validation
* Duplicate email prevention
* Try-catch for async operations
* Proper error messages

---

## 🔐 Authorization Logic

* Project creator is treated as Admin
* Admin rights are scoped per project
* Members have restricted permissions

---

## 🚀 Future Enhancements

* Drag & drop task board (Kanban)
* Email notifications
* File attachments
* Real-time updates

---

## 👩‍💻 Author

**Likitha**

---

## ⭐ Note

This project was developed as part of a full-stack assignment to demonstrate backend, database design, and role-based access control concepts.
