'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Palette as ColorIcon } from '@phosphor-icons/react/dist/ssr/Palette';
import { SunHorizon as SeasonIcon } from '@phosphor-icons/react/dist/ssr/SunHorizon';
import { Tote as CollectionIcon } from '@phosphor-icons/react/dist/ssr/Tote';
import { Ruler as SizeIcon } from '@phosphor-icons/react/dist/ssr/Ruler';
import { TShirt as MaterialIcon } from '@phosphor-icons/react/dist/ssr/TShirt';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from '@/paths';
import { clothingsApi } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';

interface PageHeadingProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeading = ({ title, actions }: PageHeadingProps) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
    <Typography variant="h4">{title}</Typography>
    {actions}
  </Stack>
);

export default function ClothingPage(): React.JSX.Element {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(true);
  const [counts, setCounts] = React.useState({
    colors: 0,
    seasons: 0,
    collections: 0
  });

  React.useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const [colors, seasons, collections] = await Promise.all([
          clothingsApi.getColors(),
          clothingsApi.getSeasons(),
          clothingsApi.getCollections()
        ]);

        setCounts({
          colors: colors.length,
          seasons: seasons.length,
          collections: collections.length
        });
      } catch (error) {
        console.error('Error fetching clothing attributes:', error);
        enqueueSnackbar('Failed to load clothing attributes', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [enqueueSnackbar]);

  const clothingAttributes = [
    {
      title: 'Colors',
      description: 'Manage clothing colors',
      icon: <ColorIcon size={32} />,
      href: paths.admin.clothingColors,
      count: counts.colors,
    },
    {
      title: 'Seasons',
      description: 'Manage clothing seasons',
      icon: <SeasonIcon size={32} />,
      href: paths.admin.clothingSeasons,
      count: counts.seasons,
    },
    {
      title: 'Collections',
      description: 'Manage clothing collections',
      icon: <CollectionIcon size={32} />,
      href: paths.admin.clothingCollections,
      count: counts.collections,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading title="Clothing Management" />
          
          <Grid container spacing={3}>
            {clothingAttributes.map((attribute) => (
              <Grid item xs={12} sm={6} md={4} key={attribute.title}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                    },
                    boxShadow: 2,
                    borderRadius: 2,
                  }}
                  onClick={() => router.push(attribute.href)}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: 'primary.lightest',
                          borderRadius: 2,
                          color: 'primary.main',
                          display: 'flex',
                          height: 48,
                          justifyContent: 'center',
                          width: 48,
                        }}
                      >
                        {attribute.icon}
                      </Box>
                    }
                    title={
                      <Typography variant="h6" component="div">
                        {attribute.title}
                      </Typography>
                    }
                    action={
                      isLoading ? (
                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : (
                        <Typography 
                          variant="h6" 
                          component="div" 
                          sx={{ 
                            backgroundColor: 'primary.lightest',
                            borderRadius: '50%',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            fontWeight: 600,
                            mr: 1
                          }}
                        >
                          {attribute.count}
                        </Typography>
                      )
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {attribute.description}
                    </Typography>
                    <Button
                      color="primary"
                      size="small"
                      variant="text"
                      endIcon={<ArrowRightIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(attribute.href);
                      }}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
} 