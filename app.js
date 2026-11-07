import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';
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

async function conn() {

    try {
        await mongoose.connect(process.env.DB_CONN)
        console.log("DB connection successfull!!")
    }
    catch (err) {
        console.log(err)
    }
}

conn()

app.post('/food', async function (req, res) {
    try {
        const { FoodTitle, FoodCategory, Price } = req.body;
        await Food.create({
            FoodTitle, FoodCategory, Price
        });
        res.status(201).json({ message: "New Food added" })
    } catch (error) {
        console.error("ACTUAL ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
}
)

app.get('/foods/:FoodTitle', async function (req, res) {
    try {
        const { FoodTitle } = req.params
        const food = await Food.findOne({
            FoodTitle: FoodTitle
        })
        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            })
        }
        res.status(201).json({
            message: "Food details fetched",
            data: food
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.put('/food/:id', async function (req, res) {
    const { id } = req.params;
    const { FoodTitle, FoodCategory, Price } = req.body;

    try {
        const food = await Food.findByIdAndUpdate(
            id,
            {
                FoodTitle,
                FoodCategory,
                Price
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json({
            message: "Food updated successfully",
            data: food
        });

    } catch (err) {
        console.error(err);

        res.status(400).json({
            message: err.message
        });
    }
});

app.delete('/food/:id', async function(req,res){
    const {id} = req.params;
    try{
        const food = await Food.findByIdAndDelete(id);
        if(!food){
            res.status(400).json({
                message:"Food not found"
            })
        }
        res.status(201).json({
            message:"Food deleted successfully"
        })
    }
    catch(err){
        console.log(err)
        req.status(400).json({
            message:err.message
        })
    }
})

app.listen(8000, () => { console.log("Server is running...") })