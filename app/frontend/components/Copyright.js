import { Link, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Copyright(props) {
    const navigate = useNavigate();
  
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" onClick={() => navigate("/app/")}>
          Dan's Frappuccino Paradise
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }