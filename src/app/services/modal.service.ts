import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ModalType = "login" | "register" | "loader" | null;
export type ModalState = "open" | "close";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private display: BehaviorSubject<{state: ModalState, type: ModalType}> = new BehaviorSubject<{state: ModalState, type: ModalType}>({
    state: 'close',
    type: null
  });
  private displayLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  watch(): Observable<{state: ModalState, type: ModalType}> {
    return this.display.asObservable();
  }


  watchLoader(): Observable<boolean> {
    return this.displayLoader.asObservable();
  }

  open(type: ModalType) {
    if(type === 'loader'){
      this.displayLoader.next(true);
      return;
    }

    this.display.next({
      state: 'open',
      type: type
    });
  }

  close(type: ModalType) {
    if(type === 'loader'){
      this.displayLoader.next(false);
      return;
    }

    this.display.next({
      state: 'close',
      type: type
    });
  }
}
