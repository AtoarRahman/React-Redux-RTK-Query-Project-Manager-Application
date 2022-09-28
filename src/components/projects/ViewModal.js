/* eslint-disable eqeqeq */
import getAvatar from "gravatar-url";
import { useGetTeamQuery } from '../../features/teams/teamsApi';
import { useGetUsersQuery } from '../../features/users/usersApi';

export default function ViewModal({ open, control, project }) {
    const {data:userList} = useGetUsersQuery();
    const {data:team} = useGetTeamQuery(project.team_id);
    const teamCreator = userList?.filter((user)=>user.id === project.created_by);
    return (
        open && (
            <>
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[500px] space-y-2 bg-gray-800 p-5 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-center text-lg font-extrabold text-white w-full bg-purple-800 py-2 rounded">
                       Project Details
                    </h2>
                    <div className="">
                        <div className="rounded-md shadow-sm">
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Name:</span> {project.name}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Description:</span> {project.description}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Team:</span> {team[0].name}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white flex">
                                    <span className="text-emerald-400">Project Creator:</span>
                                </p>
                                {teamCreator?.length > 0 &&
                                    <div className='rounded text-center p-2 mt-1 bg-gray-700 text-white'>
                                        <img
                                            className="object-cover w-10 h-10 rounded-full m-1 inline"
                                            src={getAvatar(teamCreator[0].email, {
                                                size: 80,
                                            })}
                                            alt={teamCreator[0].email}
                                        />
                                        <br/>
                                        {teamCreator[0].name}<br/>
                                            {teamCreator?.length > 0 && teamCreator[0].email}
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    );
}
