import CardComponent from "../components/CardComponent";
import { db } from "../db";
import { formatCurrency, formatNumber } from "../lib/formatter";

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: {pricePaidInCents: true},
        _count: true
    })
    return {
        amount: (data._sum.pricePaidInCents || 0)/100,
        numberOfSales: data._count
    }
}

async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum:{pricePaidInCents: true},
        }),
    ])
    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
    }
}

async function getProductData() {
    const [activeCount , inactiveCount] = await Promise.all([
        db.product.count({
            where:{
                isAvailableForPurchase:true
            }
        }),
        db.product.count({
            where:{
                isAvailableForPurchase:false
            }
        })
    ])
    return {activeCount, inactiveCount}
}

export default async function AdminDashboard(){
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardComponent
            title="Sales"
            subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
            desciption={formatCurrency(salesData.amount)}
        />
        <CardComponent
            title="Customers"
            subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
            desciption={`${formatNumber(userData.userCount)} customers`}
        />
        <CardComponent
            title="Active Products"
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
            desciption={formatNumber(productData.activeCount)}
        />
    </div>
}