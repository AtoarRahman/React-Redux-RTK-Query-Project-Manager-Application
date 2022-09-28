import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { useAddTeamMutation } from '../../features/teams/teamsApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import Toastify from '../../utils/Toastify';
import { colors } from './Colors';

export default function Modal({ open, control }) {
    const { user } = useSelector((state) => state.auth) || {};

    const [addTeam, { isSuccess, isError }] = useAddTeamMutation();
    const {data:userList} = useGetUsersQuery();

    const userData = userList?.filter((u)=>u.id !== user.id).map((el) => ({
        value: el.id,
        label: el.name,
    }))

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(undefined);
    const [members, setMembers] = useState(undefined);



    // listen teams add success
    useEffect(() => {
        if (isSuccess) {
            control();
            Toastify.successNotify('Team Added Successfull');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    isError && Toastify.errorNotify('There was an error!');

    const handleSubmit = (e) => {
        e.preventDefault();
        members.push(user.id);
        addTeam({
            user_id: user.id,
            data: {
                name,
                description,
                color,
                members,
                created_by: user.id,
                updated_by:null,
                created_at : new Date(),
                updated_at:null,
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
                        Add Team
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
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm focus:bg-slate-600 focus:text-white"
                                    placeholder="Enter the team name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    
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
                                disabled={ name === '' || description === '' || color === undefined || members === undefined}
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
