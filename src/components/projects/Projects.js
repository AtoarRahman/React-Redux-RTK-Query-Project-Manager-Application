import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useGetProjectsQuery } from '../../features/projects/projectsApi';
import { useGetTeamsQuery } from '../../features/teams/teamsApi';
import Board from './Board';
import Modal from "./Modal";
import { labels } from './Stages';

export default function Projects() {
  const { user } = useSelector((state) => state.auth) || {};

  const [opened, setOpened] = useState(false);
  const controlModal = () => {
    setOpened((prevState) => !prevState);
  };

  const {data:projects } = useGetProjectsQuery({user_id:user.id})
  const {data:teams } = useGetTeamsQuery({user_id:user.id});

  const projectList = projects?.filter((project) => teams?.some((team) => team.id === project.team_id));

  return (
    <>
      <div className="px-10 mt-6">
        <h1 className="text-2xl font-bold text-white">Project Board</h1>
        {
          projectList?.length === 0 && (
          <button  className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100">
              <svg  
                  className="w-5 h-5" fill="none" 
                  viewBox="0 0 24 24" stroke="currentColor" 
                  onClick={controlModal} 
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" ></path>
              </svg>
          </button>
          )
        }
      </div>
      <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
        { labels.map((label) => <Board label={label} key={label}/>) }
      </div>
      {opened && <Modal open={opened} control={controlModal} />}
    </>
  )
}
