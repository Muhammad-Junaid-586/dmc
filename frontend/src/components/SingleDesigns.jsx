import React from "react";
import { useNavigate } from "react-router-dom";

const SingleDesigns = () => {
  const navigate = useNavigate();

  // Sample images for single DMC and two DMC designs
  const singleDmcImages = [
    {
      id: 1,
      src: "https://i.pinimg.com/736x/3a/e7/c6/3ae7c69e90dde62803bb48c23b8ab1f2.jpg",
      navigate: "NewDmc",
    },
    {
      id: 2,
      src: "/myschool.jpg",
      navigate: "kb",
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
          Choose Your Design
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Click on a design to proceed to upload.
        </p>
      </div>

      {/* Single DMC Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Single DMC on One Page
        </h2>
        <div className="flex justify-center gap-10">
          {singleDmcImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleDesignSelection(image.navigate)}
              className="w-[350px] group relative cursor-pointer bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              {/* Image */}
              <img
                src={image.src}
                alt={`Single DMC Design ${image.id}`}
                className="w-full h-72  hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleDesigns;
