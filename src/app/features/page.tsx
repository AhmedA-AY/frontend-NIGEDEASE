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
  ShoppingCart, 
  Package, 
  ChartBar, 
  Gear, 
  Users, 
  Briefcase,
  Receipt,
  Calculator,
  UsersThree,
  CloudArrowUp,
  FacebookLogo,
  InstagramLogo,
  TelegramLogo,
  LinkedinLogo,
  TwitterLogo,
  SnapchatLogo
} from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';

export const metadata = {
  title: 'NIGED-EASE | Features',
  description: 'Explore the powerful features of our Ethiopian business management solution',
};

export default function FeaturesPage(): React.JSX.Element {
  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '20%',
          height: '20%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '-5%',
          width: '25%',
          height: '25%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box 
        component="header" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}
      >
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
            justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                sx={{
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: '6px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(203, 213, 225, 0.3)',
                    objectFit: 'contain',
                    display: 'block',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                }}
              />
              <Typography 
                component="span" 
                variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  NIGED-EASE
                </Typography>
              </Link>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                ml: 6,
                gap: 4
              }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Typography 
                    component="span" 
                    variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'text.primary',
                      fontWeight: 500,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
              >
                Home
              </Typography>
            </Link>
            <Link href="/features" style={{ textDecoration: 'none' }}>
              <Typography 
                component="span" 
                variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'primary.main', 
                      fontWeight: 600,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                      }
                    }}
              >
                Features
              </Typography>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Typography 
                component="span" 
                variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'text.primary',
                      fontWeight: 500,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
              >
                Contact
              </Typography>
            </Link>
          </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
                sx={{ 
                  borderRadius: 2, 
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'all 0.6s ease',
                  },
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      left: '100%',
                    }
                  }
                }}
              component={Link}
              href={paths.auth.signIn}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '20%',
            background: 'url("/assets/wave-pattern.svg")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.4,
            zIndex: 0,
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%)',
            filter: 'blur(40px)',
            animation: 'pulse 8s infinite alternate ease-in-out',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.2 },
              '100%': { transform: 'scale(1.2)', opacity: 0.4 }
            }
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              textAlign: 'center',
              animation: 'fadeIn 1s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
              }}
            >
              Powerful Features for Ethiopian Businesses
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '85%',
                mx: 'auto',
                opacity: 0.9,
              }}
            >
              Our comprehensive business management platform offers everything Ethiopian businesses need to streamline operations, improve efficiency, and drive growth.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2.5, 
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'all 0.6s ease',
                },
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    left: '100%',
                  }
                }
              }}
              component={Link}
              href={paths.auth.signIn}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1, 
        }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Core Business Solutions
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: 8,
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            Discover the comprehensive set of tools designed specifically for Ethiopian businesses to streamline operations and boost productivity.
          </Typography>
          
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: 2 }}>
            {[
              {
                icon: <ShoppingCart size={44} weight="duotone" />,
                title: "Sales Management",
                description: "Track all sales activities, manage customer orders, generate invoices, and analyze sales performance with our intuitive sales management tools.",
                gradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)",
                iconColor: "#14B8A6"
              },
              {
                icon: <Package size={44} weight="duotone" />,
                title: "Inventory Control",
                description: "Keep track of your stock levels in real-time, set automatic reorder points, manage multiple warehouses, and optimize your inventory.",
                gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                iconColor: "#6366F1"
              },
              {
                icon: <ChartBar size={44} weight="duotone" />,
                title: "Financial Reporting",
                description: "Generate comprehensive financial reports including profit & loss statements, balance sheets, and cash flow statements to make informed decisions.",
                gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(251, 113, 133, 0.1) 100%)",
                iconColor: "#F43F5E"
              },
              {
                icon: <Users size={44} weight="duotone" />,
                title: "Customer Management",
                description: "Build stronger relationships with your customers through our CRM tools that help you track interactions, preferences, and purchase history.",
                gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(253, 186, 116, 0.1) 100%)",
                iconColor: "#EAB308"
              },
              {
                icon: <Receipt size={44} weight="duotone" />,
                title: "Invoicing & Billing",
                description: "Create professional invoices, set up recurring billing, and manage payment collection with our versatile invoicing features.",
                gradient: "linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                iconColor: "#0891B2"
              },
              {
                icon: <Briefcase size={44} weight="duotone" />,
                title: "Expense Tracking",
                description: "Monitor all business expenses, categorize spending, attach receipts, and generate expense reports for better financial control.",
                gradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                iconColor: "#10B981"
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box 
                  sx={{ 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `fadeInUp 0.6s ${index * 0.1}s both ease-out`,
                    '@keyframes fadeInUp': {
                      from: { 
                        opacity: 0,
                        transform: 'translateY(30px)'
                      },
                      to: { 
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    },
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: feature.gradient,
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      zIndex: 0,
                    },
                    '&:hover::before': {
                      opacity: 1,
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 3, 
                    color: feature.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 84,
                    height: 84,
                    borderRadius: '16px',
                    background: feature.gradient,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.4s ease',
                    transform: 'rotate(0deg)',
                    '&:hover': {
                      transform: 'rotate(5deg) scale(1.1)',
                    }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ position: 'relative', zIndex: 1 }}
                  >
                    {feature.description}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      mt: 3, 
                      display: 'flex', 
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1,
                      color: feature.iconColor,
                      fontWeight: 600,
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.4s ease',
                      '.MuiBox-root:hover &': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      }
                    }}
                  >
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: 'inherit', 
                        mr: 1, 
                        fontSize: '0.95rem', 
                        fontWeight: 'inherit' 
                      }}
                    >
                      Learn more
                    </Typography>
                    <ArrowRight size={18} weight="bold" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Additional Features Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.25rem' }
            }}
          >
            Additional Business Tools
          </Typography>
          
          <Grid container spacing={6}>
            {[
              {
                icon: <Gear size={32} />,
                title: "Customizable Workflow",
                description: "Tailor the system to match your specific business processes with customizable workflows, forms, and approval chains."
              },
              {
                icon: <UsersThree size={32} />,
                title: "Multi-user Access",
                description: "Set different permission levels for team members, allowing secure access to the information they need to perform their roles."
              },
              {
                icon: <Calculator size={32} />,
                title: "Tax Management",
                description: "Automatically calculate VAT and other taxes, generate tax reports, and prepare for Ethiopian tax regulations compliance."
              },
              {
                icon: <CloudArrowUp size={32} />,
                title: "Cloud-based Solution",
                description: "Access your business data securely from anywhere with our cloud-based platform, with automatic backups and updates."
              }
            ].map((tool, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    mr: 3,
                    p: 2,
                    bgcolor: 'primary.lighter',
                    borderRadius: 2,
                    color: 'primary.main'
                  }}>
                    {tool.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {tool.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tool.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box 
            sx={{ 
              textAlign: 'center',
              p: 5,
              borderRadius: 4,
              bgcolor: 'primary.lighter',
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
              Join hundreds of Ethiopian businesses that are streamlining their operations and growing with NIGED-EASE.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 600
                }}
                component={Link}
                href={paths.auth.signIn}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 600
                }}
                component={Link}
                href="/contact"
              >
                Contact Sales
              </Button>
            </Stack>
          </Box>
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
                  height: 'auto',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  padding: '10px',
                  border: '2px solid #06b6d4',
                  boxShadow: '0 6px 16px rgba(6, 182, 212, 0.15)',
                  objectFit: 'contain',
                  display: 'block',
                  mb: { xs: 2, md: 0 }
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