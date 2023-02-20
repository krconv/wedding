import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";
import {
  ApiClient,
  ApiError,
  CancelablePromise,
  CancelError,
  Event,
  Faq,
  GuestGroup,
  GuestGroupSearchResult,
  GuestGroupUpdate,
  Registry,
  UpdateMessage,
} from "../api";
import { sentry } from "../utils";

const LIST = "LIST";

export const api = createApi({
  baseQuery,
  reducerPath: "api",
  refetchOnReconnect: true,
  keepUnusedDataFor: 180,
  tagTypes: ["registry", "guest-groups"],
  endpoints: (builder) => ({
    /**
     * Registry Endpoints
     */
    getRegistry: builder.query<Registry, {}>({
      query: () => ({
        method: ({ registry }) => registry.getRegistry(),
      }),
      providesTags: (registry) =>
        registry ? [{ type: "registry", id: LIST }] : [],
    }),

    /**
     * RSVP Endpoints
     */
    searchForGuestGroup: builder.query<GuestGroupSearchResult[], { q: string }>(
      {
        query: ({ q }) => ({
          method: ({ rsvp }) =>
            rsvp.searchForGuestGroup({ requestBody: { q } }),
        }),
      }
    ),

    getGuestGroup: builder.query<GuestGroup, { uuid: string }>({
      query: ({ uuid }) => ({
        method: ({ rsvp }) => rsvp.getGuestGroup({ groupUuid: uuid }),
      }),
      transformResponse: (guestGroup: GuestGroup) => ({
        ...guestGroup,
        events: guestGroup.events.sort((a, b) =>
          dayjs(a.starts_at).diff(dayjs(b.starts_at), "minutes")
        ),
      }),
      providesTags: (guestGroup) =>
        guestGroup ? [{ type: "guest-groups", id: guestGroup.id }] : [],
    }),

    updateGuestGroup: builder.mutation<void, { data: GuestGroupUpdate }>({
      query: ({ data }) => ({
        method: ({ rsvp }) => rsvp.updateGuestGroup({ requestBody: data }),
      }),
      invalidatesTags: (guestGroup, error, args) => {
        if (error) {
          return [];
        }
        return [{ type: "guest-groups", id: args.data.id }];
      },
    }),

    /**
     * Schedule Endpoints
     */
    getSchedule: builder.query<Event[], {}>({
      query: () => ({
        method: ({ schedule }) => schedule.getSchedule(),
      }),
    }),

    /**
     * FAQ Endpoints
     */
    getFaqs: builder.query<Faq[], {}>({
      query: () => ({
        method: ({ faq }) => faq.getFaqs(),
      }),
    }),

    getUpdateMessage: builder.query<UpdateMessage | null, {}>({
      query: () => ({
        method: ({ faq }) => faq.getUpdateMessage(),
        expectedStatusCodes: [200, 404],
      }),
    }),
  }),
});

/**
 * Helpers
 */
const apiInstance = new ApiClient();

async function baseQuery<Result>(
  args: {
    method: (api: ApiClient) => CancelablePromise<Result | any>;
    expectedStatusCodes?: number[];
  },
  { signal }: BaseQueryApi
): Promise<{ data: Result } | { error: { status?: number; data: any } }> {
  try {
    if (signal.aborted) {
      throw new CancelError("Request was aborted");
    }

    const promise = args.method(apiInstance);
    signal.onabort = () => promise.cancel();
    const result = await promise;
    return {
      data: result,
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      if (!args.expectedStatusCodes?.includes(err.status)) {
        sentry.capture(
          new Error(`Unexpected API error: ${err.status} (${err.statusText})`, {
            cause: err,
          }),
          (scope) => scope.setExtras(err)
        );
      }
      return {
        error: {
          status: err.status,
          data: err.body,
        },
      };
    } else {
      sentry.capture(err);
      return {
        error: {
          data: String(err),
        },
      };
    }
  }
}

export const {
  usePrefetch,
  useGetRegistryQuery,
  useSearchForGuestGroupQuery,
  useGetGuestGroupQuery,
  useUpdateGuestGroupMutation,
  useGetScheduleQuery,
  useGetFaqsQuery,
  useGetUpdateMessageQuery,
} = api;
