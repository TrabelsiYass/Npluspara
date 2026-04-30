import { Link, useLocation } from 'react-router-dom'; // 1. Import useLocation
import Npluslogo from '../../assets/images/Npluspara.png';
import AccountIcons from './account';
import Search from './headerSearch';
import './index.css';
import Navigation from './Navigation';
import TopBar from './Topbar/Topbar';

const Header = (props) => {
    // 2. Get the current location
    const location = useLocation();

    // 3. Check if the current path is the login page
    const isLoginPage = location.pathname === "/login";

    return (
        <>
            <div className="headerWrapper">
                <TopBar />

                <div className="header">
                    <div className='logo-container'>
                        <div className='containerheader'>
                            <div className='row'>
                                <div className='logoWrapper d-flex align-items-center col-sm-2'>
                                    <Link to={'/'}><img src={Npluslogo} alt='Medilogo'></img></Link>
                                </div>

                                <div className='searchWrapper d-flex align-items-center col-sm-6'>
                                    <Search />
                                    <AccountIcons session={props.session}/>
                                </div>                            
                            </div>       
                        </div>         
                    </div>

                    {/* 4. Conditionally render Navigation only if NOT on login page */}
                    {!isLoginPage && <Navigation />}                    
                </div>
            </div>
        </>
    )
}

export default Header;