import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menuOpen = true;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 