import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JudgeComponent } from '@app/judge/judge.component';
import { AdminComponent } from '@app/admin/admin.component';
import { LoginComponent } from '@app/authentication/login/login.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { AdminGuard } from '@app/authentication/admin.guard';
import { RedirectGuard } from '@app/authentication/redirect.guard';

const redirectLoggedInToItems = () => redirectLoggedInTo(['']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', component: JudgeComponent, canActivate: [RedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToItems } },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
