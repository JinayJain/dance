const useUmami = () => {
  return {
    trackEvent:
      typeof window !== "undefined"
        ? window.umami.trackEvent
        : // eslint-disable-next-line @typescript-eslint/no-empty-function
          (_event: string, _data: any) => {},
  };
};

export default useUmami;
