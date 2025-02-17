import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyservice =  inject(BusyService);
  busyservice.busy();

  return next(req).pipe(
    delay(300),
    finalize(() => busyservice.idle())
  )
};
