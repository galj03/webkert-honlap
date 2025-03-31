import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIcon
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>(); // ez mit tud pontosan?

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  logout() {
    this.logoutEvent.emit();
  }
}
