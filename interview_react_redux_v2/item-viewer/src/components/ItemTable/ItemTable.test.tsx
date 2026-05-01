import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../../store/itemsSlice';
import { ItemTable } from './ItemTable';

const mockItems = [
  { guid: 'guid1', name: 'Item 1', path: 'path1', properties: {} },
  { guid: 'guid2', name: 'Item 2', path: 'path2', properties: {} }
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { items: itemsReducer },
    preloadedState: {
      items: {
        items: mockItems,
        selectedItemId: null,
        selectedTab: 'properties',
        loading: false,
        error: null,
        ...initialState
      }
    }
  });
};

describe('ItemTable', () => {
  it('renders items correctly', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ItemTable />
      </Provider>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('selects item on click', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ItemTable />
      </Provider>
    );

    const row = screen.getByText('Item 1').closest('tr');
    fireEvent.click(row!);

    const state = store.getState();
    expect(state.items.selectedItemId).toBe('guid1');
  });
});
