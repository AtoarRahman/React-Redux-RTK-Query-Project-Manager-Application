/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { useGetProjectsQuery, useUpdateProjectMutation } from '../../features/projects/projectsApi';
import { useGetTeamsQuery } from '../../features/teams/teamsApi';
import Toastify from '../../utils/Toastify';
import Error from '../ui/Error';
import ProjectLoader from '../ui/ProjectLoader';
import Modal from "./Modal";
import Project from './Project';
import { labels, labelsMap } from './Stages';

export default function Board({ label }) {
    const { user } = useSelector((state) => state.auth) || {};

    const [opened, setOpened] = useState(false);
    const controlModal = () => {
        setOpened((prevState) => !prevState);
    };

    const {data:projects, isLoading, isError } = useGetProjectsQuery({user_id: user.id});
    const {data:teams, isLoading:isTeamLoading, isError:isTeamError } = useGetTeamsQuery({user_id:user.id});

    const projectList = projects?.filter((project) => teams?.some((team) => team.id === project.team_id));

    const [updateProject, { isSuccess:isStageUpdateSuccess, isError:isStageUpdateError }] = useUpdateProjectMutation();

    isStageUpdateSuccess && Toastify.successNotify('Stage update successfull');
    isStageUpdateError && Toastify.errorNotify('There was an error in stage update!');

    const [{ isOver }, itemsRef] = useDrop({
        drop: (item) => {
            updateProject({ 
                id:item.id,
                user_id: user.id,
                data:{
                    ...item, 
                    stage: label,
                    updated_by: user.id,
                    updated_at: new Date(),
                }
            })
        },
        accept: labels.filter((id) => id !== label),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
    });
    
    // decide what to render
    let content = null;
    if (isLoading) {
        content = (
            <>
                <ProjectLoader/>
                <ProjectLoader/>
            </>
        );
    }

    if (!isLoading && !isTeamLoading && isError && isTeamError) {
        content = <Error message="There was an error" />;
    }

    if (!isLoading && !isTeamLoading && !isError && !isTeamError && projectList?.length === 0) {
        content = <Error message="No projects found!" />;
    }

    if (!isLoading && !isTeamLoading && !isError && !isTeamError && projectList?.length > 0) {
        content = projectList.map((item, index) => item.stage === label && (
            <Project project={item} key={item.id} index={index} />
        ));
    }

    return (
        <>
            <div ref={itemsRef} style={{border: `${isOver ? '2px solid rgb(30 41 59 )' : '2px solid transparent'}`}} className={`flex flex-col flex-shrink-0 bg-slate-700 bg-opacity-10 p-3 w-72`}>
                <div className="flex items-center flex-shrink-0 h-10 px-2">
                    <span className="block text-sm font-semibold text-white">{labelsMap[label]}</span>
                    <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-blue-800 bg-white rounded bg-opacity-80">
                        {projectList?.length > 0 && projectList.filter((el)=>el.stage === label).length}
                    </span>
                    {label === 'backlog' && (
                        <button  className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100">
                            <svg  
                                className="w-5 h-5" fill="none" 
                                viewBox="0 0 24 24" stroke="currentColor" 
                                onClick={controlModal} 
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" ></path>
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex flex-col pb-2 overflow-auto">
                    {content}
                </div>
            </div>
            
            {opened && <Modal open={opened} control={controlModal} />}
        </>
    )
}
