"use client";

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import InvoiceProcessor from '@/components/InvoiceProcessor';

export default function InvoiceVerificationPage(): React.JSX.Element {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1
          }}
        >
          Invoice Verification
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verify and process invoices using QR codes or direct URL input
        </Typography>
      </Box>
      <InvoiceProcessor />
    </>
  );
} 