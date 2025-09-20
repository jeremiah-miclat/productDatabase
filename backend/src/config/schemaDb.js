import mongoose from "mongoose"

export const connectSchemaDB = async () => {
    try {
     await mongoose.connect(process.env.MONGO_URI)
        console.log("SCHEMA DB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log("ERROR CONNECTING TO SCHEMA DB",error)
        process.exit(1)
    }
}