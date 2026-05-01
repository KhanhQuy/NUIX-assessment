import React, { useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { useAppDispatch } from './store/hooks';
import { fetchItems } from './store/itemsSlice';
import { ItemTable } from './components/ItemTable/ItemTable';
import { ItemDetails } from './components/ItemDetails/ItemDetails';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Item Viewer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ItemTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <ItemDetails />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
