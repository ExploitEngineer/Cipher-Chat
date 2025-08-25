# 🔐 CipherChat

CipherChat is a **modern, secure, and real-time chat application** built for seamless messaging and an enhanced user experience. With a **Next.js** frontend powered by **shadcn/ui** and **TailwindCSS**, and a **Node.js + Express** backend integrated with **Socket.IO**, **JWT**, and **bcrypt**, CipherChat is designed for **speed, privacy, and scalability**.

---

## 🚀 Features

- **Real-Time Messaging** — Powered by **Socket.IO** for instant communication.
- **Secure Authentication** — Uses **JWT** and **bcrypt** for encrypted logins.
- **Modern UI/UX** — Built with **shadcn/ui** + **TailwindCSS** for a clean and responsive design.
- **Next.js Frontend** — Optimized for performance and smooth user experience.
- **Express.js Backend** — Fast and lightweight server-side architecture.
- **Scalable Structure** — Ready for adding more features like media sharing, groups, and more.

---

## 🛠 Tech Stack

### **Frontend:**

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

### **Backend:**

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [MongoDB](https://mongodb.com)
- [Mongoose](https://mongoose.com)

---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ExploitEngineer/Cipher-Chat.git
cd Cipher-Chat
```

### 2️⃣ Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

### 3️⃣ Create an **.env** file

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the development servers

#### Frontend

```bash
cd client
npm run dev
```

#### Backend

```bash
cd ../server
npm run dev
```

Your app will be live at: **[http://localhost:3000](http://localhost:3000)**

---

## 📡 Real-Time Communication

CipherChat uses **Socket.IO** for:

- Instant message delivery
- Typing indicators
- Online/offline status
- Room-based chats

---

## 🔒 Security Highlights

- Encrypted passwords using **bcrypt**
- JWT-based secure authentication
- Protected API routes
- Scalable session handling

---

## 🎯 Roadmap

- [ ] Media sharing support
- [ ] Group chats & channels
- [ ] Voice & video calls
- [ ] End-to-end encryption
- [ ] Push notifications

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to:

```bash
git fork https://github.com/ExploitEngineer/Cipher-Chat.git
```

Then submit a **pull request**.

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🌐 Connect

**Author:** ExploitEngineer
**GitHub:** [https://github.com/ExploitEngineer](https://github.com/ExploitEngineer)
