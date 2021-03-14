import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    pool: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    rateLimit: true,
    maxConnections: 1,
    maxMessages: 0.45
});

export async function sendMail(email, mail) {
    await transporter.sendMail({
        from: `"${process.env.FROM}" <${process.env.FROM_MAIL}>`,
        to: email,
        subject: mail.subject,
        html: mail.content,
        // text: "Hello world?", 
    });
}

export function closeConnection() {
    transporter.close();
}