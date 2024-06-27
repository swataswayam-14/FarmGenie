import { PrismaClient } from "@prisma/client";

console.log('inside db.ts');

const prismaClientSignleton = () =>{
    console.log('prisma client instantiated');
    
    return new PrismaClient();
}

declare global{
    var prisma: undefined | ReturnType<typeof prismaClientSignleton>
}

const prisma = globalThis.prisma ?? prismaClientSignleton()

export default prisma

if(process.env.NODE_ENV !== 'production') globalThis.prisma = prisma