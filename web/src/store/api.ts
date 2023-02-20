import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";
import {
  ApiClient,
  Registry,
  CancelablePromise,
  CancelError,
  GuestGroupSearchResult,
  GuestGroup,
  GuestGroupUpdate,
  Event,
} from "../api";

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
  }),
});

/**
 * Helpers
 */
const apiInstance = new ApiClient();

async function baseQuery<Result>(
  args: {
    method: (api: ApiClient) => CancelablePromise<Result | any>;
    notificationIfErrored?: string | boolean;
  },
  { signal }: BaseQueryApi
): Promise<{ data: Result } | { error: { status: number; data: any } }> {
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
    return {
      error: {
        status: err?.status || 500,
        data: err?.data,
      },
    };
  }
}

export const {
  usePrefetch,
  useGetRegistryQuery,
  useSearchForGuestGroupQuery,
  useGetGuestGroupQuery,
  useUpdateGuestGroupMutation,
  useGetScheduleQuery,
} = api;
