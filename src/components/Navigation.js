/* eslint-disable jsx-a11y/anchor-is-valid */
import getAvatar from "gravatar-url";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../assets/images/logo-dark.png";
import { userLoggedOut } from "../features/auth/authSlice";
import Search from "./Search";

export default function Navigation({isSearch}) {
    const { user } = useSelector((state) => state.auth) || {};
    const dispatch = useDispatch();

    const {pathname} = useLocation();


    const logout = () => {
        dispatch(userLoggedOut());
        localStorage.clear();
    };
    return (
        <div className="flex items-center flex-shrink-0 w-full h-16 px-10 sticky top-0 z-40 backdrop-blur transition-colors duration-500 border-b border-slate-900/10 dark:border-slate-50/[0.06] bg-slate-800 supports-backdrop-blur:bg-slate-500 dark:bg-transparent" >
            <Link to="/">
                <img
                    className="h-10"
                    src={logoImage}
                    alt="M. Atoar Rahman"
                />
            </Link>

            <div className="ml-10">
                <Link className={`mx-2 text-sm font-semibold text-${pathname === '/teams' ? 'emerald-400' : 'white' } hover:text-emerald-400`} to="/teams" >Teams</Link>
                <Link className={`mx-2 text-sm font-semibold text-${pathname === '/projects' ? 'emerald-400' : 'white' } hover:text-emerald-400`} to="/projects" >Projects</Link>
            </div>

            {isSearch && <Search/>}
            
            <button
                type="button"
                id="dropdownDefault" data-dropdown-toggle="dropdown" 
                className="flex items-center justify-center h-10 ml-auto overflow-hidden rounded-full cursor-pointer mr-2"
            >
                {user?.id && <>
                    <span className="text-white mr-2">{user.name}</span>
                        <img className="w-6 h-6 ml-auto rounded-full" src={getAvatar(user.email, { size: 80, })} alt={user.email} />
                    </>
                }
            </button>

            <button type="button" className="text-white cursor-pointer p-2" onClick={logout}  title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16"> <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/> <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/> </svg>
            </button>
            
        </div>  
    );
}
