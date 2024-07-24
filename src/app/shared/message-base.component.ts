const defaultDurationMillis = 5000;

export abstract class MessageBaseComponent {
    message: string | null = null;
    messageType: 'success' | 'failure' | null = null;
    messageTimer: any;

    protected showSuccessMessage(message: string, durationMillis: number = defaultDurationMillis) {
        this.messageType = 'success';
        this.showMessage(message, durationMillis);
    }

    protected showFailureMessage(message: string, durationMillis: number = defaultDurationMillis) {
        this.messageType = 'failure';
        this.showMessage(message, durationMillis);
    }

    private showMessage(message: string, durationMillis: number): void {
        this.message = message;
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
        this.messageTimer = setTimeout(() => {
            this.message = null;
            this.messageType = null;
        }, durationMillis);
    }

}