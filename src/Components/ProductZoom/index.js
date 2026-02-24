import { useRef } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import 'react-inner-image-zoom/lib/styles.min.css';
import Slider from 'react-slick';
import './index.css';

const ProductZoom = (props) => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    // Use the image passed from the Modal, or a placeholder if empty
    const productImg = props.image;

    const goto = (index) => {
        zoomSlider.current.slickGoTo(index);
        zoomSliderBig.current.slickGoTo(index);
    }

    const settings1 = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        arrows: true,
    };

    const settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
    };

    return (
        <div className="productZoomContainer">
            <div className='productZoom'>
                <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>
                    {/* Map through images if you have a gallery, otherwise use the single productImg */}
                    <div className='item'>
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1.5}
                            src={productImg}
                        />
                    </div>
                    {/* Additional slides can be added here if product.gallery exists */}
                </Slider>
            </div>

            {/* Thumbnail Slider - Useful if you add more images later */}
            <Slider {...settings1} className='zoomSlider mt-3' ref={zoomSlider}>
                <div className='item'>
                    <img 
                        src={productImg} 
                        className='w-100' 
                        onClick={() => goto(0)} 
                        alt="thumbnail"
                        style={{ cursor: 'pointer', borderRadius: '8px', border: '1px solid #eee' }}
                    />
                </div>
            </Slider>
        </div>
    )
}

export default ProductZoom;