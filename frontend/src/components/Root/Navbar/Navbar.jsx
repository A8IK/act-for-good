import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
    const  [loggedIn, setLoggedIn ] = useState(() => {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";
        return isLoggedIn;
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storageChange = () => {
            const loggedIn = localStorage.getItem("loggedIn") == "true";
            setLoggedIn(loggedIn);
        };

        window.addEventListener('storage', storageChange);

        return () => {
            window.removeEventListener('storage', storageChange);
        };
    },[])

    useEffect(() => {
        console.log("Updating localStorage. loggedIn:", loggedIn);
        localStorage.setItem("loggedIn", loggedIn ? "true" : "false");
    }, [loggedIn]);

    const handleAuth = () => {
        if (loggedIn) {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("token");
            setLoggedIn(false);
            navigate('/login');
        }
        else {
            navigate('/login');
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="navbar bg-base-100 shadow-2xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/event" className={`${isActive('/event') ? 'text-yellow-600 font-bold' : ''}`}>NewsFeed</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">actForGood</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to='/event' className={`${isActive('/event') ? 'text-yellow-600 font-bold' : ''}`}>NewsFeed</Link></li>
                    <li><Link to="/create" className={`${isActive('/create') ? 'text-yellow-600 font-bold' : ''}`}>CreateHelp</Link></li>
                    {loggedIn && <li><Link to="/profile" className={`${isActive('/profile') ? 'text-yellow-600 font-bold' : ''}`}>Profile</Link></li>}
                </ul>
            </div>
            <div className="navbar-end">
                <button className="btn" onClick={handleAuth}>
                    {loggedIn ? "Log out" : "Log in"}
                </button>
            </div>
        </div>
    )
}

export default NavBar;