import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { useUpdateProjectMutation } from '../../features/projects/projectsApi';
import { useGetTeamQuery, useGetTeamsQuery } from '../../features/teams/teamsApi';
import Toastify from '../../utils/Toastify';
import { capitalize } from '../../utils/utilityFunction';

export default function UpdateModal({ open, control, project }) {
    const { user } = useSelector((state) => state.auth) || {};

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stage, setStage] = useState(undefined);
    const [teamId, setTeamId] = useState(undefined);

    const {data:teams, isError:teamIsError} = useGetTeamsQuery({user_id: user.id});
    const {data:team} = useGetTeamQuery(project.team_id);
    const [updateProject, { isSuccess, isError }] = useUpdateProjectMutation();

    const teamData = teams?.length > 0 && teams.map((el) => ({
        value: el.id,
        label: el.name,
    }));

    useEffect(() => {
        setName(project.name);
        setDescription(project.description);
        setStage(project.stage);
        setTeamId(project.team_id);
    }, [project])

    // listen projects add success
    useEffect(() => {
        if (isSuccess) {
            control();
            Toastify.successNotify('Project Added Successfull');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    teamIsError && Toastify.errorNotify('There was an error in team!');
    isError && Toastify.errorNotify('There was an error!');

    const stages = [
        {label: 'Backlog', value: 'backlog'},
        {label: 'Ready', value: 'ready'},
        {label: 'Doing', value: 'doing'},
        {label: 'Review', value: 'review'},
        {label: 'Blocked', value: 'blocked'},
        {label: 'Done', value: 'done'},
    ]

    const handleSubmit = (e) => {
        e.preventDefault();

        updateProject({ 
            id:project.id,
            user_id: user.id,
            data:{
                name,
                description,
                team_id: teamId, 
                stage,
                created_by: project.created_by,
                updated_by: user.id,
                created_at : project.created_at,
                updated_at: new Date(),
            }
        })
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
                        Update Project
                    </h2>
                    <form className="" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm">
                            {project?.stage === 'backlog' && (
                                <>
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
                                            placeholder="Enter the project name"
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
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-white">
                                            Name of the Team <span className="text-red-400">*</span>
                                        </label>
                                        <Select 
                                            options={teamData} 
                                            name="team_id"
                                            required
                                            classNamePrefix="project_manager"
                                            onChange={(e) => {setTeamId(e.value)}}
                                            defaultValue={{ label:team[0]?.name, value: team[0]?.id}}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="mb-2">
                                <label className="text-white">
                                    Stage <span className="text-red-400">*</span>
                                </label>
                                <Select 
                                    options={stages} 
                                    name="stage"
                                    required
                                    classNamePrefix="project_manager"
                                    onChange={(e) => {setStage(e.value)}}
                                    defaultValue={{ label:capitalize(project.stage), value: project.stage}}
                                />
                            </div>
                            
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                disabled={ name === '' || description === '' || stage === undefined || teamId === undefined}
                            >
                               Update Project
                            </button>
                        </div>
                    </form>
                </div>
            </>
        )
    );
}
