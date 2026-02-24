import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantityBox = ({ quantity, setQuantity }) => {
    
    // Fallback internal state if props aren't passed, 
    // but usually, we will use the props from ProductModal
    const [inputVal, setInputVal] = useState(quantity || 1);

    useEffect(() => {
        if (setQuantity) {
            setQuantity(inputVal);
        }
    }, [inputVal, setQuantity]);

    const minus = () => {
        if (inputVal > 1) {
            setInputVal(inputVal - 1);
        }
    }

    const plus = () => {
        setInputVal(inputVal + 1);
    }

    return (
        <div className='quantityDrop d-flex align-items-center'>
            <Button onClick={minus}><FaMinus /></Button>
            <input type='text' value={inputVal} readOnly />
            <Button onClick={plus}><FaPlus /></Button>
        </div>
    )
}

export default QuantityBox;