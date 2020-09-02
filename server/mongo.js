let mongoose=require("mongoose");
const dotenv=require("dotenv")
dotenv.config()
const contactSchema=mongoose.Schema({
    name: String,
    number: Number
})

contactSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v
    }
})

const Contact=mongoose.model("Contact",contactSchema)

const password=process.env.PASSWORD
const url=`mongodb+srv://fullStackOpen:${password}@cluster0.ccqhp.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).catch(e=>{
    if(e.code===8000)console.log('Wrong password. Remember, the passwors should be the first argument!', e.message)
});

module.exports=mongoose.model("Contact", contactSchema)