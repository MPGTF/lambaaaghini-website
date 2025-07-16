import express from "express";
import { EmailService } from "../services/emailService";

const router = express.Router();
const emailService = new EmailService();

// Send marketing proposal email
router.post("/send-proposal", async (req, res) => {
  try {
    const { proposalData, paymentMade } = req.body;

    if (!proposalData) {
      return res.status(400).json({
        success: false,
        error: "Proposal data is required",
      });
    }

    // Add submission metadata
    const proposalWithMeta = {
      ...proposalData,
      paymentMade: paymentMade || false,
      submissionTime: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    const success = await emailService.sendMarketingProposal(proposalWithMeta);

    if (success) {
      res.json({
        success: true,
        message: "Marketing proposal email sent successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to send email",
      });
    }
  } catch (error: any) {
    console.error("Email sending failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email",
      details: error.message,
    });
  }
});

// Test email connection
router.get("/test-connection", async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();

    res.json({
      success: isConnected,
      message: isConnected
        ? "Email service is working"
        : "Email service connection failed",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to test email connection",
      details: error.message,
    });
  }
});

export { router as emailRouter };
