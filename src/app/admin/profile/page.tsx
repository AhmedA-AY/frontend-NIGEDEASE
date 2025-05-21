'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/providers/auth-provider';
import { authApi } from '@/services/api/auth';
import { paths } from '@/paths';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';

export default function ProfilePage() {
  const { userInfo } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profile = await authApi.getProfile();
        setProfileData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          profile_image: profile.profile_image || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        enqueueSnackbar('Failed to load profile data', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [enqueueSnackbar]);

  const validateForm = () => {
    const newErrors = {
      first_name: '',
      last_name: '',
      email: '',
      profile_image: '',
    };
    
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.profile_image && !/^https?:\/\/.+/.test(profileData.profile_image)) {
      newErrors.profile_image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setUpdateSuccess(false);
    
    try {
      const updatedProfile = await authApi.updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        profile_image: profileData.profile_image
      });
      
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      setUpdateSuccess(true);
      
      // Refresh page to show updated user info
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account settings and profile information
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <Typography>Loading profile information...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    src={profileData.profile_image}
                    sx={{
                      height: 100,
                      width: 100,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: 3
                    }}
                  >
                    {!profileData.profile_image && (
                      <UserIcon weight="bold" fontSize="3.5rem" />
                    )}
                  </Avatar>
                  <Typography variant="h6">
                    {profileData.first_name} {profileData.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileData.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {userInfo?.role?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card component="form" onSubmit={handleSubmit}>
                <CardHeader title="Edit Profile" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  {updateSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Your profile has been updated successfully.
                    </Alert>
                  )}
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Profile Image URL"
                        name="profile_image"
                        value={profileData.profile_image}
                        onChange={handleChange}
                        placeholder="https://example.com/your-image.jpg"
                        error={!!errors.profile_image}
                        helperText={errors.profile_image || "Enter a URL to your profile image"}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ color: 'text.secondary', mr: 1 }}>
                              <UploadSimpleIcon />
                            </Box>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <LoadingButton
                    color="primary"
                    loading={isSaving}
                    type="submit"
                    variant="contained"
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
} 