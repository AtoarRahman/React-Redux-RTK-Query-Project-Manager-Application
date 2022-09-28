/* eslint-disable react-hooks/exhaustive-deps */
import getAvatar from "gravatar-url";
import moment from 'moment';
import React, { useState } from 'react';
import { useDrag } from "react-dnd";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useDeleteProjectMutation } from '../../features/projects/projectsApi';
import { useGetTeamQuery } from '../../features/teams/teamsApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import Toastify from '../../utils/Toastify';
import UpdateModal from "./UpdateModal";
import ViewModal from "./ViewModal";

export default function Project({project, index}) {
  const { user } = useSelector((state) => state.auth) || {};
  const { search } = useSelector((state) => state.filter) || {};

  const {data:userList} = useGetUsersQuery();
  const {data:team} = useGetTeamQuery(project.team_id);
  const [deleteProject, {isSuccess, isError}] = useDeleteProjectMutation()

  const [opened, setOpened] = useState(false);
  const controlModal = () => {
      setOpened((prevState) => !prevState);
  };

  const [viewOpened, setViewOpened] = useState(false);
  const controlViewModal = () => {
      setViewOpened((prevState) => !prevState);
  };

  const teamCreator = userList?.filter((user)=>user.id === project.created_by);
  const filterItem = project?.name?.toLowerCase().includes(search.toLowerCase());

  const updateHandel = () =>{
    controlModal();
  }

    const deleteHandel = () =>{
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#950404',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true,
      }).then(async (result) => {
          if (result.isConfirmed) {deleteProject({id:project.id, user_id: user.id,})}
      })
  }

  isSuccess && Toastify.successNotify('Team Deleted Successfull');
  isError && Toastify.errorNotify('There was an error!');

  const detailsViewHandel = () =>{
    controlViewModal();
  }

  const [{ isDragging }, dragRef] = useDrag({
    type: project.stage,
    item: () => ({ ...project, index }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (item && dropResult) {}
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <div ref={dragRef} 
        style={{
          border: `${isDragging ? 
          '2px solid pink' : search && filterItem ? 
          '2px dashed #cd0404' : '2px dashed transparent'}`
        }} 
        className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"  
        draggable="true" 
      >
        {project?.stage === 'backlog' && (
          <button  onClick={ () => deleteHandel() } className="absolute top-0 right-14 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>
          </button>
        )}

        <button onClick={ () => detailsViewHandel() } className="absolute top-0 right-7 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex" >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/> </svg>
        </button>

        <button onClick={ () => updateHandel() } className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex">
            <svg className="w-4 h-4 fill-current"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
        </button>
        {team?.length > 0 && (
          <span  style={{background:`rgba( ${team[0].color}, 0.2)`, color: `rgb(${team[0].color})`}} 
          className={`flex items-center h-6 px-3 text-xs font-semibold rounded-full`} >
            {team[0].name}
          </span>
        )}
        
        <h4 className="mt-3 text-sm font-medium">
            {project?.name}
        </h4>
        <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400 overflow-hidden" >
            <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 leading-none">{moment(project?.created_at).format('DD MMM')}</span>
            </div>

            {teamCreator?.length > 0 && <img 
                className="w-5 h-5 ml-auto rounded-full" src={getAvatar(teamCreator[0].email, {
                  size: 80,
              })}
              alt={teamCreator[0].email} />
            }
            
        </div>
      </div>
      {opened && <UpdateModal open={opened} control={controlModal} project={project}/>}
            {viewOpened && <ViewModal open={viewOpened} control={controlViewModal} project={project}/>}
    </>
  )
}
