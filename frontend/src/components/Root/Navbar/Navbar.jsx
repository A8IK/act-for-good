import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const  [loggedIn, setLoggedIn ] = useState(() => {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";
        return isLoggedIn;
    });

    const navigate = useNavigate();

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

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a>NewsFeed</a></li>
                        <li>
                            <a>Parent</a>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">actForGood</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>NewsFeed</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                        </details>
                    </li>
                    <li><a>CreateHelp</a></li>
                    {loggedIn && <li><a href="/profile">Profile</a></li>}
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