import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/models/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private signalrService = inject(SignalrService);

  login(values: any) {
    let params = new HttpParams();
    //alert(values);
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseurl + 'login', values, { params }).pipe(
      tap(() => this.signalrService.createHubConnection())
    )
  }

  register(values: any) {
    return this.http.post(this.baseurl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseurl + 'account/user-info').pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      })
    )
  }

  logOut() {
    return this.http.post(this.baseurl + 'account/logout', {}).pipe(
      tap(() => this.signalrService.stopHubConnection())
    );
  }

  updateAdress(address: Address) {
    return this.http.post(this.baseurl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if (user) user.address = address;
          return user;
        })
      })
    )
  }

  getAuthState() {
    return this.http.get<{ isAuthenticated: boolean }>(this.baseurl + 'account/auth-status');
  }

}
