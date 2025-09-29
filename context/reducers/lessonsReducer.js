export const LESSON_STATUS_MULTIPLIERS = {
  not_started: 0,
  in_progress: 0.45,
  completed: 1,
};

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

export const lessonsInitialState = initialLessons;

const progressOrder = ['not_started', 'in_progress', 'completed'];

const xpForStatus = (status, xp) => Math.round((LESSON_STATUS_MULTIPLIERS[status] || 0) * xp);

export const lessonsReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_LESSON': {
      const { lessonId } = action.payload;
      let xpDelta = 0;
      const nextLessons = state.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        const currentIndex = progressOrder.indexOf(lesson.status);
        const nextStatus = progressOrder[(currentIndex + 1) % progressOrder.length];
        const previousXp = xpForStatus(lesson.status, lesson.xp);
        const nextXp = xpForStatus(nextStatus, lesson.xp);
        xpDelta += nextXp - previousXp;
        return { ...lesson, status: nextStatus };
      });
      return { state: nextLessons, xpDelta };
    }
    default:
      return { state, xpDelta: 0 };
  }
};
