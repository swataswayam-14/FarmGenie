"use server"

import axios from "axios";

export async function getMostPopularProductsMetrics (duration: any) {
    await axios.get(`http://localhost:3000/marketplace/getmostpopularproducts/${duration}`)
}
export async function getNewestProductsMetrics(duration:any) {
    await axios.get(`http://localhost:3000/marketplace/getnewestproducts/${duration}`)
}
export async function getProductsMetrics(duration:any) {
    await axios.get(`http://localhost:3000/marketplace/getproducts/${duration}`)
}
export async function createPaymentMetrics(duration:any) {
    await axios.get(`http://localhost:3000/marketplace/createpayment/${duration}`)
}
export async function checkoutMetrics(duration:any) {
    await axios.get(`http://localhost:3000/marketplace/checkout/${duration}`)
}
export async function downloadMetrics(duration:any) {
    await axios.get(`http://localhost:3000/marketplace/download/${duration}`)
}
export async function salesMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/salesdata/${duration}`)
}
export async function userMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/userdata/${duration}`)
}
export async function productMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/productdata/${duration}`)
}
export async function orderMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/orderdata/${duration}`)
}
export async function myorderMetrics(duration:any) {
    await axios.get(`http://localhost:3000/myorderdata/${duration}`)
}
export async function adminDeleteProductMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/deleteproduct/${duration}`)
}
export async function adminAddProductMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/addproduct/${duration}`)
}
export async function adminProductAvailableMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/productavailabilty/${duration}`)
}
export async function adminUpdateProductMetrics(duration:any) {
    await axios.get(`http://localhost:3000/admin/productupdate/${duration}`)
}