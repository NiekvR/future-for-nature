import { ScoreCategory } from '@app/models/score-category.model';


export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: '1',
    name: 'Person',
    relevance: 0.4,
    subs: [
      {
        id: '1.1',
        name: 'Leadership',
        info: 'Shows initiative, mobilises people, is a (potential) natural leader.'
      },
      {
        id: '1.2',
        name: 'Vision',
        info: 'Has a clear view / vision on conservation.'
      },
      {
        id: '1.3',
        name: 'Passion',
        info: 'Shows determination / able to overcome obstacles.'
      }
    ]
  },
  {
    id: '2',
    name: 'Conservation work',
    relevance: 0.4,
    subs: [
      {
        id: '2.1',
        name: 'Species protection',
        info: 'Effectiveness of the approach (current or potential) on species protection.'
      },
      {
        id: '2.2',
        name: 'Impact',
        info: 'Is the project/ approach scalable? (Can it grow in impact / can it be copied / etc.).'
      },
      {
        id: '2.3',
        name: 'Conditions',
        info: 'Working under difficult circumstances (social, political, endangeredness of target species, etc).'
      }
    ]
  },
  {
    id: '3',
    name: 'Added Value',
    relevance: 0.2,
    subs: [
      {
        id: '3.1',
        name: 'Award',
        info: 'Added value of the Award (recognition and money) for the candidate.'
      },
      {
        id: '3.2',
        name: 'Project',
        info: 'Added value of the proposed project to the target species / area / habitat.'
      },
      {
        id: '3.3',
        name: 'Relevance',
        info: 'innovativeness and relevance of the planned activities.'
      }
    ]
  }
];
