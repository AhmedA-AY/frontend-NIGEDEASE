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
                sx={{ ml: 4, cursor: 'pointer', color: 'primary.main', fontWeight: 600 }}
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
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
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
              Powerful Features for Ethiopian Businesses
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
              Our comprehensive business management platform offers everything Ethiopian businesses need to streamline operations, improve efficiency, and drive growth.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            {[
              {
                icon: <ShoppingCart size={40} />,
                title: "Sales Management",
                description: "Track all sales activities, manage customer orders, generate invoices, and analyze sales performance with our intuitive sales management tools."
              },
              {
                icon: <Package size={40} />,
                title: "Inventory Control",
                description: "Keep track of your stock levels in real-time, set automatic reorder points, manage multiple warehouses, and optimize your inventory."
              },
              {
                icon: <ChartBar size={40} />,
                title: "Financial Reporting",
                description: "Generate comprehensive financial reports including profit & loss statements, balance sheets, and cash flow statements to make informed decisions."
              },
              {
                icon: <Users size={40} />,
                title: "Customer Management",
                description: "Build stronger relationships with your customers through our CRM tools that help you track interactions, preferences, and purchase history."
              },
              {
                icon: <Receipt size={40} />,
                title: "Invoicing & Billing",
                description: "Create professional invoices, set up recurring billing, and manage payment collection with our versatile invoicing features."
              },
              {
                icon: <Briefcase size={40} />,
                title: "Expense Tracking",
                description: "Monitor all business expenses, categorize spending, attach receipts, and generate expense reports for better financial control."
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
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    mx: 'auto'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      textAlign: 'center'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                  >
                    {feature.description}
                  </Typography>
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
                href={paths.auth.signUp}
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