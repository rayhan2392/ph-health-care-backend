import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { PaymentService } from "./payment.service.js";
import sendResponse from "../../shared/sendResponse.js";
import { stripe } from "../../helper/stripe.js";

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
      
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = "whsec_2cdb94d078b2a947e3bf43baf2cc7c4aa1b2be32e21ba12e24b9a1577f46af18"

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});

export const PaymentController = {
    handleStripeWebhookEvent
}