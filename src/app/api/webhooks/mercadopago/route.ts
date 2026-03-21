import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const dataId = searchParams.get("data.id");

    console.log(`Mercado Pago Webhook received: type=${type}, id=${dataId}`);

    if (type === "payment" && dataId) {
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: dataId });

      if (paymentData.status === "approved") {
        const reservationId = paymentData.external_reference;

        if (reservationId) {
            console.log(`Payment approved for reservation: ${reservationId}`);
            
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { status: "PAID" }
            });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Mercado Pago Webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
