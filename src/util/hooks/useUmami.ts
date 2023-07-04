const useUmami = () => {
  return {
    trackEvent:
      typeof window !== "undefined"
        ? window.umami.trackEvent
        : (event: string, data: any) => {},
  };
};

export default useUmami;
