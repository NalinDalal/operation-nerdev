import { NextRequest, NextResponse } from 'next/server';
import { sendInvoiceEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, data, currencySymbol, subtotal, discount, tax, total } = body;

    if (!to || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: to, data' },
        { status: 400 }
      );
    }

    const result = await sendInvoiceEmail(
      to,
      data,
      currencySymbol,
      subtotal,
      discount,
      tax,
      total
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}