import client from "prom-client";
import express from "express"
import { metricsMiddleware } from "./metrics";
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(metricsMiddleware)
app.use(cors());

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.get("/user", async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.send({
        ...user,
        id: 1,
    });
});
app.get('/marketplace/getmostpopularproducts/:time', async(req, res) => {
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getmostpopularproducts"
    })
});
app.get('/marketplace/getnewestproducts/:time', async(req, res) => {
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getnewestproducts"
    })
});
app.get('/marketplace/getproducts/:time', async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getproducts"
    })
})

app.get('/marketplace/createpayment/:time', async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to createpayment"
    })
})
app.get('/marketplace/checkout/:time', async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to createpayment"
    })
})
app.get('/marketplace/download/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to download"
    })
})
app.get('/admin/salesdata/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin salesdata"
    })
})
app.get('/admin/userdata/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin userdata"
    })
})
app.get('/admin/productdata/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin productdata"
    })
})
app.get('/admin/orderdata/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin orderdata"
    })
})
app.get('/myorderdata/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  user orderdata"
    })
})

app.get('/admin/deleteproduct/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin deleteProduct"
    })
})
app.get('/admin/addproduct/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    })
})

app.get('/admin/productavailabilty/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    })
})
app.get('/admin/productupdate/:time',async(req,res)=>{
    const time = parseInt(req.params.time);
    await new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    })
})


app.listen(3000, ()=>{
    console.log(`Monitoring server is listening at port 3000`);
})
