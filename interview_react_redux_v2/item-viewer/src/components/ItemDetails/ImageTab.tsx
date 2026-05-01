import React from 'react';
import { Paper, Box } from '@mui/material';
import { api } from '../../services/api';

interface ImageTabProps {
  guid: string;
}

export const ImageTab: React.FC<ImageTabProps> = ({ guid }) => {
  const imageUrl = api.getImageUrl(guid);

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        component="img"
        src={imageUrl}
        alt={`Item ${guid}`}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }}
      />
    </Paper>
  );
};
