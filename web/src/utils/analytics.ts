import amplitude from "amplitude-js";
import { MutableRefObject, useEffect, useState } from "react";
import { env, useDebounced } from ".";
import * as sentry from "./sentry";

const hubSpotEventNames = {
  "viewed section": "pe6389590_viewed_section",
  "clicked navigation link": "pe6389590_clicked_navigation_link",
  "clicked github link": "pe6389590_clicked_github_link",
  "changed schedule tab": "pe6389590_changed_schedule_tab",
  "opened registry item": "pe6389590_opened_registry_item",
  "opened zola registry": "pe6389590_opened_zola_registry",
};

export const init = () => {
  if (env.IS_DEPLOYED) {
    const script = document.createElement("script");
    script.src = "https://js.hs-scripts.com/6389590.js?businessUnitId=457760";
    document.head.append(script);

    amplitude.getInstance().init("b92e2c9c3eb57b264dbbd4cbaca07665");
  } else {
    console.log("Analytics disabled");
  }
};

export const identify = (details: {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}) => {
  console.debug("Identified User", details);
  if (env.IS_DEPLOYED) {
    hubSpotAnalytics().push(["identify", details]);

    const identify = new amplitude.Identify();
    identify.set("id", details.id);
    if (details.email) identify.set("email", details.email);
    amplitude.identify(identify);

    sentry.identify(details);
  }
};

export const track = (
  event: keyof typeof hubSpotEventNames,
  properties: { [key: "section" | string]: string | number | undefined } = {}
) => {
  console.debug("Tracked Event", { event, properties });
  if (env.IS_DEPLOYED) {
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
          rootMargin: "0px 0px -20% 0px",
          threshold: 0.2,
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
