import { Item } from '../types/Item';

const BASE_URL = 'http://localhost:8080';

export const api = {
  // Fetch all items
  async fetchItems(): Promise<Item[]> {
    const response = await fetch(`${BASE_URL}/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  },

  // Get image URL for an item
  getImageUrl(guid: string): string {
    return `${BASE_URL}/image/${guid}`;
  }
};
