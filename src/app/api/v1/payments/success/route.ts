import { PaymentController } from "@/modules/payments/payment.controller";

// SSLCommerz success URL এ POST মেথডে হিট করে
export const POST = PaymentController.handleSuccess;