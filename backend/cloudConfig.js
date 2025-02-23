const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_CODE,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Dmc', // Change folder name if needed
    allowedFormats: ['png', 'jpeg', 'jpg', 'pdf'], // Added pdf format
   
  },
});

module.exports = { cloudinary, storage };
