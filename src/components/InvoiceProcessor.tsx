import * as React from 'react';
import { 
  QrCode,
  Link,
  Upload,
  CheckCircle,
  XCircle,
  Camera
} from '@phosphor-icons/react/dist/ssr';
import jsQR from 'jsqr';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface InvoiceData {
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  swift_code?: string;
  email?: string;
  tel?: string;
  fax?: string;
  tin?: string;
  vat_receipt_no?: string;
  vat_registration_no?: string;
  vat_registration_date?: string;
  customer_name?: string;
  region?: string;
  sub_city?: string;
  wereda_kebele?: string;
  customer_vat_registration_no?: string;
  customer_vat_registration_date?: string;
  customer_tin?: string;
  branch?: string;
  payer_name?: string;
  payer_account?: string;
  receiver_name?: string;
  receiver_account?: string;
  payment_date_time?: string;
  reference_no?: string;
  service_type?: string;
  transferred_amount?: string;
  commission_charge?: string;
  vat_on_commission?: string;
  total_amount?: string;
  amount_in_words?: string;
}

export default function InvoiceProcessor() {
  const [tabValue, setTabValue] = React.useState(0);
  const [url, setUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
    setInvoiceData(null);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Create a canvas element to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Get image data for QR code scanning
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setUrl(code.data);
          } else {
            setError('No QR code found in the image');
          }
        }
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access camera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOpen]);

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setUrl(code.data);
          setIsCameraOpen(false);
        }
      }
    }
  };

  // Start scanning when camera is open
  React.useEffect(() => {
    let scanningInterval: NodeJS.Timeout;
    
    if (isCameraOpen) {
      scanningInterval = setInterval(scanQRCode, 100);
    }

    return () => {
      if (scanningInterval) {
        clearInterval(scanningInterval);
      }
    };
  }, [isCameraOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL or upload an image');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setInvoiceData(null);

    try {
      const formData = new FormData();
      formData.append('url', url);

      const response = await fetch('http://127.0.0.1:5001/process_invoice', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Invoice processed successfully');
        setInvoiceData(result.data);
      } else {
        setError(result.error || 'Failed to process invoice');
      }
    } catch (err) {
      setError('An error occurred while processing the invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInvoiceData = () => {
    if (!invoiceData) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Company Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(invoiceData)
                    .filter(([key]) => ['country', 'city', 'address', 'postal_code', 'swift_code', 'email', 'tel', 'fax', 'tin', 'vat_receipt_no', 'vat_registration_no', 'vat_registration_date'].includes(key))
                    .map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                        </Typography>
                        <Typography variant="body2">{value || 'N/A'}</Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(invoiceData)
                    .filter(([key]) => ['customer_name', 'region', 'sub_city', 'wereda_kebele', 'customer_vat_registration_no', 'customer_vat_registration_date', 'customer_tin', 'branch'].includes(key))
                    .map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                        </Typography>
                        <Typography variant="body2">{value || 'N/A'}</Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Payment Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(invoiceData)
                    .filter(([key]) => ['payer_name', 'payer_account', 'receiver_name', 'receiver_account', 'payment_date_time', 'reference_no', 'service_type', 'transferred_amount', 'commission_charge', 'vat_on_commission', 'total_amount', 'amount_in_words'].includes(key))
                    .map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                        </Typography>
                        <Typography variant="body2">{value || 'N/A'}</Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Invoice Processor
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab 
            icon={<Link size={24} />} 
            label="URL Input" 
            iconPosition="start"
          />
          <Tab 
            icon={<QrCode size={24} />} 
            label="QR Code Scan" 
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter PDF URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !url}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 200 }}
            >
              Process Invoice
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<Upload />}
              >
                Upload Image
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
              <Button
                variant="contained"
                startIcon={<Camera />}
                onClick={() => setIsCameraOpen(true)}
              >
                Scan QR Code
              </Button>
            </Box>
            {previewUrl && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} 
                />
              </Box>
            )}
            {url && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2 }}
              >
                Process Invoice
              </Button>
            )}
          </Box>
        </TabPanel>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} icon={<XCircle />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
            {success}
          </Alert>
        )}

        {renderInvoiceData()}
      </Paper>

      {/* Camera Dialog */}
      <Dialog
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCameraOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 