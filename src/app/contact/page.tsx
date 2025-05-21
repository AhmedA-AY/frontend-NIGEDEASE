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
                Features
              </Typography>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
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
          background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)',
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
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
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
                background: 'linear-gradient(90deg, #6366F1 0%, #14B8A6 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
              }}
            >
              Get in Touch With Us
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
              Have questions about our services or need support? Our team is here to help you get the most out of NIGED-EASE for your Ethiopian business needs.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
        }}>
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid 
              item 
              xs={12} 
              md={7}
              sx={{
                animation: 'fadeInLeft 0.8s ease-out',
                '@keyframes fadeInLeft': {
                  from: { 
                    opacity: 0,
                    transform: 'translateX(-30px)'
                  },
                  to: { 
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: 4,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%',
                  '&:hover': {
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.75rem', md: '2.25rem' }
                  }}
                >
                  Send us a Message
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          height: 56,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          height: 56,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email Address"
                      fullWidth
                      required
                      variant="outlined"
                      type="email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          height: 56,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          height: 56,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="What are you contacting us about?"
                      fullWidth
                      variant="outlined"
                      defaultValue="general"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366F1',
                            borderWidth: 1,
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: 'primary.main'
                        }
                      }}
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
                        borderRadius: 2.5,
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
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                          boxShadow: '0 5px 10px rgba(99, 102, 241, 0.2)',
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Contact Info */}
            <Grid 
              item 
              xs={12} 
              md={5}
              sx={{
                animation: 'fadeInRight 0.8s ease-out',
                '@keyframes fadeInRight': {
                  from: { 
                    opacity: 0,
                    transform: 'translateX(30px)'
                  },
                  to: { 
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            >
              <Box sx={{ height: '100%' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    background: 'linear-gradient(90deg, #6366F1 0%, #14B8A6 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Contact Information
                </Typography>
                
                <Stack spacing={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.05)',
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mr: 3, 
                        display: 'flex', 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366F1',
                      }}
                    >
                      <Phone size={24} weight="duotone" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        +251 11 123 4567
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        +251 91 234 5678
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        background: 'rgba(20, 184, 166, 0.05)',
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mr: 3, 
                        display: 'flex', 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(20, 184, 166, 0.1)',
                        color: '#14B8A6',
                      }}
                    >
                      <Envelope size={24} weight="duotone" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        info@niged-ease.com
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        support@niged-ease.com
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      p: 2,
                      borderRadius: 3,
                      '&:hover': {
                        background: 'rgba(244, 63, 94, 0.05)',
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mr: 3, 
                        display: 'flex', 
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(244, 63, 94, 0.1)',
                        color: '#F43F5E',
                      }}
                    >
                      <MapPin size={24} weight="duotone" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Office
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Churchill Avenue
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Addis Ababa, Ethiopia
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
                
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {[
                      { icon: <FacebookLogo weight="fill" />, color: '#1877F2' },
                      { icon: <InstagramLogo weight="fill" />, color: '#E4405F' },
                      { icon: <TelegramLogo weight="fill" />, color: '#0088CC' },
                      { icon: <TwitterLogo weight="fill" />, color: '#1DA1F2' },
                      { icon: <LinkedinLogo weight="fill" />, color: '#0A66C2' }
                    ].map((item, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: item.color,
                          bgcolor: `${item.color}15`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 5px 15px ${item.color}33`,
                          }
                        }}
                      >
                        {item.icon}
                      </Box>
                    ))}
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