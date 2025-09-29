const clampStat = (value) => Math.max(0, Math.min(100, value));

export const strykeScenarios = [
  {
    id: 'boot-sequence',
    title: 'Boot Sequence: Neon Mentorship',
    narrative:
      "A new collective wants to license Vyral's safe texting framework. They are underprepared but eager.",
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
      "A viral rumor threatens to fracture alliances. You can trace the source quietly or rally the community instantly.",
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

const initialStrykeStats = {
  trust: 72,
  influence: 64,
  stealth: 58,
};

export const strykeInitialState = {
  currentScenarioId: strykeScenarios[0].id,
  history: [],
  stats: { ...initialStrykeStats },
  lastOutcome: null,
};

export const strykeReducer = (state, action) => {
  switch (action.type) {
    case 'STRYKE_CHOICE': {
      const { scenarioId, choiceId } = action.payload;
      const scenario = scenarioMap[scenarioId];
      if (!scenario) {
        return { state, xpDelta: 0 };
      }
      const choice = scenario.choices.find((option) => option.id === choiceId);
      if (!choice) {
        return { state, xpDelta: 0 };
      }
      const stats = {
        trust: clampStat(state.stats.trust + (choice.impact?.trust ?? 0)),
        influence: clampStat(state.stats.influence + (choice.impact?.influence ?? 0)),
        stealth: clampStat(state.stats.stealth + (choice.impact?.stealth ?? 0)),
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
        state: {
          currentScenarioId: choice.next,
          history: [outcome, ...state.history],
          stats,
          lastOutcome: outcome,
        },
        xpDelta: choice.xp,
      };
    }
    case 'RESET_STRYKE': {
      return {
        state: {
          currentScenarioId: strykeScenarios[0].id,
          history: [],
          stats: { ...initialStrykeStats },
          lastOutcome: null,
        },
        xpDelta: 0,
      };
    }
    default:
      return { state, xpDelta: 0 };
  }
};
