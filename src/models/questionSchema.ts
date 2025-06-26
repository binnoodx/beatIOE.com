import mongoose from "mongoose"
import { unique } from "next/dist/build/utils"

const questionSchema = new mongoose.Schema({

    seed:{
        type:String,
        required:true,
        unique:true
    },
    question: {
        type: String,
        required: false,
        default: "user"
    },
    options: {
        type: Array,
        required: true,
    },

    correctOption:{
        type:String

    },

    subject:{
        type:String
    },
    topic:{
        type:String
    },

    solved_by:{
        type:Number
    }

})

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema)
export default Question