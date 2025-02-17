import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  loading = false;
  loadingcount = 0;

  busy() {
    this.loadingcount++;
    this.loading = true;
  }
  
  idle(){
    this.loadingcount--;
    if(this.loadingcount <=0){
      this.loading= false;
      this.loadingcount = 0;
    }
      
  }

}
