import React from 'react';
import { Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { Item } from '../../types/Item';

interface PropertiesTabProps {
  item: Item;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({ item }) => {
  const properties = item.properties || {};

  return (
    <Paper sx={{ p: 2 }}>
      <Table>
        <TableBody>
          {Object.entries(properties).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key}
              </TableCell>
              <TableCell>
                {typeof value === 'object' 
                  ? JSON.stringify(value) 
                  : String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
