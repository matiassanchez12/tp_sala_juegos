import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ModalType = "login" | "register" | null;
export type ModalState = "open" | "close";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private display: BehaviorSubject<{state: ModalState, type: ModalType}> = new BehaviorSubject<{state: ModalState, type: ModalType}>({
    state: 'close',
    type: null
  });
  
  watch(): Observable<{state: ModalState, type: ModalType}> {
    return this.display.asObservable();
  }

  open(type: ModalType) {
    this.display.next({
      state: 'open',
      type: type
    });
  }

  close(type: ModalType) {
    this.display.next({
      state: 'close',
      type: type
    });
  }
}
