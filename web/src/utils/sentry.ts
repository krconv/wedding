import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { env } from ".";

export const init = () => {
  if (env.IS_DEPLOYED) {
    Sentry.init({
      dsn: "https://cc12e2443ed34ca2b64179f19d2a8008@o4504710244139008.ingest.sentry.io/4504710318063616",
      integrations: [new BrowserTracing(), new Sentry.Replay()],

      replaysSessionSampleRate: 1.0,
      tracesSampleRate: 1.0,
    });
  }
};

export const identify = ({
  id,
  firstName,
  lastName,
}: {
  id?: string;
  firstName?: string;
  lastName?: string;
}) => {
  Sentry.setUser({ id, firstName, lastName });
};
