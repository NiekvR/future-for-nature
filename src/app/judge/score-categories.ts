import { ScoreCategory } from '@app/models/score-category.model';


export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: '1',
    name: 'Person',
    relevance: 0.4,
    subs: [
      {
        id: '1.1',
        name: 'Initiative',
        info: 'Shows initiative and mobilises people.'
      },
      {
        id: '1.2',
        name: 'Vision',
        info: 'Has a clear view / vision on conservation.'
      },
      {
        id: '1.3',
        name: 'Determination',
        info: 'Shows determination / able to overcome obstacles / dealing with hard things.'
      },
      {
        id: '1.4',
        name: 'Endurance',
        info: 'Shows consistency / has stuck with their aim and goals / endurance.'
      }
    ]
  },
  {
    id: '2',
    name: 'Work',
    relevance: 0.4,
    subs: [
      {
        id: '2.1',
        name: 'Effectiveness',
        info: 'Effectiveness of the approach (current or potential) on species protection.'
      },
      {
        id: '2.2',
        name: 'Scalability',
        info: 'Is the work/ approach scalable? (Can it grow in impact / can it be copied / etc.).'
      },
      {
        id: '2.3',
        name: 'Circumstances',
        info: 'Working under difficult circumstances (social, political, endangeredness of the target species, etc.).'
      },
      {
        id: '2.4',
        name: 'Innovativeness',
        info: 'Innovativeness and relevance of the planned activities.'
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
        name: 'Species',
        info: 'Added value of the proposed work for the target species / area / habitat.'
      },
      {
        id: '3.2',
        name: 'Applicant',
        info: 'Added value of the Award (recognition and money) for the candidate.'
      }
    ]
  }
];
