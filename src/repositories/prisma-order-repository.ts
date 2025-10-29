import {Prisma} from "@prisma/client";
import { prisma } from "@/lib/prisma.js";

export class PrismaOrderRepository{
    async create (data : Prisma.OrdersCreateInput){
        const order = await prisma.orders.create({
            data,
        })
        return order;
    }

    async getAllOrders(){
        return await prisma.orders.findMany({
            select:{
                id: true,
                sender_client_id: true,
                receiver_client_id: true,
                status_id: true,
                vehicle_id: true,
            },
        });
    }
    async getOrder(id: number){
        const order = await prisma.orders.findUnique({
            where:{
                id,
            },
        });
        return order;
    }

    async deleteOrder(id: number){
        const order =  await prisma.orders.delete({
            where:{
                id,
            },
        });
        return order;
    }
}