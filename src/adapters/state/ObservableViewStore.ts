/**
 * Holds the latest presented view model for a single screen and notifies subscribed listeners.
 */
export class ObservableViewStore<TView> {
  private currentView: TView | undefined;
  private readonly listeners = new Set<(view: TView) => void>();

  public get current(): TView | undefined {
    return this.currentView;
  }

  public publish(view: TView): void {
    this.currentView = view;
    this.listeners.forEach((listener) => listener(view));
  }

  public subscribe(listener: (view: TView) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
