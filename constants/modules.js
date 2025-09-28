export const modules = [
  {
    key: 'Core',
    name: 'Core',
    title: 'Core Nexus',
    summary: 'Project collab + safe interactive chat.',
    description:
      'Synchronize squads with structured briefings, moderated discussion zones, and lightning-fast asset drops.',
    icon: 'flash-outline',
    actionLabel: 'Open Core Operations',
    accentGradient: ['rgba(61, 246, 226, 0.25)', 'rgba(130, 91, 255, 0.35)'],
  },
  {
    key: 'Zone',
    name: 'Zone',
    title: 'Zone Spheres',
    summary: 'Communities engineered for high-signal exchange.',
    description:
      'Map the network, curate rituals, and pulse live signals across dedicated arenas built for teen creators.',
    icon: 'planet-outline',
    actionLabel: 'Explore Community Zones',
    accentGradient: ['rgba(118, 206, 255, 0.24)', 'rgba(111, 255, 197, 0.28)'],
  },
  {
    key: 'Tree',
    name: 'Tree',
    title: 'Tree Growth Engine',
    summary: 'Growth tracker with adaptive milestones.',
    description:
      'Layer personal quests, mentor feedback loops, and growth analytics into a living holographic roadmap.',
    icon: 'git-branch-outline',
    actionLabel: 'Review Growth Branches',
    accentGradient: ['rgba(102, 255, 217, 0.26)', 'rgba(82, 144, 255, 0.32)'],
  },
  {
    key: 'Board',
    name: 'Board',
    title: 'Board Command Grid',
    summary: 'Goal system with adaptive sprints.',
    description:
      'Architect missions, assign squads, and capture performance telemetry across reactive neon kanban boards.',
    icon: 'grid-outline',
    actionLabel: 'Launch Mission Board',
    accentGradient: ['rgba(109, 244, 255, 0.24)', 'rgba(166, 107, 255, 0.3)'],
  },
  {
    key: 'Stryke',
    name: 'Stryke',
    title: 'Stryke Scenario Lab',
    summary: 'Decision-based learning accelerator.',
    description:
      'Spin up branching simulations, measure reflexes, and coach confident decisions with real-time feedback.',
    icon: 'rocket-outline',
    actionLabel: 'Initiate Stryke Simulation',
    accentGradient: ['rgba(255, 95, 209, 0.25)', 'rgba(93, 255, 222, 0.3)'],
  },
];

export const moduleMap = modules.reduce((acc, module) => {
  acc[module.key] = module;
  return acc;
}, {});

export default modules;
