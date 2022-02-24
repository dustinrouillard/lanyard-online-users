import { EventEmitter } from 'events';

import { LanyardPresence } from '../types/lanyard';

enum Op {
  Event,
  Hello,
  Initialize,
  Heartbeat,
}

enum Event {
  INIT_STATE = 'INIT_STATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
}

interface SocketData extends Partial<LanyardPresence> {
  heartbeat_interval?: number;
}

interface SocketMessage {
  op: Op;
  t?: Event;
  d?: SocketData;
}

export interface Lanyard {
  ws: WebSocket;
  heartbeat: NodeJS.Timer;
  user_id: string;
  users: Map<string, LanyardPresence>;

  on(event: 'change', listener: (users: Map<string, LanyardPresence>) => void): this;
}

export class Lanyard extends EventEmitter {
  constructor() {
    super();

    this.ws = new WebSocket('wss://api.lanyard.rest/socket');

    // Socket open handler
    this.ws.addEventListener('open', () => this.emit('connected'));

    // Message listener
    this.ws.addEventListener('message', (e) => {
      try {
        this.message(JSON.parse(e.data));
      } catch (error) {}
    });

    // Close event for websocket
    this.ws.addEventListener('close', () => clearInterval(this.heartbeat));
  }

  private send(op: Op, d?: any): void {
    if (this.ws.readyState != this.ws.OPEN) return;
    return this.ws.send(JSON.stringify({ op, d }));
  }

  private subscribe(): void {
    return this.send(Op.Initialize, { subscribe_to_all: true });
  }

  private sendHeartbeat(): void {
    return this.send(Op.Heartbeat);
  }

  private message(data: SocketMessage): void {
    switch (data.op) {
      case Op.Hello:
        // Got hello, start our heartbeat interval
        this.heartbeat = setInterval(() => this.sendHeartbeat(), data.d.heartbeat_interval);

        // Subscribe to our user id
        this.subscribe();
        break;

      case Op.Event:
        switch (data.t) {
          case Event.INIT_STATE: {
            this.users = new Map(Object.entries(data.d));
            this.emit('change', this.users);
            break;
          }
          case Event.PRESENCE_UPDATE:
            this.users.set(data.d.discord_user.id, data.d as LanyardPresence);
            this.emit('change', this.users);

            break;

          default:
            break;
        }

        break;
      default:
        break;
    }
  }
}

export const lanyard = typeof window != 'undefined' && new Lanyard();
