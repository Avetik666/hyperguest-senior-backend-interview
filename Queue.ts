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

    Dequeue = (workerId: number): Message | undefined => {
        const [messageId] = this.messages.keys();
        if (this.workerProcessing.has(messageId)) {
            return;
        }
        const message  = this.messages.get(messageId);
        this.workerProcessing.set(messageId, workerId);
        return message;
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

