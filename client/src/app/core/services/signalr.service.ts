import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { Order } from '../../shared/models/order';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  hubUrl = environment.hubUrl;
  hubconnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    this.hubconnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build()

    this.hubconnection.start()
      .catch(error => console.log(error));

    this.hubconnection.on('ordercompleteNotification', (order: Order) => {
      this.orderSignal.set(order);
    })
  }

  stopHubConnection() {
    if (this.hubconnection?.state === HubConnectionState.Connected) {
      this.hubconnection.stop().catch(error => console.log(error))
    }
  }

}
