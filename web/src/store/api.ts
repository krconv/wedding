import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import {
  ApiClient,
  Registry,
  CancelablePromise,
  CancelError,
  Person,
  Family,
  Rsvp,
  RsvpCreate,
  RsvpUpdate,
} from "../api";

const LIST = "LIST";

export const api = createApi({
  baseQuery,
  reducerPath: "api",
  refetchOnReconnect: true,
  keepUnusedDataFor: 180,
  tagTypes: ["registry", "people", "families", "rsvps"],
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
    searchForPerson: builder.query<Person, { q: string }>({
      query: ({ q }) => ({
        method: ({ rsvp }) => rsvp.searchForPerson({ q }),
      }),
    }),

    getPerson: builder.query<Person, { id: string }>({
      query: ({ id }) => ({
        method: ({ rsvp }) => rsvp.getPerson({ personId: id }),
      }),
      providesTags: (person) =>
        person ? [{ type: "people", id: person.id }] : [],
    }),

    getFamily: builder.query<Family, { id: string }>({
      query: ({ id }) => ({
        method: ({ rsvp }) => rsvp.getFamily({ familyId: id }),
      }),
      providesTags: (family) => {
        if (!family) {
          return [];
        }

        return [
          { type: "families", id: family.id },
          { type: "people", id: `${LIST}-family-${family.id}` },
          ...family.members.map((person) => ({
            type: "people" as "people",
            id: person.id,
          })),
          { type: "rsvps", id: `${LIST}-family-${family.id}` },
          ...family.members
            .flatMap((person) => (person.rsvp ? [person.rsvp] : []))
            .map((rsvp) => ({ type: "rsvps" as "rsvps", id: rsvp.id })),
        ];
      },
    }),

    createRsvp: builder.mutation<Rsvp, { data: RsvpCreate }>({
      query: ({ data }) => ({
        method: ({ rsvp }) => rsvp.createRsvp({ requestBody: data }),
      }),
      invalidatesTags: (rsvp, error, args) => {
        if (!rsvp) {
          return [];
        }
        return [
          { type: "rsvps", id: rsvp.id },
          ...(args.data.family_id
            ? [
                {
                  type: "families" as "families",
                  id: `${LIST}-family-${args.data.family_id}`,
                },
              ]
            : []),
          ...(args.data.person_id
            ? [
                {
                  type: "people" as "people",
                  id: args.data.person_id,
                },
              ]
            : []),
        ];
      },
    }),

    updateRsvp: builder.mutation<void, { id: string; data: RsvpUpdate }>({
      query: ({ id, data }) => ({
        method: ({ rsvp }) =>
          rsvp.updateRsvp({ rsvpId: id, requestBody: data }),
      }),
      invalidatesTags: (rsvp, error, args) =>
        rsvp ? [{ type: "rsvps", id: args.id }] : [],
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
    const result = await args.method(apiInstance);
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
  useSearchForPersonQuery,
  useGetPersonQuery,
  useGetFamilyQuery,
  useCreateRsvpMutation,
  useUpdateRsvpMutation,
} = api;
