import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import userSchemaRoutes from "./routes/UserSchemaRoutes.js"
import dbRoutes from "./routes/databaseRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors"
import path from "path"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()


if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173"
    }))

    
}



app.use(express.json())

app.use(rateLimiter)

app.use("/api/product", notesRoutes);

app.use("/api/schemas", userSchemaRoutes);

app.use("/api/databases", dbRoutes);

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });

})


