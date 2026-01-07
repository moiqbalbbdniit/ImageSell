import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { IProduct } from "@/types/product";
import NextAuth, { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();
    if(!products|| products.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const data:IProduct = await request.json();

        if(!data.name || !data.description || !data.imageUrl || !data.variants || data.variants.length === 0) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newProduct = await Product.create(data);
        return NextResponse.json(newProduct, { status: 201 });
        

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

