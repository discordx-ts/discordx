export class Timer {
  public id: NodeJS.Timeout;
  private _whenWillExecute: number;

  public constructor(callback: (...args: unknown[]) => void, delay: number) {
    this._whenWillExecute = Date.now() + delay;
    this.id = setTimeout(callback, delay);
  }

  public get timeLeft(): number {
    return this._whenWillExecute - Date.now();
  }

  public clearTimer(): void {
    clearTimeout(this.id);
    this._whenWillExecute = -1;
  }
}
