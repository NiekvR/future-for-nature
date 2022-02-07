import { ScoreCategory } from '@app/models/score-category.model';


export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: '1',
    name: 'Category 1',
    subs: [
      {
        id: '1.1',
        name: 'SubCategory 1.1'
      },
      {
        id: '1.2',
        name: 'SubCategory 1.2'
      },
      {
        id: '1.3',
        name: 'SubCategory 1.3'
      }
    ]
  },
  {
    id: '2',
    name: 'Category 2',
    subs: [
      {
        id: '2.1',
        name: 'SubCategory 2.1'
      },
      {
        id: '2.2',
        name: 'SubCategory 2.2'
      }
    ]
  },
  {
    id: '3',
    name: 'Category 3',
    subs: [
      {
        id: '3.1',
        name: 'SubCategory 3.1'
      },
      {
        id: '3.2',
        name: 'SubCategory 3.2'
      }
    ]
  }
];
