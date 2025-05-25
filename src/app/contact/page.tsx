'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Button,
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Stack,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { 
  Phone, 
  EnvelopeSimple, 
  MapPin, 
  InstagramLogo, 
  TwitterLogo, 
  FacebookLogo, 
  LinkedinLogo 
} from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';
import ContactForm from '@/components/contact/contact-form';

const ContactPage = () => {
  return (
    <Box 
      component="main" 
        sx={{
        flexGrow: 1, 
        py: 4, 
        backgroundColor: 'background.paper' 
        }}
      >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" paragraph>
              We'd love to hear from you! Reach out to our team with any questions.
            </Typography>
            </Grid>
            
            {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Phone size={24} />
                    <Typography variant="body1">+251 912 345 678</Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EnvelopeSimple size={24} />
                    <Typography variant="body1">info@niged-ease.com</Typography>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <MapPin size={24} />
                    <Typography variant="body1">Addis Ababa, Ethiopia</Typography>
                </Stack>
                
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary">
                      <FacebookLogo size={20} />
                    </IconButton>
                    <IconButton color="primary">
                      <TwitterLogo size={20} />
                    </IconButton>
                    <IconButton color="primary">
                      <InstagramLogo size={20} />
                    </IconButton>
                    <IconButton color="primary">
                      <LinkedinLogo size={20} />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
            </Grid>
          </Grid>
        </Container>
    </Box>
  );
};

export default ContactPage; 