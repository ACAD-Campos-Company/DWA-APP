export interface Notification {
    id: string;
    title: string;
    body: string;
    read: boolean;
    timestamp: number;
    type: string;
    image?: string;
}