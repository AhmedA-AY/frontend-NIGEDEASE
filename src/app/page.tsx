import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { 
  ArrowRight, 
  FacebookLogo, 
  InstagramLogo, 
  TelegramLogo, 
  LinkedinLogo, 
  TwitterLogo, 
  SnapchatLogo
} from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';

export const metadata = {
  title: 'NIGED-EASE | Business Management',
  description: 'Modern business management solution for Ethiopian businesses',
};

export default function LandingPage(): React.JSX.Element {
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
                sx={{ ml: 4, cursor: 'pointer', color: 'text.primary' }}
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
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '70%',
            height: '100%',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
            borderBottomLeftRadius: '50%',
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 550 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3,
                    color: 'text.primary',
                  }}
                >
                  Simplifying Ethiopian Business Operations
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 3,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                >
                  From the small stuff to the big picture, organizes the work so teams know what to do, why it matters, and how to get it done.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 1,
                    px: 4, 
                    py: 1.5,
                    fontWeight: 600,
                    bgcolor: '#3b82f6',
                    '&:hover': {
                      bgcolor: '#2563eb'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1.5,
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', md: '2rem' }
                }}
              >
                This past year achievement
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 2  
                }}
              >
                With our super powers we have reached this
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 24, 
                        bgcolor: 'primary.main', 
                        borderRadius: 1, 
                        mr: 2 
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                      3,000+
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Visitors per day
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 24, 
                        bgcolor: '#8b5cf6', 
                        borderRadius: 1, 
                        mr: 2 
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                      20,000+
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Users
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 24, 
                        bgcolor: '#3b82f6', 
                        borderRadius: 1, 
                        mr: 2 
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                      500+
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Clients
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 24, 
                        bgcolor: '#8b5cf6', 
                        borderRadius: 1, 
                        mr: 2 
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                      6
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Countries
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f0fdfa', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: '10rem', 
                    color: '#0d9488', 
                    opacity: 0.2, 
                    position: 'absolute', 
                    top: -50, 
                    left: -20,
                    fontFamily: '"Georgia", serif'
                  }}
                >
                  "
                </Typography>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    position: 'relative', 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 2
                  }}
                >
                  Real Stories from Real Customers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get inspired by these stories.
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'white', 
                  borderRadius: 2, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: '#f97316', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    TD
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  "NegedEase has made our business management so much easier. The system helps us avoid overstocking and stockouts. We've cut hours of manual work, which lets us focus on the big ways."
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600}>
                  John Doe
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CEO, FekaStore
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'white', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ minWidth: 120, mb: { xs: 2, sm: 0 }, mr: { sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#f8fafc', 
                        borderRadius: 1, 
                        textAlign: 'center',
                        fontWeight: 700
                      }}
                    >
                      LogoIpsum
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      "NegedEase has transformed our Business process. It's user-friendly, scalable, and integrates smoothly with our other software. We've reduced errors and gained much better control over stock levels."
                    </Typography>
                    
                    <Typography variant="subtitle2" fontWeight={600}>
                      Abebe Kebede
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CEO, LogoIpsum
                    </Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'white', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'flex-start' }
                  }}
                >
                  <Box sx={{ minWidth: 120, mb: { xs: 2, sm: 0 }, mr: { sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: '#f8fafc', 
                        borderRadius: 1, 
                        textAlign: 'center',
                        fontWeight: 700
                      }}
                    >
                      LOGO
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      "NegedEase has improved our stock accuracy and order fulfillment, and the support team is always helpful. I feel confident managing our inventory now."
                    </Typography>
                    
                    <Typography variant="subtitle2" fontWeight={600}>
                      Jane Doe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Co-Founder, Loho
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Tailor-made features
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ maxWidth: 700, mx: 'auto', mb: 8, color: 'text.secondary' }}
          >
            NegedEase enables your business to run many different features in just one place, some of the features we have are:
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: "inventory_management",
                title: "Inventory Management",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              },
              {
                icon: "reporting",
                title: "Reporting",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              },
              {
                icon: "chatbot",
                title: "ChatBot",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              },
              {
                icon: "accounting",
                title: "Accounting",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              },
              {
                icon: "prediction",
                title: "Prediction",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              },
              {
                icon: "financing",
                title: "Financing",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat non heiusmod ipsum."
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2 
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 24, 
                        bgcolor: index % 2 === 0 ? '#3b82f6' : '#8b5cf6', 
                        borderRadius: 1, 
                        mr: 2 
                      }} 
                    />
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Screenshot Section */}
      <Box sx={{ bgcolor: '#06b6d4', py: { xs: 8, md: 12 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Sneak peak of our amazing system
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Manage all business in one place.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#06b6d4',
                  borderRadius: 1,
                  px: 4,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box 
                component="img"
                src="/assets/hero-image.png"
                alt="System Screenshot"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
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
