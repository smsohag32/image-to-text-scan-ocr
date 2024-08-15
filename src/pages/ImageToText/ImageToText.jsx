import { useState } from 'react';

export default function ImageToText() {
   const [selectedImage, setSelectedImage] = useState(null);
   const [resultText, setResultText] = useState('');
   const [imageFile, setImageFile] = useState(null)
   const [loading, setLoading] = useState(false);

   const handleImageUpload = (event) => {
      setImageFile(null)
      const file = event.target.files[0];

      if (file) {
         setImageFile(file)
         const reader = new FileReader();
         reader.onloadend = () => {
            setSelectedImage(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleDragOver = (event) => {
      event.preventDefault();
      event.stopPropagation();
   };

   const handleDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files[0];
      if (file) {
         setImageFile(file)
         const reader = new FileReader();
         reader.onloadend = () => {
            setSelectedImage(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async () => {
      if (!selectedImage) return;

      setLoading(true);
      try {
         const formData = new FormData();
         console.log(selectedImage)
         formData.append('image', imageFile);

         const response = await fetch('http://localhost:3100/api/scan', {
            method: 'POST',
            body: formData,
         });

         const result = await response.json();
         setResultText(result.text);

         console.log(result)
      } catch (error) {
         console.error('Error fetching data:', error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-blue-50 grid grid-cols-1 lg:grid-cols-2 items-start">
         {/* Image Upload and Preview */}
         <div className="w-full p-5 flex flex-col items-center">
            <div
               className="w-full h-64 border-dashed border-2 border-blue-300 flex flex-col items-center justify-center bg-white rounded-lg"
               onDragOver={handleDragOver}
               onDrop={handleDrop}
            >
               <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
               />
               <p className="text-blue-500">Drag & drop an image here or click to upload</p>
               <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => document.querySelector('input[type="file"]').click()}
               >
                  Upload Image
               </button>
            </div>
            {selectedImage && (
               <div className="mt-4 w-full flex justify-center">
                  <img
                     src={selectedImage}
                     alt="Preview"
                     className="max-w-full h-auto rounded-lg border border-blue-200 shadow-lg"
                  />
               </div>
            )}
         </div>

         {/* Result Display */}
         <div className="w-full p-5 flex flex-col items-center">
            <button
               className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
               onClick={handleSubmit}
               disabled={loading}
            >
               {loading ? 'Processing...' : 'Get Text'}
            </button>
            <div
               className={`w-full p-5 bg-white rounded-lg border border-blue-200 shadow-lg ${loading ? 'animate-pulse' : ''}`}
            >
               <h2 className="text-lg font-semibold mb-2">Result:</h2>
               <p className="text-gray-700">{resultText || 'No text detected.'}</p>
            </div>
         </div>
      </div>
   );
}
