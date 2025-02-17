import {  Message } from "./Database";

export class Queue {
    private messages: Map<string, Message>
    private workerProcessing: Map<string, number>

    constructor() {
        this.messages = new Map<string, Message>();
        this.workerProcessing = new Map<string, number>();
    }

    Enqueue = (message: Message) => {
        this.messages.set(message.id, message)
    }

    private hasConflict(message: Message): boolean {
        for (const lockedMessageId of this.workerProcessing.keys()) {
            const lockedMessage = this.messages.get(lockedMessageId);
            if (lockedMessage && lockedMessage.key === message.key) {
                return true;
            }
        }
        return false;
    }

    private lockMessage(id: string, workerId: number): void {
        this.workerProcessing.set(id, workerId);
    }

    Dequeue = (workerId: number): Message | undefined => {
        for (const [id, message] of this.messages) {
            if (this.workerProcessing.has(id)) {
                continue;
            }

            if (!this.hasConflict(message)) {
                this.lockMessage(id, workerId);
                return message;
            }
        }

        return;
    }

    Confirm = (workerId: number, messageId: string) => {
        const workerWithAccess = this.workerProcessing.get(messageId);
        if (workerWithAccess !== workerId) {
            console.error('Wrong worker trying to confirm');
            return;
        }

        const message = this.messages.get(messageId);
        if (!message) {
            return;
        }

        this.messages.delete(messageId);
        this.workerProcessing.delete(messageId);
    }

    Size = () => {
        return this.messages.size;
    }
}

