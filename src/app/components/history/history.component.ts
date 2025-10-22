import { Component } from '@angular/core';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  history: any[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.historyService.history$.subscribe((h) => (this.history = h));
  }
}
