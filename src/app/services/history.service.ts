import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private historySubject = new BehaviorSubject<any[]>(
    JSON.parse(localStorage.getItem('conversionHistory') || '[]')
  );
  history$ = this.historySubject.asObservable();

  addHistory(item: any) {
    const currentHistory = this.historySubject.value;
    const newHistory = [...currentHistory, item];
    localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
    this.historySubject.next(newHistory);
  }
}
