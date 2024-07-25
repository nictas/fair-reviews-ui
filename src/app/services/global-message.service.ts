import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../shared/message';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {
  private messageSubject = new BehaviorSubject<Message | null>(null);
  message$ = this.messageSubject.asObservable();
  messageTimer: any;

  get defaultDurationMillis() {
    return 10000;
  }

  showSuccessMessage(message: string, durationMillis: number = this.defaultDurationMillis) {
    this.showMessage({ message, messageType: 'success' }, durationMillis);
  }

  showFailureMessage(message: string, durationMillis: number = this.defaultDurationMillis) {
    this.showMessage({ message, messageType: 'failure' }, durationMillis);
  }

  private showMessage(message: Message, durationMillis: number): void {
    this.messageSubject.next(message);
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }
    if (durationMillis !== Infinity) {
      this.messageTimer = setTimeout(() => this.messageSubject.next(null), durationMillis);
    }
  }

}
