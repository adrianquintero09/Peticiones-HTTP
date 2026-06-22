
const express =require("express")
require('dotenv').config()

const app=  express()
app.use (express.json())

const notas=[]

app.get("/search",(req , res)=>{
   const {q}=req.query
    res.status(200).json({notas})
})
app.post("/search/:nombre/:apellido",()=>{
    const {descricpion, estado} =req.body
    const {q}=req.params
    notas.push(descricpion,estado)

    res.json({})
})

app.post("/webhook/campaing",()=>{

})




// app.put()
// app.delete()

app.listen (process.env.PORT,()=>{
    console.log(`server: http://localhost:${process.env.PORT}`);
})