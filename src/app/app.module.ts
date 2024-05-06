import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MenuModule } from 'primeng/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { LapanganComponent } from './pages/lapangan/lapangan.component';
import { CalendarModule } from 'primeng/calendar';
import { MemberComponent } from './pages/member/member.component';
import { BookingComponent } from './pages/booking/booking.component';
import { DownloadComponent } from './components/download/download.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    NotFoundComponent,
    NavbarComponent,
    SideMenuComponent,
    LapanganComponent,
    PaginationComponent,
    MemberComponent,
    BookingComponent,
    DownloadComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    RouterModule,
    BrowserModule,
    PanelMenuModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CardModule,
    InputTextModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    BrowserAnimationsModule,
    TableModule,
    PaginatorModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
