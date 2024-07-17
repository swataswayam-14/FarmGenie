"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = __importDefault(require("prom-client"));
const express_1 = __importDefault(require("express"));
const metrics_1 = require("./metrics");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(metrics_1.metricsMiddleware);
app.use((0, cors_1.default)());
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const metrics = yield prom_client_1.default.register.metrics();
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(metrics);
}));
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, 5000));
    res.send({
        name: "John Doe",
        age: 25,
    });
}));
app.post("/user", (req, res) => {
    const user = req.body;
    res.send(Object.assign(Object.assign({}, user), { id: 1 }));
});
app.get('/marketplace/getmostpopularproducts/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getmostpopularproducts"
    });
}));
app.get('/marketplace/getnewestproducts/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getnewestproducts"
    });
}));
app.get('/marketplace/getproducts/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to getproducts"
    });
}));
app.get('/marketplace/createpayment/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to createpayment"
    });
}));
app.get('/marketplace/checkout/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to createpayment"
    });
}));
app.get('/marketplace/download/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to download"
    });
}));
app.get('/admin/salesdata/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin salesdata"
    });
}));
app.get('/admin/userdata/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin userdata"
    });
}));
app.get('/admin/productdata/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin productdata"
    });
}));
app.get('/admin/orderdata/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to admin orderdata"
    });
}));
app.get('/myorderdata/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  user orderdata"
    });
}));
app.get('/admin/deleteproduct/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin deleteProduct"
    });
}));
app.get('/admin/addproduct/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    });
}));
app.get('/admin/productavailabilty/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    });
}));
app.get('/admin/productupdate/:time', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = parseInt(req.params.time);
    yield new Promise((resolve) => setTimeout(resolve, time));
    res.json({
        msg: "request to  admin add Product"
    });
}));
app.listen(3000, () => {
    console.log(`Monitoring server is listening at port 5000`);
});
