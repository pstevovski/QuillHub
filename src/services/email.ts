import handleErrorMessage from "@/utils/handleErrorMessage";
import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";

export const EMAIL_TEMPLATES_PASSWORD_RESET = (token: string): string => {
  return `
  <div>
    <h1>Quillhub</h1>
    <p><em>Unfold Your Imagination, Share Your Universe</em></p>
    <h3>You have requested password reset for your accout</h3>
    <br/>
    <a href="${process.env.NEXT_PUBLIC_EMAIL_REDIRECT_URL}/auth/reset-password?token=${token}">Click here to reset your password</a>
    <br/>
    <br/>
    <br/>
    <hr/>
    <p>If you did not request password reset for your account, please ignore this email.</p>
  </div>
  `;
};

class Email {
  private transporter: Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: '"Quillhub" info@quillhub.com',
        to,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(`Failed sending email: ${errorMessage}`);
      throw new Error("Failed sending email!");
    }
  }
}

const EmailService = new Email();

export default EmailService;
