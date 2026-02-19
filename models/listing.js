const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review")
const listingSchema=new Schema(
    {
        title:{
            type:String,
        },
        description:String,
        image: {
        url: {
            type: String,
           
        },
        filename: String,
    },
        price:{
            type:Number,
        },
        location:String,
        country:String,
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                  ref: "Review"
            }
        ],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
         geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], 
      required: true
    }}



    }

);
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
 await Review.deleteMany({_id:{$in:listing.reviews}});
}
    });
listingSchema.index({ geometry: '2dsphere' });

   
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
