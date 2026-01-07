import ImageKit from "imagekit";

import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(request: Request) {
    try {
        const authenthicationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenthicationParameters);
    } catch (error) {
        console.log("Error generating ImageKit auth parameters:", error);
        return NextResponse.json({ error: "Failed to generate auth parameters" }, { status: 500 });
    }

} 