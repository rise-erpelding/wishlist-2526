export const mockWishLists = [
  {
    sys: { id: 'wishlist-1' },
    fields: { title: 'Birthday Wishlist' }
  },
  {
    sys: { id: 'wishlist-2' },
    fields: { title: 'Holiday Wishlist' }
  }
];

export const mockCategories = [
  {
    sys: { id: 'cat-1' },
    fields: {
      title: 'Books',
      wishList: [{ sys: { id: 'wishlist-1' } }]
    }
  },
  {
    sys: { id: 'cat-2' },
    fields: {
      title: 'Electronics',
      wishList: [{ sys: { id: 'wishlist-1' } }]
    }
  },
  {
    sys: { id: 'cat-3' },
    fields: {
      title: 'Home & Kitchen',
      wishList: [{ sys: { id: 'wishlist-2' } }]
    }
  }
];

export const mockItems = [
  {
    sys: { id: 'item-1' },
    fields: {
      title: 'The Pragmatic Programmer',
      description: 'Classic programming book',
      category: [{ sys: { id: 'cat-1' } }],
      wishList: [{ sys: { id: 'wishlist-1' } }],
      isClaimed: false,
      imageUrl: 'https://placehold.co/150x150?text=Book',
      url: 'https://example.com/pragmatic-programmer'
    }
  },
  {
    sys: { id: 'item-2' },
    fields: {
      title: 'Mechanical Keyboard',
      description: 'Tactile switches, backlit',
      category: [{ sys: { id: 'cat-2' } }],
      wishList: [{ sys: { id: 'wishlist-1' } }],
      isClaimed: true,
      imageUrl: 'https://placehold.co/150x150?text=Keyboard'
    }
  },
  {
    sys: { id: 'item-3' },
    fields: {
      title: 'Cast Iron Skillet',
      description: '12-inch preseasoned pan',
      category: [{ sys: { id: 'cat-3' } }],
      wishList: [{ sys: { id: 'wishlist-2' } }],
      isClaimed: false,
      imageUrl: 'https://placehold.co/150x150?text=Skillet'
    }
  }
];
