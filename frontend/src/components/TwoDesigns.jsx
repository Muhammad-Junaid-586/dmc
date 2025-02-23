import React from "react";
import { useNavigate } from "react-router-dom";

const TwoDesigns = () => {
  const navigate = useNavigate();

  // Sample images for two DMC designs
  const twoDmcImages = [
    {
      id: 1,
      src: "https://i.pinimg.com/474x/32/ee/68/32ee68b6efd50485d0c77e117e52fe5b.jpg",
      navigate: "NewDmcLayout",
    },
    {
      id: 2,
      src: "/myschool.jpg",
      navigate: "comingSoon",
    },
  ];

  // Handle Design Selection
  const handleDesignSelection = (design) => {
    localStorage.setItem("selectedDesign", design);
    navigate("/upload");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Choose Your Two DMC Design
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Click on a design to proceed to upload.
        </p>
      </div>

      {/* Two DMCs Section */}
      <div className="flex items-center justify-center flex-col">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Two DMCs on One Page
        </h2>
        <div className="flex justify-center align-middle gap-10">
          {twoDmcImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleDesignSelection(image.navigate)}
              className="w-[350px] group relative cursor-pointer bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              {/* Image */}
              <img
                src={image.src}
                alt={`Two DMCs Layout ${image.id}`}
                className="w-full h-72 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoDesigns;
