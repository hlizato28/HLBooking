import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit {

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { 
        label: 'Lapangan', 
        icon: 'pi pi-fw pi-th-large', 
        routerLink: ['/admin/lapangan'],
      },
      { 
        label: 'Member', 
        icon: 'pi pi-fw pi-users', 
        routerLink: ['/admin/member'] 
      },
      { 
        label: 'Booking', 
        icon: 'pi pi-fw pi-pencil', 
        routerLink: ['/admin/booking'] 
      }
    ];
  }

  activateMenu(label: string) {
    this.items.forEach(item => {
      item.styleClass = item.label === label ? 'active-menu-item' : '';
    });
  }
}