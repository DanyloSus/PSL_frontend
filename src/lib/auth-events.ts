type Listener = () => void;

const listeners = new Set<Listener>();

export const authEvents = {
  onUnauthenticated(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
  emitUnauthenticated() {
    listeners.forEach(listener => listener());
  }
};
