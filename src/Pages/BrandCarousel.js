import React from 'react';
import './BrandCarousel.css';

const BrandCarousel = () => {
  // Replace these with your actual brand logo URLs
  const brands = [
    { id: 1, name: "Vichy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Vichy_Laboratoires_%28logo%29.jpg/960px-Vichy_Laboratoires_%28logo%29.jpg?_=20190619100527" },
    { id: 2, name: "La Roche-Posay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/La_Roche-Posay_%28brand%29.svg/330px-La_Roche-Posay_%28brand%29.svg.png?_=20200402221344" },
    { id: 3, name: "CeraVe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Av_new-logo-2022_eau-thermale-avene.png/960px-Av_new-logo-2022_eau-thermale-avene.png?_=20241128155532" },
    { id: 4, name: "Bioderma", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bioderma_logo.svg/250px-Bioderma_logo.svg.png?_=20250504211759" },
    { id: 5, name: "Eucerin", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Eucerin-logo.png/960px-Eucerin-logo.png?_=20200109123633" },
    { id: 7, name: "Caudalie", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/LOGO_CAUDALIE_PRUNE.png/960px-LOGO_CAUDALIE_PRUNE.png?_=20200214154004" },
    { id: 8, name: "Nuxe", logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/NUXE-LOGO-EQ3308C.png?_=20201110153200" },
    { id: 9, name: "Mustela", logo: "https://images.seeklogo.com/logo-png/32/1/mustela-logo-png_seeklogo-321456.png" },
    { id: 10, name: "Ducray", logo: "https://images.seeklogo.com/logo-png/19/1/ducray-logo-png_seeklogo-196987.png" },
    { id: 11, name: "A-Derma", logo: "https://images.seeklogo.com/logo-png/21/1/a-derma-logo-png_seeklogo-211467.png" },
    { id: 12, name: "Filorga", logo: "https://images.seeklogo.com/logo-png/28/1/filorga-logo-png_seeklogo-288168.png" },
    { id: 13, name: "Phyto", logo: "https://images.seeklogo.com/logo-png/46/1/phyto-logo-png_seeklogo-460710.png" },
    { id: 14, name: "SVR", logo: "https://images.seeklogo.com/logo-png/46/1/svr-logo-png_seeklogo-460716.png" },
    { id: 15, name: "Uriage", logo: "https://images.seeklogo.com/logo-png/33/1/uriage-logo-png_seeklogo-336109.png" },
    { id: 16, name: "Klorane", logo: "https://images.seeklogo.com/logo-png/7/1/klorane-laboratoires-logo-png_seeklogo-79117.png" },
    { id: 17, name: "Lierac", logo: "https://images.seeklogo.com/logo-png/8/1/lierac-logo-png_seeklogo-83950.png" },
    { id: 18, name: "Galénic", logo: "https://images.seeklogo.com/logo-png/5/1/galenic-paris-logo-png_seeklogo-58912.png" },
    { id: 19, name: "Noreva", logo: "https://images.seeklogo.com/logo-png/52/1/noreva-logo-png_seeklogo-528588.png" },
    { id: 20, name: "Topicrem", logo: "https://images.seeklogo.com/logo-png/35/1/topicrem-logo-png_seeklogo-355408.png" }
  ];

  // We double the array to ensure the infinite loop has no gaps
  const doubledBrands = [...brands, ...brands];

  return (
    <div className="brand-section py-5">
      <div className="container">
        <h4 className="text-center fw-bold mb-5 text-uppercase" style={{ letterSpacing: '10px' }}>
          Nos Marques Partenaires
        </h4>
        <div className="brand-slider">
          <div className="brand-track">
            {doubledBrands.map((brand, index) => (
              <div className="brand-slide" key={index}>
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;