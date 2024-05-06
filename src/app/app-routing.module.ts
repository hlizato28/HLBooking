import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, PreventGuard } from './guards/auth-guard.guard';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LapanganComponent } from './pages/lapangan/lapangan.component';
import { MemberComponent } from './pages/member/member.component';
import { BookingComponent } from './pages/booking/booking.component';
import { DownloadComponent } from './components/download/download.component';

const routes: Routes = [
  {path: "", component: LoginComponent, canActivate: [PreventGuard]},

  { path: 'login', component: LoginComponent, canActivate: [PreventGuard] },

  { path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: 'lapangan',
        component: LapanganComponent
      },
      {
        path: 'member',
        component: MemberComponent
      },
      {
        path: 'booking',
        component: BookingComponent
      }
    ]
   },

   { path: 'download', component: DownloadComponent },

  {path: "**", component: NotFoundComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
