const builtInButtons = {
  cancel: {
    classes: "cancel-button",
    text: "Cancel",
    type: "cancel"
  },
  end: {
    classes: "end-button",
    text: "End",
    type: "next"
  },
  next: {
    classes: "next-button",
    text: "Next",
    type: "next"
  },
  back: {
    classes: "back-button",
    secondary: true,
    text: "Back",
    type: "back"
  }
};

const tourStepsTextAndTitle = [
  {
    id: 'step_1',
    title: 'Welcome (1/23)',
    text: 'The next steps will guide you through this application and shows you how the application works',
  },
  {
    id: 'step_2',
    title: 'Applicants (2/23)',
    text: 'This is the list of this years applicants. It\' scrollable and, at this moment, sorted by entry id'
  },
  {
    id: 'step_3',
    title: 'Applicants (3/23)',
    text: 'Using this button you can also sort on applicant status. An applicant can have the following statuses: ' +
      'Submitted and Skipped. Selecting this button sorts the applicants showing applicants without a status first, ' +
      'then applicants with a Skipped status and lastly applicants with a Submitted status. Selecting this button ' +
      'again reverts the status order (submitted, skipped, none) and a third selection orders the applicant on entry id (ascending)'
  },
  {
    id: 'step_4',
    title: 'Applicants (4/23)',
    text: 'Using this field you are able to search for specific applicants. It is possible to search on entry id or any part of the applicants name'
  },
  {
    id: 'step_5',
    title: 'Applicants (5/23)',
    text: 'You can select any applicant in the list to open his/her application. <br><br><b>Now select this application</b>',
  },
  {
    id: 'step_6',
    title: 'Applicants (6/23)',
    text: 'You can see that this applicant is now selected'
  },
  {
    id: 'step_7',
    title: 'Application (7/23)',
    text: 'You can see the selected applicant and it\'s entry id over her as well'
  },
  {
    id: 'step_8',
    title: 'Application (8/23)',
    text: 'At the mid-part of the application you can find anything that is known about this application'
  },
  {
    id: 'step_9',
    title: 'Scoring (9/23)',
    text: 'At the right side you are able to score the application'
  },
  {
    id: 'step_10',
    title: 'Scoring (10/23)',
    text: 'Use these fields to score the application on the given criteria. Score between a 1 and a 5 (1 being lowest, 5 highest)'
  },
  {
    id: 'step_11',
    title: 'Scoring (11/23)',
    text: 'Click on the \'i\' to open the category description if needed'
  },
  {
    id: 'step_12',
    title: 'Scoring (12/23)',
    text: 'Every category as a subtotal score'
  },
  {
    id: 'step_13',
    title: 'Scoring (13/23)',
    text: 'All scores add up to an average total score'
  },
  {
    id: 'step_14',
    title: 'Scoring (14/23)',
    text: 'You can use this button to skip scoring this application. Skipping means you are not ready to completely ' +
      'score this application and want to take a better look into it later. Skipping als means that the applicant in ' +
      'the applicant-list (left-panel) gets a grey bar in front of its name and entry id, reminding you that you ' +
      'still have some scoring to do for that applicant'
  },
  {
    id: 'step_15',
    title: 'Scoring (15/23)',
    text: 'When all scores are given you are able to submit these scores. Submitting freezes the scores, but you are ' +
      'able to change the scores. When you submit the scores these buttons will disappear and an \'edit\'-button ' +
      'appears. Select the edit button to reopen the scores. This does require you to resubmit the scores again when you are done'
  },
  {
    id: 'step_16',
    title: 'Scoring (16/23)',
    text: 'Another way to continue is to leave all scores blank. When an application is not good enough to consider ' +
      'it might be easier to just leave all scores blank. When all scores are blank it also counts as a submitted ' +
      'application. When you started scoring, but want to create a blank scoresheet again, just select this button. ' +
      'It will reset all your scores'
  },
  {
    id: 'step_17',
    title: 'Scoring (17/23)',
    text: 'In this field you can write comments for this application'
  },
  {
    id: 'step_18',
    title: 'General (18/23)',
    text: 'Select this button to log-out'
  },
  {
    id: 'step_19',
    title: 'General (19/23)',
    text: 'Select this button to start this application introduction again'
  },
  {
    id: 'step_20',
    title: 'Overall score (20/23)',
    text: 'Select this button to open an overview of the scores of all applicants. <br><br><b>Now click this button to open this overview</b>',
  },
  {
    id: 'step_21',
    title: 'Overall score (21/23)',
    text: 'In this overview you can see all scores you have given for the different applicants. The applicants are ' +
      'sorted by total score, highest score on top'
  },
  {
    id: 'step_22',
    title: 'Overall score (22/23)',
    text: 'When you have judged all applications (so if all applications are either not scored at all or submitted) ' +
      'you will be able to use this button to submit all your scores. Be carefull though, after submitting the scores ' +
      'can not be changed again. This submissions is final'
  },
  {

    id: 'step_23',
    title: 'Overall score (23/23)',
    text: 'This concludes the tour of the application. If you want to see it again, press the \'question mark\'-button ' +
      'in the bottom-left corner of the screen. If you still have questions, don\'t hesitate to contact future for nature!'
  }
]

export const TOUR_STEPS = [
  {
    ...tourStepsTextAndTitle[ 0 ],
    buttons: [
      {
        ...builtInButtons.cancel,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 1 ],
    arrow: false,
    attachTo: {
      element: '.applicant-list',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 2 ],
    arrow: false,
    attachTo: {
      element: '.fa-arrow-down-wide-short',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 3 ],
    arrow: false,
    attachTo: {
      element: 'ffn-search',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 4 ],
    arrow: false,
    attachTo: {
      element: 'ffn-applicant-list-item',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      {
        ...builtInButtons.next,
        disabled: true
      }
    ],
    scrollTo: false,
    advanceOn: { selector: 'ffn-applicant-list-item', event: 'click' }
  },
  {
    ...tourStepsTextAndTitle[ 5 ],
    arrow: false,
    attachTo: {
      element: 'ffn-applicant-list-item',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 6 ],
    arrow: false,
    attachTo: {
      element: '.app-header h2',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 7 ],
    arrow: false,
    attachTo: {
      element: 'ffn-application',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 8 ],
    arrow: false,
    attachTo: {
      element: '.right-panel',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 9 ],
    arrow: false,
    attachTo: {
      element: 'ffn-score-input',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 10 ],
    arrow: false,
    attachTo: {
      element: 'ffn-score-input .fa-info-circle',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 11 ],
    arrow: false,
    attachTo: {
      element: '.sub-total',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 12 ],
    arrow: false,
    attachTo: {
      element: '.total',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 13 ],
    arrow: false,
    attachTo: {
      element: '.right-panel button.secondary',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 14 ],
    arrow: false,
    attachTo: {
      element: '.right-panel button:disabled',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 15 ],
    arrow: false,
    attachTo: {
      element: '.text-link',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 16 ],
    arrow: false,
    attachTo: {
      element: 'textarea',
      on: 'left'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 17 ],
    arrow: false,
    attachTo: {
      element: '.left-panel button.small.border',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 18 ],
    arrow: false,
    attachTo: {
      element: '.left-panel button.small:not(.border)',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 19 ],
    arrow: false,
    attachTo: {
      element: '.left-panel button:not(.small)',
      on: 'right'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      {
        ...builtInButtons.next,
        disabled: true
      }
    ],
    scrollTo: false,
    advanceOn: { selector: '.left-panel button:not(.small)', event: 'click' }
  },
  {
    ...tourStepsTextAndTitle[ 20 ],
    arrow: false,
    attachTo: {
      element: 'ffn-overall-scores-modal',
      on: 'top'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next,
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 21 ],
    arrow: false,
    attachTo: {
      element: 'ffn-overall-scores-modal .footer button',
      on: 'bottom'
    },
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.next,
    ],
    scrollTo: false,
  },
  {
    ...tourStepsTextAndTitle[ 22 ],
    arrow: false,
    buttons: [
      {
        ...builtInButtons.back,
        secondary: true
      },
      builtInButtons.end,
    ],
    scrollTo: false,
  }
]
