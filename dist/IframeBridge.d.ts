/**
 * UltraFab 3D Laboratory Studio - IframeBridge.ts
 * Bi-Directional typed postMessage communication bridge for Next.js / Host Parent Integration
 */
import { OutboundMessageType } from "./types.js";
export declare class IframeBridge {
    app: any;
    constructor(appContext: any);
    private initMessageListener;
    /**
     * Send Typed Outgoing Message to Parent Window
     */
    send(type: OutboundMessageType, payload?: any): void;
    notifyReady(): void;
}
