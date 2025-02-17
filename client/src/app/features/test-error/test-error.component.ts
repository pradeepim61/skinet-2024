import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})

export class TestErrorComponent {
  baseUrl = 'http://localhost:5000/api/';
  private http = inject(HttpClient);
  validationerrors?: string[];

  get404error() {
    this.http.get(this.baseUrl + 'buggy/notfound').subscribe({
      next: response => console.log(response),
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  get400error() {
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get401error() {
    this.http.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get500error() {
    this.http.get(this.baseUrl + 'buggy/internalerror').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400Validationerror() {
    this.http.post(this.baseUrl + 'buggy/validationerror', {}).subscribe({
      next: response => console.log(response),
      error: error => this.validationerrors = error
    })
  }

}

