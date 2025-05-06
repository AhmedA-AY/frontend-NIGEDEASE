import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface PageHeadingProps {
  title: string;
  actions?: React.ReactNode;
}

export const PageHeading = ({ title, actions }: PageHeadingProps): React.JSX.Element => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
    <Typography variant="h4">{title}</Typography>
    {actions}
  </Stack>
); 