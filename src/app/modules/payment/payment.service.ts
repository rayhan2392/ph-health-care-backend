import Stripe from "stripe";
import { prisma } from "../../shared/prisma.js";
import { PaymentStatus } from "../../../generated/client/browser.js";


const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            console.log("payment is successful");
            const session = event.data.object as any;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            console.log(appointmentId,paymentId);

            await prisma.appointment.update({
                where: {
                    id: appointmentId
                },
                data: {
                    paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })

            await prisma.payment.update({
                where: {
                    id: paymentId
                },
                data: {
                    status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    
                }
            })

            break;
        }

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
};

export const PaymentService = {
    handleStripeWebhookEvent
}