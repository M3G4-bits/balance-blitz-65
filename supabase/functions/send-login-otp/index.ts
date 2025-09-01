import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoginOTPRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp }: LoginOTPRequest = await req.json();

    console.log(`Sending login OTP to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Credit Stirling Bank <onboarding@resend.dev>",
      to: [email],
      subject: "Your Login Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Credit Stirling Bank PLC</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Login Verification Code</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your one-time password (OTP) for logging into your account is:
            </p>
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This code will expire in 3 minutes. Do not share this code with anyone.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this code, please ignore this email or contact our support team.
            </p>
          </div>
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © 2024 Credit Stirling Bank PLC. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Login OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-login-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);