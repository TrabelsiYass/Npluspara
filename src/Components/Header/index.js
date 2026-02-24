import { Link } from 'react-router-dom';
import Npluslogo from '../../assets/images/Npluspara.png';
import AccountIcons from './account';
import Search from './headerSearch';
import './index.css';
import Navigation from './Navigation';
import TopBar from './Topbar/Topbar';






const Header =(props) => {
    
    return(
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
                    <Navigation />                    
                    
                </div>
            </div>
        </>
    )

}

export default Header ;