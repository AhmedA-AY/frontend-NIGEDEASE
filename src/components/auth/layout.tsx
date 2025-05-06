import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Building, ChartBar, ShieldCheck } from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flex: '1 1 auto', 
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Logo Area */}
        <Box 
          sx={{ 
            p: 4, 
            display: 'flex', 
            alignItems: 'center',
          }}
        >
          <Box 
            component={RouterLink} 
            href={paths.home} 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box 
              component="img"
              src="/assets/Neged.png"
              alt="NIGED-EASE Logo"
              sx={{
                width: 40,
                height: 40,
                mr: 1.5,
              }}
            />
            <Typography 
              variant="h5" 
              component="span" 
              color="text.primary" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: 0.5,
              }}
            >
              NIGED-EASE
            </Typography>
          </Box>
        </Box>

        {/* Form Container */}
        <Box 
          sx={{ 
            alignItems: 'center', 
            display: 'flex', 
            flex: '1 1 auto', 
            justifyContent: 'center', 
            p: 4,
          }}
        >
          <Box 
            sx={{ 
              maxWidth: '450px', 
              width: '100%',
              p: { xs: 3, sm: 4 },
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: { xs: 'none', sm: '0 8px 40px rgba(0, 0, 0, 0.1)' },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/* Right Side Illustration */}
      <Box
        sx={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0c2461 0%, #1e3799 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url("/assets/grid-pattern.svg")',
            zIndex: 0,
          }}
        />

        <Stack spacing={6} sx={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <Stack spacing={2}>
            <Typography 
              color="inherit" 
              sx={{ 
                fontSize: '36px', 
                lineHeight: 1.2, 
                fontWeight: 700,
                textAlign: 'center',
              }} 
              variant="h1"
            >
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  display: 'block',
                  mx: 'auto',
                  mb: 2
                }}
              />
              Manage Your Business with{' '}
              <Box component="span" sx={{ color: '#4cd3c2' }}>
                NIGED-EASE
              </Box>
            </Typography>
            <Typography 
              align="center" 
              variant="h6"
              sx={{ 
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              The ultimate business management solution built for Ethiopian businesses
            </Typography>
          </Stack>

          <Stack spacing={4}>
            {[
              {
                icon: <Building size={32} weight="fill" />,
                title: 'Business-Focused',
                description: 'Tailored specifically for the Ethiopian business environment and its unique challenges.'
              },
              {
                icon: <ShieldCheck size={32} weight="fill" />,
                title: 'Secure & Reliable',
                description: 'Enterprise-level security with 99.9% uptime to keep your business running smoothly.'
              },
              {
                icon: <ChartBar size={32} weight="fill" />,
                title: 'Comprehensive Analytics',
                description: 'Make data-driven decisions with powerful reporting and visualization tools.'
              }
            ].map((feature, index) => (
              <Box 
                key={index}
                sx={{
                  display: 'flex',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box 
                  sx={{ 
                    mr: 2,
                    color: '#4cd3c2',
                    display: 'flex',
                    alignItems: 'flex-start',
                    pt: 0.5,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
