import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  const {to, subject, text, html} = body;
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
  } as nodemailer.TransportOptions);

  // Define the email options
  const mailOptions = {
    from: 'no-reply@doucvse.cz', 
    to: to, 
    subject: subject, 
    text: text,
    html: html,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return new Response(JSON.stringify({ message: "Email sent successfully", info }), { status: 200 });
  } catch (error) {
    console.error("Error sending email: ", error);
    return new Response(JSON.stringify({ message: "Error sending email", error }), { status: 500 });
  }
}