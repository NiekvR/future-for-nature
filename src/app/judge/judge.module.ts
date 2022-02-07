import { NgModule } from '@angular/core';
import { JudgeComponent } from '@app/judge/judge.component';
import { SharedModule } from '@app/shared/shared.module';
import { ApplicationComponent } from '@app/judge/application/application.component';
import { ScoreSheetComponent } from '@app/judge/score-sheet/score-sheet.component';
import { ScoreInputComponent } from '@app/judge/score-sheet/score-category/score-input/score-input.component';
import { ScoreCategoryComponent } from '@app/judge/score-sheet/score-category/score-category.component';



@NgModule({
    declarations: [
        JudgeComponent,
        ApplicationComponent,
        ScoreSheetComponent,
        ScoreInputComponent,
        ScoreCategoryComponent
    ],
    imports: [
        SharedModule
    ]
})
export class JudgeModule { }
