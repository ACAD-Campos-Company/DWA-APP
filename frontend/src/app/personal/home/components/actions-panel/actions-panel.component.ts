import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actions-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions-panel.component.html',
  styleUrls: ['./actions-panel.component.scss']
})
export class ActionsPanelComponent implements OnInit {
  dashboardActions: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setDashboardAction();
  }

  private setDashboardAction(): void {
    this.dashboardActions = [
      {
        icon: 'assets/icons/shoes.svg',
        title: 'Meus Alunos',
        route: '/students'
      },
      {
        icon: 'assets/icons/verified-list.svg',
        title: 'Treinos',
        route: '/trainings',
      }
    ];
  }

  onActionClick(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
