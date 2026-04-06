AI-Powered Notes Application

This is a full-stack Notes application with AI features.
It is built using Next.js (frontend) and Node.js (backend), along with a PostgreSQL database.

The main goal of this project is to help users manage notes and use AI to summarize, improve, and organize their content easily.

This project was developed as a technical Proof of Concept (POC) for Peacock India.

Live Links

Frontend (Live App):
https://ai-notes-app-shivamjha7250s-projects.vercel.app

Backend API:
https://ai-notes-app-spdl.onrender.com

Test Credentials

You can use the following credentials to test the application:

Email: testuser@example. register email
Password: resister time

You can also register with your own email and test the OTP system.

Features
1. AI Features
Summarize notes using AI
Improve grammar and clarity
Generate tags automatically
2. Authentication
Secure login and registration
Email OTP verification
JWT-based authentication
3. Notes Management
Create notes
Edit notes
Delete notes
View all notes
4. Search
Search notes by title
Instant filtering
5. UI/UX
Clean and modern interface
Responsive design (mobile, tablet, desktop)
Smooth user experience
Tech Stack
Frontend
Next.js (App Router)
Tailwind CSS
Axios
Lucide Icons
Backend
Node.js
Hono / Express-style API
Prisma ORM
PostgreSQL
Nodemailer (for OTP emails)
Groq API (for AI features)
How to Run Locally
1. Clone the project
git clone https://github.com/shivamjha7250/ai-notes-app.git
cd ai-notes-app
2. Backend Setup

Create a .env file inside /backend:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
GROQ_API_KEY=your_api_key
PORT=5000

Install and run:

cd backend
npm install
npx prisma generate
npm run dev
3. Frontend Setup

Create a .env.local file inside /frontend:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Install and run:

cd frontend
npm install
npm run dev
Project Structure (Simple)
Frontend sends requests to /api
Backend handles logic and authentication
Prisma connects to PostgreSQL database
AI features handled through Groq API
Notes stored and updated in database
Deployment
Frontend is deployed on Vercel
Backend is deployed on Render
Database is hosted online (PostgreSQL)
Developer

Shivam Kumar Jha

Final Note

This project demonstrates:

Full-stack development
API integration
Authentication system
AI feature implementation
Clean UI and responsive design
