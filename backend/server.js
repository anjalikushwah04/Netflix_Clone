// import express from 'express';
// import cookieParser from 'cookie-parser';
// import authRoutes from './routes/auth.route.js'
// import movieRoutes from './routes/movie.route.js'
// import tvRoutes from './routes/tv.route.js'
// import searchRoutes from './routes/search.route.js'
// import { ENV_VARS } from './config/envVars.js';
// import {connectDB} from './config/db.js';
// import { protectRoute } from './middleware/protectRoute.js';
// import path from 'path';

// const app = express();

// const PORT=ENV_VARS.PORT;
// const __dirname=path.resolve();

// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/movie',protectRoute, movieRoutes);
// app.use('/api/v1/tv', protectRoute, tvRoutes);
// app.use('/api/v1/search', protectRoute, searchRoutes);



// if(ENV_VARS.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
//     })

// }

// app.listen(PORT,()=>{
//     console.log("Server started at http://localhost:" + PORT);
//     connectDB();
// });


 
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import tvRoutes from './routes/tv.route.js';
import searchRoutes from './routes/search.route.js';
// import passwordRoutes from './routes/password.route.js'; // Import password routes
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';
import path from 'path';


// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
// import crypto from 'crypto';

const app = express();
const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();


// dotenv.config();
// const app = express();
// const PORT = 8000;

// app.use(cors());
// app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);

// const users = [{ email: 'anjali@example.com', id: 1 }];
// const resetTokens = new Map();

if (ENV_VARS.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}


// app.post('/api/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   const user = users.find(u => u.email === email);

//   if (!user) return res.status(404).json({ message: 'Email not found' });

//   const token = crypto.randomBytes(32).toString('hex');
//   const resetLink = `http://localhost:3000/reset-password/${token}`;
//   resetTokens.set(token, { email, expires: Date.now() + 15 * 60 * 1000 });

//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: 'Reset Your Password',
//       html: `<p>Click to reset: <a href="${resetLink}">${resetLink}</a></p>`,
//     });

//     res.json({ message: 'Reset link sent!' });
//   } catch (err) {
//     res.status(500).json({ message: 'Email send failed' });
//   }
// });

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  connectDB();
});


