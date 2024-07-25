import { Component, OnInit } from '@angular/core';
import { GlobalMessageService } from '../services/global-message.service';

@Component({
  selector: 'fr-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {

  message: string | null = null;
  messageType: 'success' | 'failure' | null = null;

  constructor(private messageService: GlobalMessageService) { }

  ngOnInit(): void {
    this.messageService.message$.subscribe(message => {
      if (message) {
        this.message = message.message;
        this.messageType = message.messageType;
      } else {
        this.message = null;
        this.messageType = null;
      }
    })
  }

}
