/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { useUpdateTeamMutation } from '../../features/teams/teamsApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import Toastify from '../../utils/Toastify';
import { colors, colorsMap } from './Colors';

export default function UpdateModal({ open, control, team }) {
    const { user } = useSelector((state) => state.auth) || {};

    const [UpdateTeam, { isSuccess, isError }] = useUpdateTeamMutation();
    const {data:userList} = useGetUsersQuery();

    const userData = team.members.length > 0 && userList?.filter((user) => !team.members.some((memberId) => user.id === memberId)).map((el) => ({
        value: el.id,
        label: el.name,
    }));
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(undefined);
    const [members, setMembers] = useState(undefined);

    useEffect(() => {
        setName(team.name);
        setDescription(team.description);
    }, [team])   

    // listen teams add/edit success
    useEffect(() => {
        if (isSuccess) {
            control();
            Toastify.successNotify('Team Updated Successfull');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);
    
    isError && Toastify.errorNotify('There was an error!');

    const handleSubmit = (e) => {
        e.preventDefault();
        members.push(...team.members);
        UpdateTeam({
            id: team.id,
            user_id: user.id,
            data:{
                name:team.name,
                description,
                color,
                members,
                created_by: team.created_by,
                updated_by: user.id,
                created_at : team.created_at,
                updated_at: new Date(),
            }
        });
    };

    return (
        open && (
            <>
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[500px] space-y-2 bg-gray-800 p-5 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="text-center text-lg font-extrabold text-white">
                        Update Team
                    </h2>
                    <form className="" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm">
                            <div className="mb-2">
                                <label className="text-white">
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    disabled
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm focus:bg-slate-600 focus:text-white"
                                    placeholder="Enter the team name"
                                    value={name}
                                    
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-white">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm focus:bg-slate-600 focus:text-white"
                                    placeholder="Sescription"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-white">
                                    Color <span className='text-sm text-gray-400'>( For text color of name )</span> <span className="text-red-400">*</span>
                                </label>
                                <Select 
                                    options={colors} 
                                    name="color"
                                    required
                                    classNamePrefix="project_manager"
                                    onChange={(e) => {setColor(e.value)}}
                                    defaultValue={{ label:colorsMap[team.color], value: team.color}}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="text-white">
                                    Members <span className="text-red-400">*</span>
                                </label>
                                <Select 
                                    options={userData} 
                                    name="members"
                                    required
                                    classNamePrefix="project_manager"
                                    isMulti
                                    onChange={(e) => {setMembers(e.map((m)=>Number(m.value)))}}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                disabled={ name === '' || description === '' || members === undefined}
                            >
                               Add Team
                            </button>
                        </div>

                        
                    </form>
                </div>
            </>
        )
    );
}
