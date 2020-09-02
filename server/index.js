const morgan=require("morgan")
const express = require("express")
const app = express()
const cors=require("cors")
const Contact=require("./mongo")

app.use(express.json())
app.use(cors())
// app.use(express.static("./build"))
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.method(req,res)=="POST"?JSON.stringify(req.body):""
    ].join(' ')
  }))
function errorHandler(error,req,res,next){
    console.log(error);
    res.status(400).send({error:"Non valid Id"})
    next(error)
}

app.get("/api/persons", (req, res) => {
    Contact.find({}).then(result=>{
        res.send(result)
    }).catch(e=>res.status(400).send(e));
})

app.get("/info", (req, res) => {
    Contact.find({}).then(result=>{
        res.send("Phonebook has info for " + result.length + " people.\n" + new Date())
    }).catch(e=>res.status(400).send(e));
    
})

app.get("/api/persons/:id", (req, res, next) => {
    let id = req.params.id;
    Contact.findById(id).then(contact=>{
        if (contact){
            res.json(contact)
        } else {
            res.status(404).end()
        }
    }).catch(e=>next(e))
})

app.delete("/api/persons/:id", (req, res) => {
    let id = req.params.id;
    Contact.findByIdAndDelete(id).then(result=>{
        res.status(204).end()
    })
    
})

app.post("/api/persons", (req, res) => {
    if(!req.body.name){
        return res.status(404).send({error:"a name must be provided"})
    }
    if(!req.body.number){
        return res.status(404).send({error:"a number must be provided"})
    }
    let contact=new Contact(req.body)
    contact.save().then(result=>{
    
    res.send(contact)})
})

app.put("/api/persons/:id",(req,res,next)=>{
    Contact.findByIdAndUpdate(req.params.id,{number:req.body.number},{new:true})
    .then(updated=>res.send(updated)).catch(e=>next(e))
})

app.use((req,res)=>{
    res.status(404).send({error: "unknown endpoint"})
})

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))