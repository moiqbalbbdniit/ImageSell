import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    await connectToDatabase();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      // FIX: Find by Order ID, not Payment ID
      // Razorpay sends 'order_id' inside the payment entity
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id }, 
        {
          status: "completed",
          razorpayPaymentId: payment.id, // Now we save the payment ID
        },
        { new: true } // Return the updated document
      ).populate([
        { path: "productId", select: "name" },
        { path: "userId", select: "email name" },
      ]);

      if (order) {
        const transporter = nodemailer.createTransport({
          service: "sandbox.smtp.mailtrap.io", // accurate for Mailtrap
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER!,
            pass: process.env.MAILTRAP_PASS!,
          },
        });

        await transporter.sendMail({
          from: '"Iqbal Project" <no-reply@iqbalsir.com>',
          to: order.userId.email,
          subject: "Order Confirmation",
          html: `
            <h2>Thank you for your order, ${order.userId.name}!</h2>
            <p>Your order has been successfully processed.</p>
            <p>Product: ${order.productId.name}</p>
            <p>Amount Paid: ₹${order.amount}</p>
          `,
        });
      } else {
          console.error("Order not found for Razorpay Order ID:", payment.order_id);
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return NextResponse.json({ status: "error", message: "Internal Server Error" }, { status: 500 });
  }
}