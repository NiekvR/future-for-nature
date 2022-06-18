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
    title: 'Welcome (1/24)',
    text: 'The next steps will guide you through this application and shows you how the application works.',
  },
  {
    id: 'step_2',
    title: 'Applicants (2/24)',
    text: 'This is the list of this years applicants. It\'s scrollable and, at this moment, sorted by application number.'
  },
  {
    id: 'step_3',
    title: 'Applicants (3/24)',
    text: 'With this button you can sort the applicants differently, based on their status. An applicant can have the ' +
      'following statuses: None, Skipped, Submitted. Clicking this button once sorts the applicants in this order: ' +
      'None, Skipped, Submitted. Clicking again sorts them in the order Submitted, Skipped, None. Clicking a third ' +
      'time sorts on the application number again (ascending).'
  },
  {
    id: 'step_4',
    title: 'Applicants (4/24)',
    text: 'Using this field you are able to search for specific applicants. It is possible to search on application number or any part of the applicants name.'
  },
  {
    id: 'step_5',
    title: 'Applicants (5/24)',
    text: 'You can select any applicant in the list to open his/her application. <br><br><b>Now select this application</b>.',
  },
  {
    id: 'step_6',
    title: 'Applicants (6/24)',
    text: 'You can see that this applicant is now selected, as it is highlighted in black and green.'
  },
  {
    id: 'step_7',
    title: 'Application (7/24)',
    text: 'The selected applicant’s number and name will appear on top  of the screen as well (on the right).'
  },
  {
    id: 'step_8',
    title: 'Application (8/24)',
    text: 'In the centre of the screen, the application form of the applicant appears.'
  },
  {
    id: 'step_9',
    title: 'Scoring (9/24)',
    text: 'On the right, the scoring panel is visible.'
  },
  {
    id: 'step_10',
    title: 'Scoring (10/24)',
    text: 'Use these fields to score the application on the given criteria. Score between a 1.0 and a 5.0 (1.0 being lowest, 5.0 highest).'
  },
  {
    id: 'step_11',
    title: 'Scoring (11/24)',
    text: 'Click on the \'i\' to open the category description if needed.'
  },
  {
    id: 'step_12',
    title: 'Scoring (12/24)',
    text: 'Subtotals for each category will automatically be calculated.'
  },
  {
    id: 'step_13',
    title: 'Scoring (13/24)',
    text: 'As well as the total score.'
  },
  {
    id: 'step_14',
    title: 'Scoring (14/24)',
    text: 'You can use this button to skip scoring this applicant. Skipping an applicant means that you find this an ' +
      'unworthy application, and you will not spend time scoring it in depth. The applicant will get the status ' +
      '‘Skipped’ in the list on the left panel (visual by a grey bar). You can always return to the applicant and ' +
      'still score it if you change your mind.'
  },
  {
    id: 'step_15',
    title: 'Scoring (15/24)',
    text: 'When all categories are scored (you cannot leave the 0), you are able to click ‘Submit’ here. Submitting ' +
      'freezes the scores for this applicant. An ‘Edit’ button will appear which you can use to alter the scores if ' +
      'you change your mind afterwards. Editing does require you to resubmit the scores when you are done.'
  },
  {
    id: 'step_16',
    title: 'Scoring (16/24)',
    text: 'This button resets all scores for the selected applicant back to 0. You can use it to start over. Also, if ' +
      'you are scoring an applicant but at some point feel that it is not worth the time to continue scoring it, ' +
      'you should click ‘Reset scores’ as well, before being able to Skip below.'
  },
  {
    id: 'step_17',
    title: 'Scoring (17/24)',
    text: 'In this field you can write comments for this application.'
  },
  {
    id: 'step_18',
    title: 'General (18/24)',
    text: 'If you leave an applicant halfway through scoring, your scores and comments will be saved automatically for ' +
      'you to continue when you get back to it.'
  },
  {
    id: 'step_19',
    title: 'General (19/24)',
    text: 'Select this <i class="fas fa-power-off"></i> button in the left bottom corner to log-out of the scoring webtool.'
  },
  {
    id: 'step_20',
    title: 'General (20/24)',
    text: 'Select this <i class="fas fa-question"></i> button to start the guidance through the webtool again any time while using the tool.'
  },
  {
    id: 'step_21',
    title: 'Overall score (21/24)',
    text: 'By clicking on the ‘Overall scores’ button in the left bottom of the screen, you can open an overview of the ' +
      ' scores for all the applications you have submitted scores for so far. It will open in a different window. ' +
      '<br><br><b>Now click this button to open this overview</b>',
  },
  {
    id: 'step_22',
    title: 'Overall score (22/24)',
    text: 'In this overview you can see all scores you have given for the different applicants. The applicants are ' +
      'sorted by total score, highest score on top'
  },
  {
    id: 'step_23',
    title: 'Overall score (23/24)',
    text: 'When you have judged all applications (so all applications are either Submitted or Skipped) you will be ' +
      'able to use this button to submit your final scores to the Future For Nature office. <b>After submitting, all your' +
      'scores will be frozen and you cannot adjust them anymore.</b> You will still be able to log-in and read the ' +
      'applications and your comments.'
  },
  {

    id: 'step_24',
    title: 'Overall score (24/24)',
    text: 'This concludes the tour of the web-tool. If you want to go through it again, click the ‘question-mark’-button ' +
      'in the bottom-left corner of the screen. If you have any further questions, don’t hesitate to contact the ' +
      'Future For Nature team.'
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
    ...tourStepsTextAndTitle[ 19 ],
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
    ...tourStepsTextAndTitle[ 20 ],
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
    ...tourStepsTextAndTitle[ 21 ],
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
    ...tourStepsTextAndTitle[ 22 ],
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
    ...tourStepsTextAndTitle[ 23 ],
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
