import express from "express";
import connection from "./src/config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";


dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


//Error Middleware
app.use(errorMiddleware);


const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("API IS RUNNING...")
});

const startServer = async () => {
    await connection();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();