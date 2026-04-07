import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-template';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, cc, subject, template, data } = body;

    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, template' },
        { status: 400 }
      );
    }

    const result = await sendEmail(to, cc || '', subject, template, data || {});

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}