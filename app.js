import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config()
const app = express();
app.use(express.json());

const foodSchema = new mongoose.Schema({
    FoodTitle: String,
    FoodCategory: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']
    },
    Price: Number
})

const Food = mongoose.model('food', foodSchema)

try {
    await mongoose.connect(process.env.DB_CONN)
    console.log("DB connection successfull!!")
}
catch {
    console.log("DB connection failed...")
}

app.post('/food', async function (req, res) {
    try {
        const { FoodTitle, FoodCategory, Price } = req.body;
        await Food.create({
            FoodTitle, FoodCategory, Price
        });
        res.status(201).json({ message: "New Food added" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
)


app.listen(8000, () => { console.log("Server is running...") })