import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useGetTeamsQuery } from '../../features/teams/teamsApi';
import Error from '../ui/Error';
import TeamLoader from '../ui/TeamLoader';
import Modal from "./Modal";
import Team from './Team';

export default function Teams() {
    const { user } = useSelector((state) => state.auth) || {};

    const {data:teams, isLoading, isError} = useGetTeamsQuery({user_id: user.id});

    const [opened, setOpened] = useState(false);

    const controlModal = () => {
        setOpened((prevState) => !prevState);
    };

    // decide what to render
    let content = null;
    if (isLoading) {
        content = (
            <>
                <TeamLoader/>
                <TeamLoader/>
                <TeamLoader/>
                <TeamLoader/>
            </>
        );
    }

    if (!isLoading && isError) {
        content = <Error message="There was an error" />;
    }

    if (!isLoading && !isError && teams?.length === 0) {
        content = <Error message="No teams found!" />;
    }

    if (!isLoading && !isError && teams?.length > 0) {
        content = teams.map((team) => <Team team={team} key={team.id} />);
    }
    
    return (
        <>
            <div className="px-10 mt-6 flex justify-between">
                <h1 className="text-2xl font-bold text-white">Teams</h1>
                <button className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100" >
                    <svg className="w-5 h-5" 
                        fill="none"  
                        viewBox="0 0 24 24" stroke="currentColor" 
                        onClick={controlModal}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" ></path>
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto">
                {content}
            </div>
            {opened && <Modal open={opened} control={controlModal} />}
        </>
    )
}
