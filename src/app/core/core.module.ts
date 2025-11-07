import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { ApplicationService } from '@app/core/application.service';
import { HighlightService } from '@app/core/highlight.service';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { UserService } from '@app/core/user.service';
import { RelationsCollectionService } from '@app/core/relations-collection.service';
import { EventCollectionService } from '@app/core/event-collection.service';
import { CollectionService } from '@app/core/collection.service';



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ApplicationCollectionService,
    ApplicationService,
    HighlightService,
    ScoreCollectionService,
    UserService,
    RelationsCollectionService,
    EventCollectionService,
    CollectionService
  ]
})
export class CoreModule { }
