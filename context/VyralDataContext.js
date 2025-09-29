import React, { createContext, useContext, useMemo, useReducer } from 'react';

export const LESSON_STATUS_MULTIPLIERS = {
  not_started: 0,
  in_progress: 0.45,
  completed: 1,
};

const clampStat = (value) => Math.max(0, Math.min(100, value));

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

const initialLessons = [
  {
    id: 'finance-foundations',
    category: 'Finance',
    title: 'Emergency Fund Stack',
    description: 'Automate 3 months of living costs into a separate safe vault.',
    xp: 120,
    status: 'completed',
  },
  {
    id: 'finance-invest',
    category: 'Finance',
    title: 'Micro Investing Ritual',
    description: 'Schedule weekly contributions into diversified index streams.',
    xp: 150,
    status: 'in_progress',
  },
  {
    id: 'personal-boundaries',
    category: 'Personal',
    title: 'Consent Language Refresh',
    description: 'Rewrite boundary statements for school, work, and relationships.',
    xp: 110,
    status: 'completed',
  },
  {
    id: 'personal-energy',
    category: 'Personal',
    title: 'Energy Budgeting',
    description: 'Track what fuels and drains you for 14 days straight.',
    xp: 90,
    status: 'in_progress',
  },
  {
    id: 'wellness-calm',
    category: 'Wellness',
    title: 'Nightly Downshift',
    description: 'Pair guided breath with journaling before device curfew.',
    xp: 80,
    status: 'not_started',
  },
  {
    id: 'career-network',
    category: 'Career',
    title: 'Mentor Map',
    description: 'Design outreach map with 5 future collaborators.',
    xp: 140,
    status: 'in_progress',
  },
];

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

const initialStrykeStats = {
  trust: 72,
  influence: 64,
  stealth: 58,
};

const strykeScenarios = [
  {
    id: 'boot-sequence',
    title: 'Boot Sequence: Neon Mentorship',
    narrative:
      'A new collective wants to license Vyral\'s safe texting framework. They are underprepared but eager.',
    prompt: 'Do you slow-walk them through mentorship or sign a rapid distribution deal?',
    choices: [
      {
        id: 'mentor',
        label: 'Mentor them step-by-step',
        xp: 95,
        impact: { trust: 14, influence: 6, stealth: -4 },
        result:
          'You embed mentors with their crew and document best practices. Trust across the grid jumps while timelines stretch.',
        next: 'signal-breaker',
      },
      {
        id: 'fast-license',
        label: 'License instantly for scale',
        xp: 60,
        impact: { trust: -6, influence: 12, stealth: 5 },
        result:
          'They distribute quickly but stumble through onboarding. Influence widens, yet trust pings fall and you patch holes.',
        next: 'signal-breaker',
      },
    ],
  },
  {
    id: 'signal-breaker',
    title: 'Signal Breaker: Rumor Cascade',
    narrative:
      'A viral rumor threatens to fracture alliances. You can trace the source quietly or rally the community instantly.',
    prompt: 'Which Stryke move stabilizes the network with minimal collateral?',
    choices: [
      {
        id: 'trace-silently',
        label: 'Trace silently with stealth tools',
        xp: 80,
        impact: { trust: 8, influence: -2, stealth: 11 },
        result:
          'You isolate the troll farm without public drama. The crew sleeps easier while stealth metrics spike.',
        next: 'underworld-allies',
      },
      {
        id: 'crowdsource',
        label: 'Crowdsource responses with community pods',
        xp: 105,
        impact: { trust: 10, influence: 14, stealth: -6 },
        result:
          'Pods flood the rumor with context. Influence soars as new allies join, though the troll farm adapts.',
        next: 'underworld-allies',
      },
    ],
  },
  {
    id: 'underworld-allies',
    title: 'Underworld Allies: Shadow Market',
    narrative:
      'A black-market channel offers zero-day tools if you help them launder attention. Ethical alarms are blaring.',
    prompt: 'Will you walk away, negotiate terms, or infiltrate to collect intel?',
    choices: [
      {
        id: 'walk-away',
        label: 'Walk away—protect reputation',
        xp: 70,
        impact: { trust: 12, influence: -4, stealth: 3 },
        result:
          'You decline and tighten community guidelines. Trust solidifies even if influence momentum slows.',
        next: null,
      },
      {
        id: 'negotiate',
        label: 'Negotiate transparent partnership',
        xp: 120,
        impact: { trust: 6, influence: 16, stealth: -5 },
        result:
          'With strict guardrails, you turn an adversary into an ally. Influence skyrockets while stealth takes a small hit.',
        next: null,
      },
      {
        id: 'infiltrate',
        label: 'Infiltrate to gather intel',
        xp: 90,
        impact: { trust: -4, influence: 8, stealth: 12 },
        result:
          'You gather receipts and dismantle their operation. Stealth mastery grows, though trust dips until you debrief the crew.',
        next: null,
      },
    ],
  },
];

const scenarioMap = Object.fromEntries(strykeScenarios.map((scenario) => [scenario.id, scenario]));

const initialState = {
  xp: 420,
  users: initialUsers,
  chats: initialChats,
  collaborationThreads: initialThreads,
  lessons: initialLessons,
  zonePosts: initialZonePosts,
  stryke: {
    currentScenarioId: strykeScenarios[0].id,
    history: [],
    stats: initialStrykeStats,
    lastOutcome: null,
  },
};

const xpForStatus = (status, xp) => Math.round((LESSON_STATUS_MULTIPLIERS[status] || 0) * xp);

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LESSON': {
      const { lessonId } = action.payload;
      let xpDelta = 0;
      const lessons = state.lessons.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const order = ['not_started', 'in_progress', 'completed'];
        const currentIndex = order.indexOf(lesson.status);
        const nextStatus = order[(currentIndex + 1) % order.length];
        const previousXp = xpForStatus(lesson.status, lesson.xp);
        const nextXp = xpForStatus(nextStatus, lesson.xp);
        xpDelta += nextXp - previousXp;
        return { ...lesson, status: nextStatus };
      });
      return {
        ...state,
        lessons,
        xp: Math.max(0, state.xp + xpDelta),
      };
    }
    case 'ADD_CHAT_MESSAGE': {
      const { userId, author, text } = action.payload;
      const message = createMessage(author, text);
      const nextMessages = Array.isArray(state.chats[userId]) ? [...state.chats[userId], message] : [message];
      return {
        ...state,
        chats: {
          ...state.chats,
          [userId]: nextMessages,
        },
      };
    }
    case 'ADD_THREAD_UPDATE': {
      const { threadId, text } = action.payload;
      const threads = state.collaborationThreads.map((thread) => {
        if (thread.id !== threadId) return thread;
        const update = {
          id: `${threadId}-${Date.now()}`,
          author: 'You',
          text,
          createdAt: new Date().toISOString(),
        };
        return { ...thread, updates: [update, ...thread.updates] };
      });
      return {
        ...state,
        xp: state.xp + 18,
        collaborationThreads: threads,
      };
    }
    case 'ADD_THREAD': {
      const { id: providedId, title, summary, kickoff } = action.payload;
      const generatedId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      const id = providedId || generatedId;
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
        ...state,
        xp: state.xp + 35,
        collaborationThreads: [newThread, ...state.collaborationThreads],
      };
    }
    case 'TOGGLE_FRIEND': {
      const { userId } = action.payload;
      const users = state.users.map((user) =>
        user.id === userId ? { ...user, isFriend: !user.isFriend } : user
      );
      return {
        ...state,
        users,
      };
    }
    case 'TOGGLE_BLACKLIST': {
      const { userId } = action.payload;
      const users = state.users.map((user) => {
        if (user.id !== userId) return user;
        const isBlacklisted = !user.isBlacklisted;
        return {
          ...user,
          isBlacklisted,
          isFriend: isBlacklisted ? false : user.isFriend,
        };
      });
      return {
        ...state,
        users,
      };
    }
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
        ...state,
        xp: state.xp + 22,
        zonePosts: [post, ...state.zonePosts],
      };
    }
    case 'STRYKE_CHOICE': {
      const { scenarioId, choiceId } = action.payload;
      const scenario = scenarioMap[scenarioId];
      if (!scenario) {
        return state;
      }
      const choice = scenario.choices.find((option) => option.id === choiceId);
      if (!choice) {
        return state;
      }
      const stats = {
        trust: clampStat(state.stryke.stats.trust + (choice.impact?.trust ?? 0)),
        influence: clampStat(state.stryke.stats.influence + (choice.impact?.influence ?? 0)),
        stealth: clampStat(state.stryke.stats.stealth + (choice.impact?.stealth ?? 0)),
      };
      const outcome = {
        scenarioId,
        scenarioTitle: scenario.title,
        choiceId: choice.id,
        choiceLabel: choice.label,
        result: choice.result,
        xpAwarded: choice.xp,
        stats,
        resolvedAt: new Date().toISOString(),
      };
      return {
        ...state,
        xp: state.xp + choice.xp,
        stryke: {
          currentScenarioId: choice.next,
          history: [outcome, ...state.stryke.history],
          stats,
          lastOutcome: outcome,
        },
      };
    }
    case 'RESET_STRYKE': {
      return {
        ...state,
        stryke: {
          currentScenarioId: strykeScenarios[0].id,
          history: [],
          stats: initialStrykeStats,
          lastOutcome: null,
        },
      };
    }
    default:
      return state;
  }
}

const VyralDataContext = createContext(null);

export const VyralDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      ...state,
      strykeScenarios,
      toggleLessonStatus: (lessonId) => dispatch({ type: 'TOGGLE_LESSON', payload: { lessonId } }),
      sendDirectMessage: (userId, text, author = 'You') =>
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { userId, author, text } }),
      recordProjectUpdate: (threadId, text) =>
        dispatch({ type: 'ADD_THREAD_UPDATE', payload: { threadId, text } }),
      createProjectThread: (title, summary, kickoff) =>
        dispatch({ type: 'ADD_THREAD', payload: { title, summary, kickoff } }),
      toggleFriend: (userId) => dispatch({ type: 'TOGGLE_FRIEND', payload: { userId } }),
      toggleBlacklist: (userId) => dispatch({ type: 'TOGGLE_BLACKLIST', payload: { userId } }),
      addZonePost: (text, tag) => dispatch({ type: 'ADD_ZONE_POST', payload: { text, tag } }),
      chooseStrykeOption: (scenarioId, choiceId) =>
        dispatch({ type: 'STRYKE_CHOICE', payload: { scenarioId, choiceId } }),
      resetStryke: () => dispatch({ type: 'RESET_STRYKE' }),
    }),
    [state]
  );

  return <VyralDataContext.Provider value={value}>{children}</VyralDataContext.Provider>;
};

export const useVyralData = () => {
  const context = useContext(VyralDataContext);
  if (!context) {
    throw new Error('useVyralData must be used within a VyralDataProvider');
  }
  return context;
};

