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
import { ManageUsersComponent } from '@app/admin/manage-users/manage-users.component';
import { ApplicantsOverviewComponent } from '@app/admin/applicants-overview/applicants-overview.component';
import { CrmComponent } from '@app/admin/crm/crm.component';
import { PdfMergeComponent } from '@app/admin/pdf-merge/pdf-merge.component';

const redirectLoggedInToItems = () => redirectLoggedInTo(['']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const  routes: Routes = [
  { path: '', component: JudgeComponent, canActivate: [RedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToItems } },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminComponent
      },
      {
        path: 'users',
        component: ManageUsersComponent
      },
      {
        path: 'applicants',
        component: ApplicantsOverviewComponent
      },
      // {
      //   path: 'crm',
      //   component: CrmComponent
      // }
      {
        path: 'pdf',
        component: PdfMergeComponent
      },
    ]
  },
  { path: 'admin/', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];
