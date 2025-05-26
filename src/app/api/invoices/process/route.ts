import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const url = formData.get('url');
    const pdfFile = formData.get('pdf_file');
    
    // For now, return mock data
    // In a real implementation, you would process the invoice using an external service
    
    if (!url && !pdfFile) {
      return NextResponse.json(
        { error: 'Either URL or PDF file is required' }, 
        { status: 400 }
      );
    }
    
    // Mock successful response
    return NextResponse.json({
      invoice_number: 'INV-12345',
      date: '2023-10-15',
      total_amount: '1,250.00 ETB',
      supplier: 'ABC Company Ltd.',
      tax_amount: '187.50 ETB',
      currency: 'ETB',
      payment_status: 'Paid',
      items_count: '5'
    });
    
  } catch (error: any) {
    console.error('Invoice processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process invoice' }, 
      { status: 500 }
    );
  }
} 