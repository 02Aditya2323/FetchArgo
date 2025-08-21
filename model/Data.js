const mongoose=require("mongoose");

const ProfileSchema=new mongoose.Schema({
    temperature:{
        type:Number,
        required:true,
    },
    salinity:{
        type:Number,
        required:true,
    },
    pressure:{
        type:Number,
        required:true,
    },
})

const DataSchema=new mongoose.Schema({
    floatId:{ 
        type: Number,  
        required: true,
        unique:false,
    },
    cycle_number:{
        type: Number,
        required: true,
    },
    fetchedDate:{
        type: Date,
        default: Date.now,
    },
    location:{
        latitude:{
            type: Number,
            required: true,
        },
        longitude:{
            type: Number,
            required: true,
        }
    },
    profiles: [ProfileSchema]
}, {
    timestamps: true
});

// Add compound index to ensure unique combination of floatId and cycle_number
DataSchema.index({ floatId: 1, cycle_number: 1 }, { unique: true });

const Data = mongoose.model("Data", DataSchema);
module.exports = Data;