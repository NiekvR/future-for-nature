import { Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NgxModalComponent, NgxModalService } from 'ngx-modalview';
import { ReasonNonActive, Relation, RelationStatus, RelationType } from '@app/models/relation.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { FieldType, FormField, Option, OptionGroup } from '@app/models/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import landcodes from '../edit-relation/landcodes.json';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RelationsCollectionService } from '@app/core/relations-collection.service';

@Component({
  selector: 'ffn-edit-relation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatFormFieldModule, MatInputModule, NgForOf, MatSelect, MatOption, MatDatepickerModule, MatOptgroup, MatCheckboxModule],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'nl-NL'},
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-relation.component.html',
  styleUrl: './edit-relation.component.scss'
})
export class EditRelationComponent extends NgxModalComponent<{}, any> implements OnInit, OnDestroy {
  @Input() relation: Relation | undefined;

  public connections: OptionGroup[] = [
    {
      name: 'Board',
      options: [
        {
          value: 'Board member',
          label: 'Member'
        },
        {
          value: 'Retired Board member',
          label: 'Retired'
        },
        {
          value: 'Honorary Board member',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'Team',
      options: [
        {
          value: 'Team member',
          label: 'Member'
        },
        {
          value: 'Retired Team member',
          label: 'Retired'
        },
        {
          value: 'Honorary Team member',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'NSC',
      options: [
        {
          value: 'NSC member',
          label: 'Member'
        },
        {
          value: 'Retired NSC member',
          label: 'Retired'
        },
        {
          value: 'Honorary NSC member',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'ISC',
      options: [
        {
          value: 'ISC member',
          label: 'Member'
        },
        {
          value: 'Retired ISC member',
          label: 'Retired'
        },
        {
          value: 'Honorary ISC member',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'RVA',
      options: [
        {
          value: 'RVA member',
          label: 'Member'
        },
        {
          value: 'Retired RVA member',
          label: 'Retired'
        },
        {
          value: 'Honorary RVA member',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'FFN Friend',
      options: [
        {
          value: 'FFN Friend',
          label: 'Member'
        },
        {
          value: 'Retired FFN Friend',
          label: 'Retired'
        },
        {
          value: 'Honorary FFN Friend',
          label: 'Honorary'
        }
      ]
    },
    {
      name: 'Globe Guard',
      options: [
        {
          value: 'Globe Guard member',
          label: 'Member'
        },
        {
          value: 'Retired Globe Guard member',
          label: 'Retired'
        },
        {
          value: 'Honorary Globe Guard member',
          label: 'Honorary'
        }
      ]
    }
  ]
  public reasonsNonActive: Option[] = [
    {
      value: ReasonNonActive.decedent,
      label: ReasonNonActive.decedent
    },
    {
      value: ReasonNonActive.noContact,
      label: ReasonNonActive.noContact
    },
    {
      value: ReasonNonActive.other,
      label: ReasonNonActive.other
    }
  ]

  public relationForm!: FormGroup;
  public nameFields: FormField[] = [
    {
      label: 'Relation Name',
      code: 'relationName',
      field: FieldType.input,
      hasError: false,
      disabled: true
    },
    {
      label: 'First names',
      code: 'firstNames',
      field: FieldType.input,
      hasError: false,
    },
    {
      label: 'Call sign',
      code: 'callSign',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Infix',
      code: 'infix',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Last name',
      code: 'lastName',
      field: FieldType.input,
      hasError: true,
      error: 'Add a last name'
    },
    {
      label: 'Dutch salutation',
      code: 'dutchSalutation',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'English salutation',
      code: 'englishSalutation',
      field: FieldType.input,
      hasError: false
    }
  ]
  public membershipsAndStatus: FormField[] = [
    {
      label: 'Relation Type',
      code: 'relationType',
      field: FieldType.select,
      options: [
        {
          value: RelationType.personal,
          label: RelationType.personal
        },
        {
          value: RelationType.businessRelation,
          label: RelationType.businessRelation
        },
        {
          value: RelationType.supplier,
          label: RelationType.supplier
        },
        {
          value: RelationType.unknown,
          label: RelationType.unknown
        }
      ],
      hasError: false
    },
    {
      label: 'Relation Status',
      code: 'relationStatus',
      field: FieldType.select,
      options: [
        {
          value: RelationStatus.active,
          label: RelationStatus.active
        },
        {
          value: RelationStatus.nonActive,
          label: RelationStatus.nonActive
        }
      ],
      hasError: false
    },
    {
      label: 'Connections',
      code: 'connections',
      field: FieldType.select,
      multiOptions: this.connections,
      hasError: false,
      multiple: true
    },
    {
      label: 'Has won the award in ...',
      code: 'winner',
      field: FieldType.select,
      options: this.createAwardYearArray(),
      hasError: false
    }
  ];
  public generalInfo: FormField[] = [
    {
      label: 'Email',
      code: 'email',
      field: FieldType.email,
      hasError: true,
      error: 'Please enter a valid email address'
    },
    {
      label: 'Email 2',
      code: 'email2',
      field: FieldType.email,
      hasError: true,
      error: 'Please enter a valid email address'
    },
    {
      label: 'Phone',
      code: 'phone',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Phone 2',
      code: 'phone2',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Phone 3',
      code: 'phone3',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Website',
      code: 'website',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Dietary requirements',
      code: 'dietaryRequirements',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Brought in by',
      code: 'broughtInBy',
      field: FieldType.input,
      hasError: false
    },
  ];
  public postAdress: FormField[] = [
    {
      label: 'Adress',
      code: 'post_address',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Postcode',
      code: 'post_postcode',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'City',
      code: 'post_city',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Land',
      code: 'post_landcode',
      field: FieldType.select,
      options: landcodes.landcodes,
      hasError: false
    }
  ];
  public visitAdress: FormField[] = [
    {
      label: 'Adress',
      code: 'visit_address',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Postcode',
      code: 'visit_postcode',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'City',
      code: 'visit_city',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Land',
      code: 'visit_landcode',
      field: FieldType.select,
      options: landcodes.landcodes,
      hasError: false
    }
  ];
  public businessInformation: FormField[] = [
    {
      label: 'Business name',
      code: 'nameBusinessRelation',
      field: FieldType.input,
      hasError: false
    },
    {
      label: 'Function',
      code: 'functionBusinessRelation',
      field: FieldType.input,
      hasError: false
    }
  ]

  // public filteredOptions: Observable<string[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private fb: FormBuilder, private relationsCollectionService: RelationsCollectionService) {
    super();
  }

  public ngOnInit() {
    const emptyForm = {
      relationType: '',
      relationStatus: RelationStatus.active,
      relationName: [{ value: '', disabled: true}],
      firstNames: '',
      callSign: '',
      infix: '',
      lastName: ['', Validators.required],
      email: ['', Validators.email ],
      email2: ['', Validators.email ],
      phone: '',
      phone2: '',
      phone3: '',
      website: '',
      dayOfBirth: null,
      post_address: '',
      post_postcode: '',
      post_city: '',
      post_landcode: 'NL',
      visit_address: '',
      visit_postcode: '',
      visit_city: '',
      visit_landcode: 'NL',
      dutchSalutation: '',
      englishSalutation: '',
      dietaryRequirements: '',
      connections: '',
      winner: '',
      reasonNonActive: '',
      broughtInBy: '',
      ffnFriendCancelDate: null,
      nameBusinessRelation: '',
      functionBusinessRelation: '',
      note: '',
      natureOrganisation: false,
      oldDonors: false
    }

    const formObject = { ...emptyForm, ...this.relation }
    formObject.relationName = [{ value: !!this.relation?.relationName ? this.relation?.relationName : '' , disabled: true }];
    formObject.lastName = [!!this.relation?.lastName ? this.relation?.lastName : '', Validators.required ];
    formObject.email = [!!this.relation?.email ? this.relation?.email : '', Validators.email ];
    formObject.email2 = [!!this.relation?.email2 ? this.relation?.email2 : '', Validators.email ];

    this.relationForm = this.fb.group(formObject);

    this.relationForm
      .get('callSign')
      ?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.createAndSetRelationName());

    this.relationForm
      .get('infix')
      ?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.createAndSetRelationName());

    this.relationForm
      .get('lastName')
      ?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.createAndSetRelationName());
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  protected readonly FieldType = FieldType;

  public submitForm() {
    const relationForm = this.relationForm.value;
    relationForm.relationName = relationForm.callSign.replace(/^\s+|\s+$/g, '') + ' ' + relationForm.infix.replace(/^\s+|\s+$/g, '') + ' ' + relationForm.lastName.replace(/^\s+|\s+$/g, '');
    console.log(relationForm);

    (!!relationForm.relationCode ? this.relationsCollectionService.update(relationForm) : this.relationsCollectionService.add(relationForm))
      .subscribe(relation => {
        this.result = relation;
        this.close()
      })
  }

  protected readonly RelationStatus = RelationStatus;

  private createAndSetRelationName() {
    let callSign =  this.relationForm.get('callSign')?.value.replace(/^\s+|\s+$/g, '');
    let infix =  this.relationForm.get('infix')?.value.replace(/^\s+|\s+$/g, '');
    let lastName =  this.relationForm.get('lastName')?.value.replace(/^\s+|\s+$/g, '');
    this.relationForm
      .get('relationName')
      ?.setValue(callSign + ' ' + infix + ' ' + lastName)
  }

  private createAwardYearArray(): Option[] {
    const awardYears: Option[] = [];
    const currentYear = new Date().getFullYear();
    for (let i= 2008; i <= currentYear; i++) {
      awardYears.push({ value: i, label: '' + i });
    }
    return awardYears;
  }
}
