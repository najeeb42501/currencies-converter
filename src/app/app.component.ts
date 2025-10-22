import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from './services/currency.service';
import { HistoryService } from './services/history.service';
import { LoadingSpinnerService } from './services/loading-spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private historyService: HistoryService,
    private loadingService: LoadingSpinnerService
  ) {}

  converterForm!: FormGroup;
  currencies: string[] = [];
  result: number | null = null;
  lastConversion!: { amount: number; fromCurrency: string; toCurrency: string };
  isLoading = false;
  loading$!: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
    this.loadCurrencies();
    this.initForm();
  }

  initForm() {
    this.converterForm = this.fb.group({
      fromCurrency: [null, Validators.required],
      toCurrency: [null, Validators.required],
      amount: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^\d+(\.\d{1,4})?$/),
        ],
      ],
      date: [null],
    });
  }

  loadCurrencies() {
    this.currencyService.getSupportedCurrencies().subscribe({
      next: (res) => (this.currencies = Object.keys(res.data)),
      error: (err) => console.error(err),
    });
  }

  convert() {
    if (this.converterForm.invalid) return;

    this.isLoading = true;
    const { fromCurrency, toCurrency, amount, date } = this.converterForm.value;
    const dateString = date ? date.toISOString().split('T')[0] : undefined;

    this.currencyService
      .convertCurrency(fromCurrency, toCurrency, amount, dateString)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.result = res.result;
          this.lastConversion = { amount, fromCurrency, toCurrency };
          this.saveToHistory();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  saveToHistory() {
    const { fromCurrency, toCurrency, amount, date } = this.converterForm.value;
    const item = {
      from: fromCurrency,
      to: toCurrency,
      amount,
      result: this.result,
      dateUsed: date ? date.toISOString().split('T')[0] : 'Latest',
      time: new Date().toLocaleString(),
    };
    this.historyService.addHistory(item);
  }

  get f() {
    return this.converterForm.controls;
  }

  get convertedResult(): string {
    if (!this.result || !this.lastConversion) return '';
    const { amount, fromCurrency, toCurrency } = this.lastConversion;
    return `${amount} ${fromCurrency} = ${this.result.toFixed(
      4
    )} ${toCurrency}`;
  }
}
