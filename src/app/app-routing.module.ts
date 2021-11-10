import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JudgeComponent } from '@app/judge/judge.component';

const routes: Routes = [
  { path: '', component: JudgeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
