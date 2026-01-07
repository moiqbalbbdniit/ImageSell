import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: paymentId,
        status: "completed",
      },
      { new: true }
    ).populate([
      { path: "productId", select: "name" },
      { path: "userId", select: "email name" },
    ]);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const userName = order.userId.name || order.userId.email.split('@')[0] || "Valued Customer";
    // --- FIX IS HERE (Use 'host' instead of 'service') ---
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    await transporter.sendMail({
      from: '"Iqbal Shop" <no-reply@iqbalsir.com>',
      to: order.userId.email,
      subject: "Order Confirmation - Payment Successful",
      html: `
        <h2>Payment Successful!</h2>
        <p>Dear ${userName},</p>
        <p>We have received your payment of ₹${order.amount}.</p>
        <p><strong>Product:</strong> ${order.productId.name}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p>Thank you for shopping with us!</p>
      `,
    });

    return NextResponse.json(
      { message: "Payment verified and email sent", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}