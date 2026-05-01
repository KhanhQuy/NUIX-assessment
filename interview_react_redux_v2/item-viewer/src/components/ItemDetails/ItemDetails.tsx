import React from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setTab } from '../../store/itemsSlice';
import { PropertiesTab } from './PropertiesTab';
import { ImageTab } from './ImageTab';

export const ItemDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedItemId, selectedTab } = useAppSelector(
    (state) => state.items
  );

  const selectedItem = items.find((item) => item.guid === selectedItemId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'properties' | 'image') => {
    dispatch(setTab(newValue));
  };

  if (!selectedItem) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Select an item to view details</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Properties" value="properties" />
        <Tab label="Image" value="image" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {selectedTab === 'properties' && <PropertiesTab item={selectedItem} />}
        {selectedTab === 'image' && <ImageTab guid={selectedItem.guid} />}
      </Box>
    </Box>
  );
};
