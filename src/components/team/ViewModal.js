/* eslint-disable eqeqeq */
import getAvatar from "gravatar-url";
import { useGetUsersQuery } from '../../features/users/usersApi';
import { colorsMap } from './Colors';

export default function ViewModal({ open, control, team }) {

    const {data:userList} = useGetUsersQuery();

    const teamCreator = userList?.filter((user)=>user.id === team.created_by);
    const membersData = team.members.length > 0 && userList?.filter((user) => team.members.some((memberId) => user.id === memberId));

    return (
        open && (
            <>
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[500px] space-y-2 bg-gray-800 p-5 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-center text-lg font-extrabold text-white w-full bg-purple-800 py-2 rounded">
                       Team Details
                    </h2>
                    <div className="">
                        <div className="rounded-md shadow-sm">
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Name:</span> {team.name}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Description:</span> {team.description}
                                </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Color:</span> { colorsMap[team.color]}
                                </p>
                            </div>

                            <div className="mb-2">
                                <p className="text-white flex">
                                    <span className="text-emerald-400">Team Creator:</span>
                                    
                                {teamCreator?.length > 0 &&
                                    <><img
                                        className="object-cover w-4 h-4 rounded-full m-1 inline"
                                        src={getAvatar(teamCreator[0].email, {
                                            size: 80,
                                        })}
                                        alt={teamCreator[0].email}
                                    />
                                    {teamCreator[0].name}
                                    </>
                                }
                            </p>
                            </div>
                            <div className="mb-2">
                                <p className="text-white">
                                    <span className="text-emerald-400">Members:</span>
                                </p>
                                <div className="w-full max-h-60 overflow-y-auto">
                                    {membersData.map((m)=>(
                                        <div key={m.id} className='text-white text-center w-1/2 inline-block'>
                                            <div key={m.id} className='rounded p-2 bg-gray-700 m-1'>
                                                
                                                <img
                                                    className="object-cover w-10 h-10 rounded-full m-1 inline"
                                                    src={getAvatar(m.email, {
                                                        size: 80,
                                                    })}
                                                    alt={m.email}
                                                /><br/>
                                                {m.name}<br/>
                                                {m.email}
                                            </div>
                                        </div>
                                     ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    );
}
