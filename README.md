# ThinkNotes 📝

ThinkNotes is a modern full-stack note-taking application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows users to securely create, manage, update, and organize their notes through a clean and responsive interface.

## 🚀 Features

* User Authentication and Authorization
* Create New Notes
* Edit Existing Notes
* Delete Notes
* Secure REST APIs
* Responsive User Interface
* MongoDB Database Integration
* Real-time Note Management
* Clean and Modern Design

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Router
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)

## 📂 Project Structure

```bash
ThinkNotes/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Pranay0714/ThinkNotes.git
cd ThinkNotes
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Environment Variables

Create a `.env` file in the backend directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

> Never commit your `.env` file to GitHub.

## 📸 Screenshots

Add screenshots of your application here.

### Home Page

![Home Page](screenshots/home.png)

### Notes Dashboard

![Dashboard](screenshots/dashboard.png)

## 🔗 API Endpoints

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |
| GET    | /api/notes         | Get All Notes |
| POST   | /api/notes         | Create Note   |
| PUT    | /api/notes/:id     | Update Note   |
| DELETE | /api/notes/:id     | Delete Note   |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pranay**

GitHub: https://github.com/Pranay0714

---

⭐ If you found this project useful, consider giving it a star on GitHub.
