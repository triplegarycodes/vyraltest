import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { coreInitialState, coreReducer } from './reducers/coreReducer';
import {
  lessonsInitialState,
  lessonsReducer,
  LESSON_STATUS_MULTIPLIERS,
} from './reducers/lessonsReducer';
import { zoneInitialState, zoneReducer } from './reducers/zoneReducer';
import { strykeInitialState, strykeReducer, strykeScenarios } from './reducers/strykeReducer';

const BASE_XP = 420;

const domainReducers = {
  core: coreReducer,
  lessons: lessonsReducer,
  zone: zoneReducer,
  stryke: strykeReducer,
};

const initialState = {
  xp: BASE_XP,
  core: coreInitialState,
  lessons: lessonsInitialState,
  zone: zoneInitialState,
  stryke: strykeInitialState,
};

const VyralDataContext = createContext(null);

function rootReducer(state, action) {
  const { domain } = action;
  if (domain && domainReducers[domain]) {
    const { state: nextDomainState, xpDelta = 0 } = domainReducers[domain](state[domain], action);
    if (nextDomainState === state[domain] && xpDelta === 0) {
      return state;
    }
    const nextState = {
      ...state,
      [domain]: nextDomainState,
    };
    if (xpDelta !== 0) {
      nextState.xp = Math.max(0, (state.xp ?? 0) + xpDelta);
    }
    return nextState;
  }
  return state;
}

export const VyralDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const { core, lessons, zone, stryke, xp } = state;

  const value = useMemo(
    () => ({
      xp,
      users: core.users,
      chats: core.chats,
      collaborationThreads: core.collaborationThreads,
      lessons,
      zonePosts: zone,
      stryke,
      strykeScenarios,
      toggleLessonStatus: (lessonId) =>
        dispatch({ domain: 'lessons', type: 'TOGGLE_LESSON', payload: { lessonId } }),
      sendDirectMessage: (userId, text, author = 'You') =>
        dispatch({ domain: 'core', type: 'ADD_CHAT_MESSAGE', payload: { userId, author, text } }),
      recordProjectUpdate: (threadId, text) =>
        dispatch({ domain: 'core', type: 'ADD_THREAD_UPDATE', payload: { threadId, text } }),
      createProjectThread: (title, summary, kickoff) =>
        dispatch({ domain: 'core', type: 'ADD_THREAD', payload: { title, summary, kickoff } }),
      toggleFriend: (userId) => dispatch({ domain: 'core', type: 'TOGGLE_FRIEND', payload: { userId } }),
      toggleBlacklist: (userId) =>
        dispatch({ domain: 'core', type: 'TOGGLE_BLACKLIST', payload: { userId } }),
      addZonePost: (text, tag) => dispatch({ domain: 'zone', type: 'ADD_ZONE_POST', payload: { text, tag } }),
      chooseStrykeOption: (scenarioId, choiceId) =>
        dispatch({ domain: 'stryke', type: 'STRYKE_CHOICE', payload: { scenarioId, choiceId } }),
      resetStryke: () => dispatch({ domain: 'stryke', type: 'RESET_STRYKE' }),
    }),
    [core, lessons, zone, stryke, xp]
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

export { LESSON_STATUS_MULTIPLIERS };
