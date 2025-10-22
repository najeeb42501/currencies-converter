import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private apiUrl = 'http://localhost:3100/api/currency'; // Base URL

  constructor(private http: HttpClient) {}

  // 1. Get supported currencies
  getSupportedCurrencies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/currencies`);
  }

  // 2. Get latest rates (optional base currency)
  getLatestRates(base?: string): Observable<any> {
    let params = new HttpParams();
    if (base) params = params.set('base', base);
    return this.http.get(`${this.apiUrl}/latest`, { params });
  }

  // 3. Get historical rates for a specific date
  getHistoricalRates(date: string, base?: string): Observable<any> {
    let params = new HttpParams().set('date', date);
    if (base) params = params.set('base', base);
    return this.http.get(`${this.apiUrl}/historical`, { params });
  }

  // 4. Convert currency (optional date for historical conversion)
  convertCurrency(
    from: string,
    to: string,
    amount: number,
    date?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('amount', amount.toString());
    if (date) params = params.set('date', date);
    return this.http.get(`${this.apiUrl}/convert`, { params });
  }
}
