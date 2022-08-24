import amplitude from "amplitude-js";
import { MutableRefObject, useEffect, useState } from "react";
import { useDebounced } from ".";

export const init = () => {
  // hubspot is initialized from the HTML include

  amplitude.getInstance().init("b92e2c9c3eb57b264dbbd4cbaca07665");
};

export const identify = (details: { id: string; email: string }) => {
  console.debug("Identified User", details);
  hubSpotAnalytics().push(["identify", details]);

  const identify = new amplitude.Identify();
  identify.set("id", details.id);
  identify.set("email", details.email);
  amplitude.identify(identify);
};

export const track = (
  event: "viewed section" | string,
  properties: { [key: "section" | string]: string | number | undefined } = {}
) => {
  console.debug("Tracked Event", { event, properties });
  console.debug(properties);
  hubSpotAnalytics().push([
    "trackCustomBehavioralEvent",
    {
      name: event.replaceAll(" ", "_"),
      properties,
    },
  ]);
  amplitude.getInstance().logEvent(event, properties);
};

export const useTrackView = (
  name: string,
  ref: MutableRefObject<HTMLElement | null>
) => {
  const [inView, setInView] = useState<boolean>(false);
  const debouncedInView = useDebounced(inView, 1000);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const observer = new IntersectionObserver(
        (entries) => {
          setInView(entries.filter((entry) => entry.isIntersecting).length > 0);
        },
        {
          rootMargin: "0px 0px 20% 0px",
          threshold: 0.9,
        }
      );
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, [setInView, ref]);

  useEffect(() => {
    if (debouncedInView) {
      track("viewed section", { section: name });
    }
  }, [debouncedInView, name]);
};

const hubSpotAnalytics = () => {
  return (window as any)._hsq;
};
