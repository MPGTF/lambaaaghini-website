import nodemailer from "nodemailer";

interface MarketingProposal {
  // Contact Information
  name: string;
  email: string;
  company: string;
  role: string;
  telegram: string;
  twitter: string;

  // Proposal Details
  proposalTitle: string;
  proposalType: string;
  description: string;
  targetAudience: string;
  duration: string;
  budget: string;
  expectedResults: string;

  // Marketing Channels
  channels: string[];
  primaryChannel: string;

  // Timeline & Deliverables
  startDate: string;
  timeline: string;
  deliverables: string;
  metrics: string;

  // Additional Information
  previousWork: string;
  whyLambaaaghini: string;
  additionalInfo: string;

  // Submission info
  paymentMade: boolean;
  submissionTime: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your-app-password",
      },
    });
  }

  async sendMarketingProposal(proposal: MarketingProposal): Promise<boolean> {
    try {
      const emailHtml = this.formatProposalEmail(proposal);

      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@lambaaaghini.com",
        to: "lambaaaghini@gmail.com",
        subject: `🐑 Marketing Proposal: ${proposal.proposalTitle} - ${proposal.company}`,
        html: emailHtml,
        replyTo: proposal.email,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Marketing proposal email sent:", info.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send marketing proposal email:", error);
      return false;
    }
  }

  private formatProposalEmail(proposal: MarketingProposal): string {
    const paymentStatus = proposal.paymentMade
      ? "✅ PAID (0.1 SOL)"
      : "❌ NO PAYMENT (Posted Publicly)";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #f97316; background: #fef7f0; }
        .section h3 { color: #dc2626; margin-top: 0; }
        .field { margin-bottom: 10px; }
        .field strong { color: #7c2d12; }
        .payment-status { padding: 10px; border-radius: 5px; font-weight: bold; }
        .paid { background: #dcfce7; color: #166534; }
        .unpaid { background: #fef2f2; color: #991b1b; }
        .footer { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🐑 LAMBAAAGHINI Marketing Proposal</h1>
        <p>New marketing proposal submission received!</p>
      </div>

      <div class="payment-status ${proposal.paymentMade ? "paid" : "unpaid"}">
        Payment Status: ${paymentStatus}
      </div>

      <div class="section">
        <h3>👤 Contact Information</h3>
        <div class="field"><strong>Name:</strong> ${proposal.name}</div>
        <div class="field"><strong>Email:</strong> ${proposal.email}</div>
        <div class="field"><strong>Company:</strong> ${proposal.company}</div>
        <div class="field"><strong>Role:</strong> ${proposal.role || "Not specified"}</div>
        <div class="field"><strong>Telegram:</strong> ${proposal.telegram || "Not provided"}</div>
        <div class="field"><strong>Twitter/X:</strong> ${proposal.twitter || "Not provided"}</div>
      </div>

      <div class="section">
        <h3>📋 Proposal Details</h3>
        <div class="field"><strong>Title:</strong> ${proposal.proposalTitle}</div>
        <div class="field"><strong>Type:</strong> ${proposal.proposalType}</div>
        <div class="field"><strong>Description:</strong><br>${proposal.description.replace(/\n/g, "<br>")}</div>
        <div class="field"><strong>Target Audience:</strong> ${proposal.targetAudience}</div>
        <div class="field"><strong>Duration:</strong> ${proposal.duration}</div>
        <div class="field"><strong>Budget:</strong> ${proposal.budget}</div>
        <div class="field"><strong>Expected Results:</strong><br>${proposal.expectedResults.replace(/\n/g, "<br>")}</div>
      </div>

      <div class="section">
        <h3>📢 Marketing Channels</h3>
        <div class="field"><strong>Channels:</strong> ${proposal.channels.join(", ")}</div>
        <div class="field"><strong>Primary Channel:</strong> ${proposal.primaryChannel}</div>
      </div>

      <div class="section">
        <h3>📅 Timeline & Deliverables</h3>
        <div class="field"><strong>Start Date:</strong> ${proposal.startDate}</div>
        <div class="field"><strong>Timeline:</strong><br>${proposal.timeline.replace(/\n/g, "<br>")}</div>
        <div class="field"><strong>Deliverables:</strong><br>${proposal.deliverables.replace(/\n/g, "<br>")}</div>
        <div class="field"><strong>Success Metrics:</strong><br>${proposal.metrics.replace(/\n/g, "<br>")}</div>
      </div>

      <div class="section">
        <h3>💼 Additional Information</h3>
        <div class="field"><strong>Previous Work:</strong><br>${proposal.previousWork.replace(/\n/g, "<br>")}</div>
        <div class="field"><strong>Why LAMBAAAGHINI:</strong><br>${proposal.whyLambaaaghini.replace(/\n/g, "<br>")}</div>
        ${proposal.additionalInfo ? `<div class="field"><strong>Additional Info:</strong><br>${proposal.additionalInfo.replace(/\n/g, "<br>")}</div>` : ""}
      </div>

      <div class="footer">
        <p><strong>Submission Time:</strong> ${proposal.submissionTime}</p>
        <p><strong>Reply To:</strong> ${proposal.email}</p>
        <p>🐑🚗 This proposal was submitted through the LAMBAAAGHINI marketing proposals form.</p>
      </div>
    </body>
    </html>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}
