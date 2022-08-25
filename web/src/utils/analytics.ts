import amplitude from "amplitude-js";
import { MutableRefObject, useEffect, useState } from "react";
import { env, useDebounced } from ".";

const hubSpotEventNames = {
  "viewed section": "pe6389590_viewed_section",
  "clicked navigation link": "pe6389590_clicked_navigation_link",
  "changed schedule tab": "pe6389590_changed_schedule_tab",
};

export const init = () => {
  if (env.isDeployed) {
    const script = document.createElement("script");
    script.src = "https://js.hs-scripts.com/6389590.js?businessUnitId=457760";
    document.head.append(script);

    amplitude.getInstance().init("b92e2c9c3eb57b264dbbd4cbaca07665");
  } else {
    console.log("Analytics disabled");
  }
};

export const identify = (details: { id: string; email: string }) => {
  console.debug("Identified User", details);
  if (env.isDeployed) {
    hubSpotAnalytics().push(["identify", details]);

    const identify = new amplitude.Identify();
    identify.set("id", details.id);
    identify.set("email", details.email);
    amplitude.identify(identify);
  }
};

export const track = (
  event: keyof typeof hubSpotEventNames,
  properties: { [key: "section" | string]: string | number | undefined } = {}
) => {
  console.debug("Tracked Event", { event, properties });
  if (env.isDeployed) {
    hubSpotAnalytics().push([
      "trackCustomBehavioralEvent",
      {
        name: hubSpotEventNames[event],
        properties,
      },
    ]);
    amplitude.getInstance().logEvent(event, properties);
  }
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
