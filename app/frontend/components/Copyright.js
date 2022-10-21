import { Typography } from '@mui/material';
import * as React from 'react';

export default function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        Dan's Frappuccino Paradise
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }