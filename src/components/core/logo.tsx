'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  return (
    <Box 
      alt="logo" 
      component="img" 
      height={height} 
      src="/assets/Neged.png" 
      width="auto"
      sx={{ objectFit: 'contain' }}
    />
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo height={height} width={width} {...props} />
    </NoSsr>
  );
}
