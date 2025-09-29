const initialZonePosts = [
  {
    id: 'post-1',
    author: 'Flux Amari',
    tag: 'Build',
    message: 'Shared the neon moodboard kit for the campus hackathon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: 'post-2',
    author: 'Zen Aire',
    tag: 'Support',
    message: 'Mindful cooldown audio uploaded to the vault.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'post-3',
    author: 'Cipher Reyes',
    tag: 'Alert',
    message: 'Blacklist updated—two spam clusters neutralized.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export const zoneInitialState = initialZonePosts;

export const zoneReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ZONE_POST': {
      const { text, tag } = action.payload;
      const post = {
        id: `post-${Date.now()}`,
        author: 'You',
        tag,
        message: text,
        createdAt: new Date().toISOString(),
      };
      return {
        state: [post, ...state],
        xpDelta: 22,
      };
    }
    default:
      return { state, xpDelta: 0 };
  }
};
