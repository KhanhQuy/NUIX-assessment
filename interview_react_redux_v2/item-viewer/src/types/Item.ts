export interface Item {
  guid: string;
  name: string;
  path: string;
  properties?: Record<string, any>;
}

export interface ItemsState {
  items: Item[];
  selectedItemId: string | null;
  selectedTab: 'properties' | 'image';
  loading: boolean;
  error: string | null;
}
