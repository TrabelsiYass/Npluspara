import React from 'react';
import Button from '@mui/material/Button';
import { FaLocationDot } from "react-icons/fa6";
import './index.css';
import Dialog from '@mui/material/Dialog';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';
import Slide from '@mui/material/Slide';


const Transition = React.forwardRef(function Transition(props,ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const RegionDropdown = () => {



    const [isOperModal, setisOpenModal] = useState(false);
    const [selectedRegion, setselectedRegion] = useState("Tunis");
    const [searchTerm, setSearchTerm] = useState("");

    const regions = [
        "Ariana",
        "Béja",
        "Ben Arous",
        "Bizerte",
        "Gabès",
        "Gafsa",
        "Jendouba",
        "Kairouan",
        "Kasserine",
        "Kebili",
        "Kef",
        "Mahdia",
        "Manouba",
        "Medenine",
        "Monastir",
        "Nabeul",
        "Sfax",
        "Sidi Bouzid",
        "Siliana",
        "Sousse",
        "Tataouine",
        "Tozeur",
        "Tunis",
        "Zaghouan",
      ];


    const filteredRegions = regions.filter(region =>
        region.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const selectRegion=(region)=>{
        setselectedRegion(region);
        setSearchTerm("");
        setisOpenModal(false);
    }

    return(
        <>
            <Button className='RegionDrop' onClick={() => setisOpenModal(true)}> 
                                    <div className='info d-flex flex-column'>
                                        <span className='label'>T'es D'où ?</span>
                                        <span className='region'>{selectedRegion}</span>
                                    </div>
                                    <span className='Locationicon ml-auto'>
                                        <FaLocationDot />
                                    </span>
            </Button>
            <Dialog open={isOperModal} onClose={() => setisOpenModal(false)} className='locationModal' TransitionComponent={Transition}>
                <h3 className='mb-0'>Choose your Delivery Location</h3>  
                
                <p>Enter your address and we will specify the offer for your area.</p>
                
                <Button className='close_icon' onClick={() => setisOpenModal(false)}>
                    <IoMdClose />
                </Button>
                <div className='headerSearch w-100'>
                    <input type='text' placeholder="Search for your region.."  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button> <FaSearch /> </Button>
                </div>

                <ul className='countryList mt-3'>
                {filteredRegions.length > 0 ? (
                    filteredRegions.map((region) => (
                    <li key={region}>
                        <Button onClick={() => selectRegion(region)}>
                        {region}
                        </Button>
                    </li>
                    ))
                    ) : (
                        <li className="text-muted px-3">No region found</li>
                    )}
          </ul>

            </Dialog>
        </>
    )
}

export default RegionDropdown;