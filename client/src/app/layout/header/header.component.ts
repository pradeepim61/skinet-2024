import { Component, inject } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatBadge} from '@angular/material/badge';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDivider
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  busyservice = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);

  logout() {
    this.accountService.logOut().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    })

  }


}
