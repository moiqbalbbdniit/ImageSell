import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    // Registration logic will go here  
    try {
        const { email, password } = await request.json();
        if(!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }
        await connectToDatabase();
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        
        await User.create({ email, password,role:"user" });
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}