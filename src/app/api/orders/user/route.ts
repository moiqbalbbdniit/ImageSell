import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export async function GET(){
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        await connectToDatabase();
        const orders = await Order.find({userId: session.user.id}).populate({
            path: "productId",
            select: "name, imageUrl",
            options: {strictPopulate: false}

        })
        .sort({createdAt: -1})
        .lean()
        if(!orders){
            return NextResponse.json({error: "No orders found"}, {status: 404});
        }
        
        return NextResponse.json({orders}, {status: 200});


    } catch (error) {
        console.error("Error fetching user orders:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
} 