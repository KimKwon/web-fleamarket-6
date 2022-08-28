class HistoryStack {
  private historyStack: string[];
  private observers: CallableFunction[];
  constructor() {
    this.historyStack = [location.pathname];
    this.observers = [];
  }

  notify() {
    this.observers.forEach((observer) => {
      observer(this.historyStack.length);
    });
  }

  observe(callbackFn: CallableFunction) {
    this.observers.push(callbackFn);
  }

  push(nextHistory: string) {
    this.historyStack.push(nextHistory);
    this.notify();
  }

  pop() {
    this.historyStack.pop();
    this.notify();
  }

  update(updateHistory: string) {
    this.historyStack[this.historyStack.length - 1] = updateHistory;
  }

  get size() {
    return this.historyStack.length;
  }
}

export default new HistoryStack();
