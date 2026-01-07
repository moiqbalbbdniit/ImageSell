import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest,props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;

        await connectToDatabase();

        const product = await Product.findById(id).lean();


        if(!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

