# Experience Booking Web App

A full-stack booking platform where users can browse experiences, select available slots, apply promo codes, and confirm bookings.  
Built using **Next.js**, **Express.js**, **TypeScript**, and **MongoDB**.

- **🌐 Hosted Application:** [book-with-hd.vercel.app](https://book-with-hd.vercel.app)

---

## 🧩 Features

- Browse experiences with images, descriptions, and pricing  
- Select date/time slots dynamically  
- Apply promo codes and calculate discounts in real time  
- Responsive UI built with Tailwind CSS  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript  
- **Backend:** Express.js, TypeScript, Mongoose (MongoDB)  
- **Hosting:** Frontend on Vercel • Backend on Render

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vansh-vm04/book-it.git
```
2️⃣ Install Dependencies
### For backend
```bash
cd backend
npm install
```


### For frontend
```bash
cd ../frontend
npm install
```
3️⃣ Configure Environment Variables
Create the following files:

/baskend/.env
```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/book-it
NODE_ENV=development
APP_BASE_URL=http://localhost:4000
FRONTEND_ORIGIN = http://localhost:3000
```
/frontend/.env
```bash
NEXT_PUBLIC_BACKEND_ORIGIN=http://localhost:4000
```

4️⃣ Run the Application

### Start backend
```bash
npm run dev
```

### Start frontend
```bash
npm run dev
```
The app will run at http://localhost:3000

---

### ✅ Deliverables Checklist
 Freely available data and royalty-free images

 Full booking flow, browsing to confirmation

 Hosted on cloud (Render, Vercel)

 Complete setup and run instructions in README