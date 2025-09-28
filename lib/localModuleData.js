const moduleDefinitions = [
  {
    id: 'core',
    key: 'Core',
    moduleKey: 'Core',
    title: 'Core Command',
    description: 'Mission control and operational intelligence.',
    longDescription:
      'Coordinate mission-critical operations from a single command center. Monitor performance, triage issues, and keep every initiative aligned.',
    icon: 'flash-outline',
    routeName: 'Core',
    actionLabel: 'Launch Core',
    actionCopy: 'Simulate a core systems sync to keep the command deck humming.',
  },
  {
    id: 'zone',
    key: 'Zone',
    moduleKey: 'Zone',
    title: 'Zone Intelligence',
    description: 'Spatial analytics and live command zones.',
    longDescription:
      'Drop into geospatial overviews, track live deployments, and keep field teams in perfect formation.',
    icon: 'planet-outline',
    routeName: 'Zone',
    actionLabel: 'Launch Zone',
    actionCopy: 'Ping the latest coordinates and synchronize the tactical overlay.',
  },
  {
    id: 'tree',
    key: 'Tree',
    moduleKey: 'Tree',
    title: 'Tree Atlas',
    description: 'Organizational mapping and lineage tracking.',
    longDescription:
      'Visualize reporting paths, succession plans, and team relationships with clarity.',
    icon: 'git-branch-outline',
    routeName: 'Tree',
    actionLabel: 'Launch Tree',
    actionCopy: 'Render the newest org branches and highlight emerging connections.',
  },
  {
    id: 'board',
    key: 'Board',
    moduleKey: 'Board',
    title: 'Board Metrics',
    description: 'Strategic dashboards and visualization.',
    longDescription:
      'Unify KPIs, surface insights, and keep leadership informed with real-time dashboards.',
    icon: 'grid-outline',
    routeName: 'Board',
    actionLabel: 'Launch Board',
    actionCopy: 'Spin up the latest strategic report and broadcast the signal.',
  },
  {
    id: 'stryke',
    key: 'Stryke',
    moduleKey: 'Stryke',
    title: 'Stryke Ops',
    description: 'Revenue acceleration and sales orchestration.',
    longDescription:
      'Arm your sellers with playbooks, automate follow-ups, and orchestrate every strike point.',
    icon: 'rocket-outline',
    routeName: 'Stryke',
    actionLabel: 'Launch Stryke',
    actionCopy: 'Ignite a sales sequence and rally the revenue squad.',
  },
  {
    id: 'skrybe',
    key: 'Skrybe',
    moduleKey: 'Skrybe',
    title: 'Skrybe Forge',
    description: 'Narrative studio for collaborative lore and story drops.',
    longDescription:
      'Spin up serialized story worlds, draft collaborative chapters, and keep the lore canon synced across every squad.',
    icon: 'create-outline',
    routeName: 'Skrybe',
    actionLabel: 'Launch Skrybe',
    actionCopy: 'Open the narrative forge and publish a new neon chronicle.',
  },
  {
    id: 'lyfe',
    key: 'Lyfe',
    moduleKey: 'Lyfe',
    title: 'Lyfe Pulse',
    description: 'Wellness quests with adaptive rituals and streaks.',
    longDescription:
      'Track vibes, unlock resilience quests, and align check-ins that keep every creator balanced and energized.',
    icon: 'heart-outline',
    routeName: 'Lyfe',
    actionLabel: 'Launch Lyfe',
    actionCopy: 'Initiate a wellness pulse and log a new resilience ritual.',
  },
  {
    id: 'vshop',
    key: 'Vshop',
    moduleKey: 'Vshop',
    title: 'Vshop Arena',
    description: 'Drop hub for digital merch, experiences, and unlocks.',
    longDescription:
      'Curate neon drops, bundle virtual meetups, and manage fan commerce funnels with cinematic flair.',
    icon: 'bag-handle-outline',
    routeName: 'Vshop',
    actionLabel: 'Launch Vshop',
    actionCopy: 'Preview the next merch cascade and ready the hype signals.',
  },
];

export const getAllModules = () =>
  moduleDefinitions.map((module) => ({
    ...module,
    id: module.id ?? module.moduleKey ?? module.key,
    moduleKey: module.moduleKey ?? module.key,
  }));

export const getModuleByKey = (moduleKey) => {
  if (!moduleKey) {
    return null;
  }

  const normalizedKey = String(moduleKey).trim().toLowerCase();

  return (
    moduleDefinitions.find((module) => {
      const identifiers = [module.id, module.moduleKey, module.key, module.routeName];

      return identifiers.some(
        (identifier) => identifier && String(identifier).trim().toLowerCase() === normalizedKey,
      );
    }) ?? null
  );
};

export default {
  getAllModules,
  getModuleByKey,
};
