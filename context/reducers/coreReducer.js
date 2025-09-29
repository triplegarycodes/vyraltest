const createMessage = (author, text) => {
  const timestamp = new Date();
  return {
    id: `${timestamp.getTime()}-${Math.round(Math.random() * 1000)}`,
    author,
    text,
    createdAt: timestamp.toISOString(),
    displayTime: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const initialUsers = [
  {
    id: 'nova',
    name: 'Nova Ito',
    role: 'Signal Architect',
    focus: 'Builds encrypted storytelling stacks for remote crews.',
    tags: ['Systems', 'Safe Texting', 'Strategy'],
    isFriend: true,
    isBlacklisted: false,
  },
  {
    id: 'cipher',
    name: 'Cipher Reyes',
    role: 'Data Guardian',
    focus: 'Monitors consent metrics and redacts toxic flows.',
    tags: ['Privacy', 'Trust & Safety'],
    isFriend: true,
    isBlacklisted: false,
  },
  {
    id: 'flux',
    name: 'Flux Amari',
    role: 'Community Pulse',
    focus: 'Keeps the Vyral network energized with mutual aid.',
    tags: ['Community', 'Events'],
    isFriend: false,
    isBlacklisted: false,
  },
  {
    id: 'zen',
    name: 'Zen Aire',
    role: 'Wellness Synth',
    focus: 'Coaches decompression habits for late-night coders.',
    tags: ['Wellness', 'Breathwork'],
    isFriend: false,
    isBlacklisted: false,
  },
  {
    id: 'lyric',
    name: 'Lyric Sol',
    role: 'Finance Navigator',
    focus: 'Designs funding trees and cash-flow rituals.',
    tags: ['Finance', 'Investing'],
    isFriend: false,
    isBlacklisted: false,
  },
];

const initialChats = {
  nova: [
    createMessage('Nova Ito', 'Core uplink is humming. Ready to jam on the holoOS deck?'),
    createMessage('You', 'Absolutely. Let me sync the project board.'),
  ],
  cipher: [
    createMessage('Cipher Reyes', 'Nightly blacklist sync complete. Zero flags triggered.'),
  ],
  flux: [createMessage('Flux Amari', 'Planning a build sprint in the calm zone this weekend.')],
  zen: [createMessage('Zen Aire', 'Dropping a breath protocol to keep pulses steady.')],
  lyric: [createMessage('Lyric Sol', 'Finance tree is lush—ready to branch into grants?')],
};

const initialThreads = [
  {
    id: 'vyral-os',
    title: 'Vyral OS Pulse',
    summary: 'Collaborative operating system for privacy-first communities.',
    updates: [
      {
        id: 'update-1',
        author: 'Nova Ito',
        text: 'Shipped the encrypted file system with neon overlays.',
        createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      },
      {
        id: 'update-2',
        author: 'You',
        text: 'Drafted the onboarding maze for new contributors.',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
    contributors: ['Nova Ito', 'You', 'Cipher Reyes'],
  },
  {
    id: 'lyfe-protocol',
    title: 'Lyfe Protocol Curriculum',
    summary: 'Multi-layer lesson plan covering finance, personal, and digital resilience.',
    updates: [
      {
        id: 'update-lyfe-1',
        author: 'Lyric Sol',
        text: 'Mapped the finance capsule with emergency fund rituals.',
        createdAt: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
      },
    ],
    contributors: ['Lyric Sol', 'Zen Aire', 'You'],
  },
];

export const coreInitialState = {
  users: initialUsers,
  chats: initialChats,
  collaborationThreads: initialThreads,
};

export const coreReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CHAT_MESSAGE': {
      const { userId, author, text } = action.payload;
      const message = createMessage(author, text);
      const nextMessages = Array.isArray(state.chats[userId])
        ? [...state.chats[userId], message]
        : [message];
      return {
        state: {
          ...state,
          chats: {
            ...state.chats,
            [userId]: nextMessages,
          },
        },
        xpDelta: 0,
      };
    }
    case 'ADD_THREAD_UPDATE': {
      const { threadId, text } = action.payload;
      let updated = false;
      const threads = state.collaborationThreads.map((thread) => {
        if (thread.id !== threadId) return thread;
        updated = true;
        const update = {
          id: `${threadId}-${Date.now()}`,
          author: 'You',
          text,
          createdAt: new Date().toISOString(),
        };
        return { ...thread, updates: [update, ...thread.updates] };
      });
      if (!updated) {
        return { state, xpDelta: 0 };
      }
      return {
        state: {
          ...state,
          collaborationThreads: threads,
        },
        xpDelta: 18,
      };
    }
    case 'ADD_THREAD': {
      const { id: providedId, title, summary, kickoff } = action.payload;
      const sanitized = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const id = providedId || `${sanitized}-${Date.now()}`;
      const newThread = {
        id,
        title,
        summary,
        contributors: ['You'],
        updates: [
          {
            id: `${id}-seed`,
            author: 'You',
            text: kickoff || 'Kickstarting this project in the Core.',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      return {
        state: {
          ...state,
          collaborationThreads: [newThread, ...state.collaborationThreads],
        },
        xpDelta: 35,
      };
    }
    case 'TOGGLE_FRIEND': {
      const { userId } = action.payload;
      return {
        state: {
          ...state,
          users: state.users.map((user) =>
            user.id === userId ? { ...user, isFriend: !user.isFriend } : user
          ),
        },
        xpDelta: 0,
      };
    }
    case 'TOGGLE_BLACKLIST': {
      const { userId } = action.payload;
      return {
        state: {
          ...state,
          users: state.users.map((user) => {
            if (user.id !== userId) return user;
            const isBlacklisted = !user.isBlacklisted;
            return {
              ...user,
              isBlacklisted,
              isFriend: isBlacklisted ? false : user.isFriend,
            };
          }),
        },
        xpDelta: 0,
      };
    }
    default:
      return { state, xpDelta: 0 };
  }
};
