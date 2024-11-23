import { Schema, model, Types } from "mongoose";

const volcanoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    elevation: {
        type: Number,
        required: true,
    },
    lastEruption: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    typeVolcano: {
        type: String,
        required: true,
        enum: ["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"], 
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',        
    },
    voteList: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
});

const Volcano = model('Volcano', volcanoSchema);

export default Volcano;