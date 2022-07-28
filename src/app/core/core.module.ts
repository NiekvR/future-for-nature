import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { ApplicationService } from '@app/core/application.service';
import { HighlightService } from '@app/core/highlight.service';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { UserService } from '@app/core/user.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApplicationCollectionService,
    ApplicationService,
    HighlightService,
    ScoreCollectionService,
    UserService
  ]
})
export class CoreModule { }
