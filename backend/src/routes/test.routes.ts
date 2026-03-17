import express from "express";
import { Request, Response } from "express";
import {
  sendSubmissionEmail,
  sendConfirmationEmail,
  sendRejectionEmail,
} from "../services/email.service";
import { Booking } from "@prisma/client";

const router = express.Router();

router.post("/test-email", async (req: Request, res: Response) => {
  const { type, email } = req.body;

  const targetEmail = "ebenezerflintwoodbrace@gmail.com";

  const sampleBooking: any = {
    id: "test-id",
    bookingReference: "WC-TEST-12345",
    fullName: "Ebenezer Flintwood Brace",
    email: targetEmail,
    phone: "+233 123 456 789",
    passportNumber: "G1234567",
    passportExpiry: new Date("2030-01-01"),
    packageType: "double_game",
    accommodationType: "hotel",
    numberOfTravelers: 2,
    specialRequests: "Window seat if possible",
    paymentAccountType: "international",
    basePackagePrice: 3000.0,
    addonsTotalPrice: 0.0,
    totalAmount: 3000.0,
    paymentProofUrl: "https://example.com/payment.jpg",
    bookingStatus: "pending",
    rejectionReason: null,
    submittedAt: new Date(),
    confirmedAt: null,
    confirmedBy: null,
    updatedAt: new Date(),
  };

  try {
    switch (type) {
      case "confirmation":
        await sendConfirmationEmail(sampleBooking);
        break;
      case "rejection":
        await sendRejectionEmail(
          sampleBooking,
          "The payment proof provided could not be verified. Please re-upload a clear receipt.",
        );
        break;
      case "submission":
      default:
        await sendSubmissionEmail(sampleBooking);
        break;
    }

    res.json({
      success: true,
      message: `Test email (${type || "submission"}) sent to ${targetEmail}`,
      sampleData: sampleBooking,
    });
  } catch (error: any) {
    console.error("Test email failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

// //////////////////////////// Endpoint Details ////////////////////////////
// Method: POST
// URL: http://localhost:5000/api/test/test-email (Adjust the port if your backend runs on a different one, e.g., 3001)
// Headers: Content-Type: application/json
// Request Body
// You can specify the type of email you want to test:

// json
// {
//   "type": "submission",
//   "email": "ebenezerflintwwodbrace@gmail.com"
// }
// Template Options (type)
// "submission": The initial booking receipt email.
// "confirmation": The email sent when a booking is approved.
// "rejection": The email sent when a booking is rejected.
