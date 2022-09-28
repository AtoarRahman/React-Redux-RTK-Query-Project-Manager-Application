/* eslint-disable eqeqeq */
import io from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const teamsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeams: builder.query({
            query: ({user_id}) =>`/teams?members_like=${user_id}&_sort=id&_order=desc`,
            
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // create socket
                const socket = io(process.env.REACT_APP_API_URL, {
                    reconnectionDelay: 1000,
                    reconnection: true,
                    reconnectionAttemps: 10,
                    transports: ["websocket"],
                    agent: false,
                    upgrade: false,
                    rejectUnauthorized: false,
                });

                try {
                    await cacheDataLoaded;
                    socket.on("team", (data) => {
                        updateCachedData((draft) => {
                            const team = draft.find((tm) => tm.id == data?.data?.id);   
                            if (team?.id) {
                                // Update team
                                team.description = data.data.description;
                                team.color = data.data.color;
                                team.members = [...team.members, ...data?.data?.members];
                            } else {
                                // Add New team
                                if(arg.user_id != data.data.created_by){
                                    return [ data.data, ...draft ]
                                }
                            }
                        });
                    });
                } catch (err) {}

                await cacheEntryRemoved;
                socket.close();
            },
        }),

        getTeam: builder.query({
            query: (id) =>`/teams?id=${id}`,            
        }),

        addTeam: builder.mutation({
            query: ({ user_id, data }) => ({
                url: "/teams",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const teams = await queryFulfilled;
                    if (teams.data.id) {
                        // update teams cache pessimistically start
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getTeams",
                                {user_id: arg.user_id},
                                (draft) => {
                                    draft.unshift(teams.data)
                                }
                            )
                        );
                        // update teams cache pessimistically end
                    }
                } catch (error) {}
            },
        }),

        updateTeam: builder.mutation({
            query: ({ id, data, user_id }) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                // optimistic cache update start
                dispatch(
                    apiSlice.util.updateQueryData(
                        "getTeams",
                        {user_id: arg.user_id},
                        (draft) => {
                            const draftTeam = draft.find((tm) => tm.id == arg.id);
                            draftTeam.description = arg.data.description;
                            draftTeam.color = arg.data.color;
                            draftTeam.members = [...arg.data.members, ...draftTeam.members];
                        }
                    )
                );
                // optimistic cache update end                
            },
        }),

        deleteTeam: builder.mutation({
            query: ({ id, user_id }) => ({
                url: `/teams/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(arg, { dispatch }) {
                dispatch(
                    apiSlice.util.updateQueryData(
                        "getTeams",
                        {user_id: arg.user_id},
                        (draft) => {
                            return draft.filter((team)=>team.id != arg.id);
                        }
                    )
                );
                // update teams cache pessimistically end
            },
        }),
    }),
});

export const { useGetTeamsQuery, useGetTeamQuery, useAddTeamMutation, useUpdateTeamMutation, useDeleteTeamMutation } = teamsApi;
