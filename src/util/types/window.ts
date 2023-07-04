// add umami to window
declare global {
  interface Window {
    umami: {
      trackEvent: (event: string, data?: any) => void;
    };
  }
}

export {};
