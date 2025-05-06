import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { 
  FacebookLogo, 
  InstagramLogo, 
  TelegramLogo, 
  LinkedinLogo, 
  TwitterLogo, 
  SnapchatLogo,
  Phone,
  Envelope,
  MapPin
} from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';

export const metadata = {
  title: 'NIGED-EASE | Contact Us',
  description: 'Get in touch with our team for any inquiries about our Ethiopian business management solution',
};

export default function ContactPage(): React.JSX.Element {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1.5
                }}
              />
              <Typography 
                component="span" 
                variant="h6" 
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Home
              </Typography>
            </Link>
            <Link href="/features" style={{ textDecoration: 'none' }}>
              <Typography 
                component="span" 
                variant="body1" 
                sx={{ ml: 4, cursor: 'pointer', color: 'text.primary' }}
              >
                Features
              </Typography>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Typography 
                component="span" 
                variant="body1" 
                sx={{ ml: 4, cursor: 'pointer', color: 'primary.main', fontWeight: 600 }}
              >
                Contact
              </Typography>
            </Link>
          </Box>
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mr: 2, borderRadius: 1, px: 3 }}
              component={Link}
              href={paths.auth.signUp}
            >
              Register
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ borderRadius: 1, px: 3 }}
              component={Link}
              href={paths.auth.signIn}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          background: 'linear-gradient(to right, #e0f2fe, #dbeafe)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Get in Touch
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Have questions about our services or need support? Our team is here to help you get the most out of NIGED-EASE.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                  Send us a Message
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email Address"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="What are you contacting us about?"
                      fullWidth
                      variant="outlined"
                      defaultValue="general"
                    >
                      <MenuItem value="general">General Inquiry</MenuItem>
                      <MenuItem value="sales">Sales Question</MenuItem>
                      <MenuItem value="support">Technical Support</MenuItem>
                      <MenuItem value="partnership">Partnership Opportunity</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      fullWidth
                      required
                      variant="outlined"
                      multiline
                      rows={5}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 600
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ height: '100%' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                  Contact Information
                </Typography>
                
                <Stack spacing={4}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        display: 'flex', 
                        p: 1.5,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        borderRadius: 2
                      }}
                    >
                      <Phone size={24} weight="fill" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        +251933778687
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monday to Friday, 9am to 6pm EAT
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        display: 'flex', 
                        p: 1.5,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        borderRadius: 2
                      }}
                    >
                      <Envelope size={24} weight="fill" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        Email
                      </Typography>
                      <Typography variant="body1">
                        Contact@nigedease.com
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        We'll respond as soon as possible
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        display: 'flex', 
                        p: 1.5,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        borderRadius: 2
                      }}
                    >
                      <MapPin size={24} weight="fill" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        Office
                      </Typography>
                      <Typography variant="body1">
                        Bole Sub City, Addis Ababa
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ethiopia
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
                
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Link href="#" aria-label="Facebook" style={{ color: '#1877F2' }}>
                      <FacebookLogo size={28} weight="fill" />
                    </Link>
                    <Link href="#" aria-label="Instagram" style={{ color: '#E4405F' }}>
                      <InstagramLogo size={28} weight="fill" />
                    </Link>
                    <Link href="#" aria-label="Telegram" style={{ color: '#0088cc' }}>
                      <TelegramLogo size={28} weight="fill" />
                    </Link>
                    <Link href="#" aria-label="LinkedIn" style={{ color: '#0A66C2' }}>
                      <LinkedinLogo size={28} weight="fill" />
                    </Link>
                    <Link href="#" aria-label="Twitter" style={{ color: '#1DA1F2' }}>
                      <TwitterLogo size={28} weight="fill" />
                    </Link>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Map Section */}
      <Box sx={{ mb: 8 }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f0f9ff'
            }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
              Map will be integrated here
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: '#f8fafc', 
        borderTop: '3px solid #06b6d4',
        py: 6 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Logo Section - Left */}
            <Grid item xs={12} md={4}>
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                sx={{
                  width: 200,
                  height: 'auto'
                }}
              />
            </Grid>
            
            {/* Navigation Links - Middle */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body1" fontWeight={500}>
                    Home
                  </Typography>
                </Link>
                <Link href="/features" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body1" fontWeight={500}>
                    Features
                  </Typography>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body1" fontWeight={500}>
                    Contact
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            {/* Contact Information - Right */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Email: Contact@nigedease.com
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Phone: +251933778687
              </Typography>
              
              {/* Social Icons */}
              <Stack direction="row" spacing={3}>
                <Link href="#" aria-label="Facebook" style={{ color: '#1877F2' }}>
                  <FacebookLogo size={24} weight="fill" />
                </Link>
                <Link href="#" aria-label="Instagram" style={{ color: '#E4405F' }}>
                  <InstagramLogo size={24} weight="fill" />
                </Link>
                <Link href="#" aria-label="Telegram" style={{ color: '#0088cc' }}>
                  <TelegramLogo size={24} weight="fill" />
                </Link>
                <Link href="#" aria-label="LinkedIn" style={{ color: '#0A66C2' }}>
                  <LinkedinLogo size={24} weight="fill" />
                </Link>
                <Link href="#" aria-label="Twitter" style={{ color: '#1DA1F2' }}>
                  <TwitterLogo size={24} weight="fill" />
                </Link>
                <Link href="#" aria-label="Snapchat" style={{ color: '#FFFC00' }}>
                  <SnapchatLogo size={24} weight="fill" />
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 