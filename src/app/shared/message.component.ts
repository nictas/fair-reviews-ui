import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'fr-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnChanges {
  @Input() message: string | null = null;
  @Input() messageType: 'success' | 'error' | null = null;
  @Input() messageDuration = 5000;
  private timer: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.resetTimer();
    }
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.clearMessage(), this.messageDuration);
  }

  private clearMessage(): void {
    this.message = null;
    this.messageType = null;
  }
}
