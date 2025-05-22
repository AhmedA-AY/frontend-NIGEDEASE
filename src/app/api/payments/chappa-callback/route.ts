import { NextRequest, NextResponse } from 'next/server';
import { renewCompanySubscription } from '@/api/companies';

// Chappa secret key - should be stored in environment variables in production
const CHAPPA_SECRET_KEY = 'CHASECK-xPGKrQgZ0et6TiaKc25xEsUfk4IwQYRA';

/**
 * Handles Chappa payment callback
 * @param request The NextRequest object
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const payload = await request.json();
    
    console.log('Chappa callback received:', payload);
    
    // Verify the transaction with Chappa (implement this in production)
    // const verificationResult = await verifyChappaTransaction(payload.tx_ref);
    
    // For now, assume transaction is valid if we get a callback
    if (payload.status === 'success') {
      const companyId = payload.meta?.company_id;
      const planId = payload.meta?.plan_id;
      
      if (companyId && planId) {
        // Process subscription renewal
        await renewCompanySubscription(companyId, planId);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Payment processed successfully' 
        });
      } else {
        console.error('Missing company_id or plan_id in callback metadata');
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required metadata' 
        }, { status: 400 });
      }
    } else {
      console.error('Payment was not successful:', payload.status);
      return NextResponse.json({ 
        success: false, 
        error: 'Payment was not successful' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * Verifies a transaction with Chappa
 * This is a placeholder - implement actual verification in production
 */
async function verifyChappaTransaction(txRef: string) {
  try {
    // In production, call Chappa's verification API:
    // const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
    //   headers: {
    //     'Authorization': `Bearer ${CHAPPA_SECRET_KEY}`
    //   }
    // });
    // return response.json();
    
    // For now, return a mock successful verification
    return {
      status: 'success',
      data: {
        tx_ref: txRef,
        status: 'success'
      }
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
} 