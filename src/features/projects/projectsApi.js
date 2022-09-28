/* eslint-disable eqeqeq */
import io from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: ({user_id}) =>`/projects?sort=id&_order=desc`,

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
                    socket.on("project", (data) => {
                        updateCachedData((draft) => {
                            const project = draft.find((pr) => pr.id == data?.data?.id);
                                
                            if (project?.id) {
                                // Update project
                                project.name = data.data.name;
                                project.description = data.data.description;
                                project.team_id = data.data.team_id;
                                project.stage = data.data.stage;
                            } else {
                                // Add New project
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

        addProject: builder.mutation({
            query: ({ user_id, data }) => ({
                url: "/projects",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const projects = await queryFulfilled;
                    if (projects.data.id) {
                        // update projects cache pessimistically start
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getProjects",
                                {user_id: arg.user_id},
                                (draft) => {
                                    draft.unshift(projects.data)
                                }
                            )
                        );
                        // update projects cache pessimistically end
                    }
                } catch (error) {}
            },
        }),

        updateProject: builder.mutation({
            query: ({ id, user_id, data }) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                // optimistic cache update start
                dispatch(
                    apiSlice.util.updateQueryData(
                        "getProjects",
                        {user_id: arg.user_id},
                        (draft) => {
                            const draftProject = draft.find((project) => project.id == arg.id);
                            draftProject.name = arg.data.name;
                            draftProject.description = arg.data.description;
                            draftProject.team_id = arg.data.team_id;
                            draftProject.stage = arg.data.stage;
                        }
                    )
                );
                // optimistic cache update end                
            },
        }),

        deleteProject: builder.mutation({
            query: ({ id, user_id }) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(arg, { dispatch }) {
                dispatch(
                    apiSlice.util.updateQueryData(
                        "getProjects",
                        {user_id: arg.user_id},
                        (draft) => {
                            return draft.filter((project)=>project.id != arg.id);
                        }
                    )
                );
                // update teams cache pessimistically end
            },
        }),
    }),
});

export const { useGetProjectsQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } = projectsApi;
