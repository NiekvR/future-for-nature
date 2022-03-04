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
        name: 'Passion',
        info: 'Has passion for species / nature conservation, and shows motivation / perseverance to continue.'
      },
      {
        id: '1.3',
        name: 'Vision',
        info: 'Has a clear view on conservation (conservation vision).'
      }
    ]
  },
  {
    id: '2',
    name: 'Achievements',
    relevance: 0.4,
    subs: [
      {
        id: '2.1',
        name: 'Species protection',
        info: 'Substantial and long term benefit to species protection.'
      },
      {
        id: '2.2',
        name: 'Innovation',
        info: 'Creativity and innovativeness in the work performed.'
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
        info: 'Added value of the Award (recognition and money) for the person and project as presented.'
      },
      {
        id: '3.2',
        name: 'Project',
        info: 'Relevance of the proposed project activities for the focal species/system.'
      }
    ]
  }
];
