'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  TextField,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { QrCode as QrCodeIcon } from '@phosphor-icons/react/dist/ssr/QrCode';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';

export default function InvoiceVerificationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    if (url) {
      formData.append('url', url);
    }
    if (selectedFile) {
      formData.append('pdf_file', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:5000/process_invoice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        enqueueSnackbar('Invoice processed successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(data.error || 'Failed to process invoice', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error processing invoice:', error);
      enqueueSnackbar('Failed to process invoice', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const startQrScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowQrScanner(true);
        scanQrCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      enqueueSnackbar('Failed to access camera', { variant: 'error' });
    }
  };

  const stopQrScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowQrScanner(false);
  };

  const scanQrCode = () => {
    if (!showQrScanner || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setUrl(code.data);
        stopQrScanner();
        enqueueSnackbar('QR code detected successfully', { variant: 'success' });
      } else {
        requestAnimationFrame(scanQrCode);
      }
    } else {
      requestAnimationFrame(scanQrCode);
    }
  };

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowLeftIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4">
            Invoice Verification
          </Typography>
        </Box>

        <Card>
          <CardHeader title="Process Invoice" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Invoice URL"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/invoice.pdf"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={startQrScanner}>
                          <QrCodeIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                  >
                    Upload PDF File
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </Button>
                  {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {selectedFile.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading || (!url && !selectedFile)}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Process Invoice'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            {showQrScanner && (
              <Box sx={{ mt: 3, position: 'relative' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={stopQrScanner}
                  sx={{ mt: 2 }}
                >
                  Stop Scanner
                </Button>
              </Box>
            )}

            {result && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Extracted Information
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(result).map(([key, value]) => (
                        value !== null && (
                          <TableRow key={key}>
                            <TableCell component="th" scope="row">
                              {key.replace(/_/g, ' ').toUpperCase()}
                            </TableCell>
                            <TableCell>{value as string}</TableCell>
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 