'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ArrowRight, CalendarCheck, Package } from '@phosphor-icons/react';

import { paths } from '@/paths';
import { useAuth } from '@/hooks/use-auth';
import { getCompanySubscription } from '@/api/companies';
import { getSubscriptionPlans } from '@/api/subscription-plans';
import { Subscription } from '@/types/subscription';
import { SubscriptionPlan } from '@/types/subscription-plan';

// Chappa payment configuration
const CHAPPA_PUBLIC_KEY = 'CHAPUBK-t3BlbKMJANkm4KpWctVQzIX5felitdOm';
const CHAPPA_PAYMENT_URL = 'https://api.chapa.co/v1/hosted/pay';

export default function SubscriptionPage() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewLoading, setRenewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const chappaFormRef = useRef<HTMLFormElement>(null);

  // Check URL parameters for payment success
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentSuccess = searchParams.get('success');
    const txRef = searchParams.get('tx_ref');
    
    if (paymentSuccess === 'true' && txRef) {
      setSuccess('Payment processed successfully. Your subscription has been renewed.');
      
      // Clear URL parameters without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh subscription data after successful payment
      if (userInfo?.company_id) {
        getCompanySubscription(userInfo.company_id)
          .then(subscriptionData => {
            setSubscription(subscriptionData);
          })
          .catch(err => {
            console.error('Error refreshing subscription data:', err);
          });
      }
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userInfo?.company_id) {
          setError('Company information not found');
          setLoading(false);
          return;
        }

        const [subscriptionData, plansData] = await Promise.all([
          getCompanySubscription(userInfo.company_id),
          getSubscriptionPlans()
        ]);

        setSubscription(subscriptionData);
        setSubscriptionPlans(plansData);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleRenewSubscription = () => {
    if (!userInfo?.company_id || !subscription?.plan_id) return;
    
    // Open payment dialog
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handleSubmitPayment = () => {
    if (chappaFormRef.current) {
      chappaFormRef.current.submit();
    }
  };

  const getCurrentPlan = () => {
    if (!subscription?.plan_id || !subscriptionPlans.length) return null;
    return subscriptionPlans.find(plan => plan.id === subscription.plan_id);
  };

  const generateTransactionRef = () => {
    return `nigedease-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const currentPlan = getCurrentPlan();
  const isExpired = subscription?.expiry_date ? new Date(subscription.expiry_date) < new Date() : false;
  const expiryDate = subscription?.expiry_date ? new Date(subscription.expiry_date) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Subscription Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {subscription ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Package size={32} />
                  <Typography variant="h5">Current Subscription</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Plan
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {currentPlan?.name || 'Unknown Plan'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      color={isExpired ? 'error.main' : daysLeft < 7 ? 'warning.main' : 'success.main'}
                    >
                      {isExpired ? 'Expired' : 'Active'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {subscription.start_date ? format(new Date(subscription.start_date), 'PPP') : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color={isExpired ? 'error.main' : daysLeft < 7 ? 'warning.main' : 'inherit'}
                    >
                      {expiryDate ? format(expiryDate, 'PPP') : 'N/A'}
                      {!isExpired && expiryDate && (
                        <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                          ({daysLeft} days left)
                        </Typography>
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Plan Features
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Max Products
                    </Typography>
                    <Typography variant="body1">
                      {currentPlan?.max_products || 'Unlimited'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Max Stores
                    </Typography>
                    <Typography variant="body1">
                      {currentPlan?.max_stores || 'Unlimited'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Max Users
                    </Typography>
                    <Typography variant="body1">
                      {currentPlan?.max_users || 'Unlimited'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Max Customers
                    </Typography>
                    <Typography variant="body1">
                      {currentPlan?.max_customers || 'Unlimited'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Storage Limit
                    </Typography>
                    <Typography variant="body1">
                      {currentPlan?.storage_limit ? `${currentPlan.storage_limit} GB` : 'Unlimited'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <CalendarCheck size={32} />
                  <Typography variant="h5">Subscription Actions</Typography>
                </Stack>

                {isExpired ? (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    Your subscription has expired. Please renew to continue using all features.
                  </Alert>
                ) : daysLeft < 7 ? (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Your subscription will expire soon. Consider renewing to avoid service interruption.
                  </Alert>
                ) : null}

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={renewLoading}
                    onClick={handleRenewSubscription}
                    startIcon={renewLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {renewLoading ? 'Processing...' : 'Renew Subscription'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    endIcon={<ArrowRight />}
                    onClick={() => router.push(paths.admin.profile)}
                  >
                    Manage Company Profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              No active subscription found for your company.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(paths.admin.profile)}
              endIcon={<ArrowRight />}
            >
              Manage Company Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chappa Payment Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" gutterBottom>
              You are about to renew your subscription for:
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {currentPlan?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Price: {currentPlan?.price || '0'} ETB
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
              Click "Proceed to Payment" to be redirected to the secure Chappa payment gateway.
            </Typography>

            {/* Hidden Chappa Payment Form */}
            <form 
              ref={chappaFormRef} 
              method="POST" 
              action={CHAPPA_PAYMENT_URL} 
              style={{ display: 'none' }}
            >
              <input type="hidden" name="public_key" value={CHAPPA_PUBLIC_KEY} />
              <input type="hidden" name="tx_ref" value={generateTransactionRef()} />
              <input type="hidden" name="amount" value={currentPlan?.price || '0'} />
              <input type="hidden" name="currency" value="ETB" />
              <input type="hidden" name="email" value={userInfo?.email || ''} />
              <input type="hidden" name="first_name" value={userInfo?.first_name || 'User'} />
              <input type="hidden" name="last_name" value={userInfo?.last_name || ''} />
              <input type="hidden" name="title" value={`Subscription Renewal - ${currentPlan?.name || 'Plan'}`} />
              <input type="hidden" name="description" value={`Renew subscription for ${currentPlan?.name || 'Plan'}`} />
              <input 
                type="hidden" 
                name="callback_url" 
                value={`${window.location.origin}/api/payments/chappa-callback`} 
              />
              <input 
                type="hidden" 
                name="return_url" 
                value={`${window.location.origin}/admin/subscription?success=true&tx_ref=${generateTransactionRef()}`} 
              />
              <input type="hidden" name="meta[company_id]" value={userInfo?.company_id || ''} />
              <input type="hidden" name="meta[plan_id]" value={subscription?.plan_id || ''} />
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitPayment}>
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 