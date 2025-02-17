import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedrequest = req.clone({
    withCredentials: true
  })
  return next(clonedrequest);
};
