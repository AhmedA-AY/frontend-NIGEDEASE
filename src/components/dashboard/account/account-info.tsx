'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { UserInfo } from '@/hooks/use-auth';
import { authApi } from '@/services/api/auth';

interface AccountInfoProps {
  user: UserInfo | null;
  onProfileUpdate?: () => Promise<void>;
}

export function AccountInfo({ user, onProfileUpdate }: AccountInfoProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(user?.profile_image);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Loading...';
  const email = user?.email || '';
  const role = user?.role || '';
  
  // Format role for display
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'stock_manager': return 'Stock Manager';
      case 'salesman': return 'Salesman';
      default: return role;
    }
  };
  
  // Update preview URL when user prop changes
  React.useEffect(() => {
    if (user?.profile_image) {
      setPreviewUrl(user.profile_image);
    }
  }, [user]);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      setUploadError(null);
      
      await authApi.updateProfileImage(selectedFile);
      
      // Refresh user data to get updated profile image
      if (onProfileUpdate) {
        await onProfileUpdate();
      }
      
      setUploadSuccess(true);
      setSelectedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      
      // Display more specific error messages
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          errorMessage = 'Upload endpoint not found. Please contact support.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid image format or data. Please try a different image.';
        } else if (error.response.status === 413) {
          errorMessage = 'Image file is too large. Please use a smaller image.';
        } else if (error.response.data && error.response.data.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something happened in setting up the request that triggered an error
        errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCloseError = () => {
    setUploadError(null);
  };

  return (
    <Card>
      <CardHeader title="Profile Information" />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                src={selectedFile ? previewUrl : user?.profile_image} 
                sx={{ height: '80px', width: '80px', mb: 1 }}
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Avatar>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                aria-label="Upload profile picture"
              />
              
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleButtonClick}
                  disabled={isUploading}
                >
                  Change Photo
                </Button>
                
                {selectedFile && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpload}
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={16} /> : null}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {displayName}
            </Typography>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {email}
            </Typography>
            <Typography color="primary" variant="body2" sx={{ mb: 1 }}>
              {getRoleDisplay(role)}
            </Typography>
            
            {uploadSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Profile image updated successfully!
              </Alert>
            )}
          </Grid>
        </Grid>
      </CardContent>
      
      <Snackbar open={!!uploadError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {uploadError}
        </Alert>
      </Snackbar>
    </Card>
  );
}
