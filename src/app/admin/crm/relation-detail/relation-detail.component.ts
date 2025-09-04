import { Component, Input, OnInit } from '@angular/core';
import { Relation, RelationStatus } from '@app/models/relation.model';
import { DropoutComponent } from '@app/admin/crm/relation-detail/dropout/dropout.component';
import { NgIf } from '@angular/common';
import * as moment from 'moment';
import { AppUser } from '@app/models/app-user';
import { AddUserComponent } from '@app/admin/manage-users/add-user/add-user.component';
import { NgxModalService } from 'ngx-modalview';
import { EditRelationComponent } from '@app/admin/crm/edit-relation/edit-relation.component';

@Component({
  selector: 'ffn-relation-detail',
  standalone: true,
  imports: [
    DropoutComponent,
    NgIf
  ],
  templateUrl: './relation-detail.component.html',
  styleUrl: './relation-detail.component.scss'
})
export class RelationDetailComponent implements OnInit {
  @Input() relation!: Relation;
  public hasRelationToFFN = false;


  public RelationStatus = RelationStatus;

  constructor(private modalService: NgxModalService) { }

  ngOnInit(): void {
    this.hasRelationToFFN = this.relationHasRelationToFFN();
  }

  public getDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  public relationHasRelationToFFN() {
    return !!this.relation.board && !!this.relation.team && !!this.relation.nsc && !!this.relation.isc && !!this.relation.rva && !!this.relation.ffnFriend && !!this.relation.globeGuard;
  }

  public updateRelation(relation: Relation) {
    this.modalService.addModal(EditRelationComponent, { relation: relation }).subscribe(relation => this.relation = relation);
  }
}
