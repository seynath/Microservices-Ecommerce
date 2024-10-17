import { useEffect, useRef } from 'react';
import { removeImage } from '@/api/ProductAPI';

interface Props {
  setImages: React.Dispatch<React.SetStateAction<Array<string>>>;
  images: Array<string>;
}

const UpdateUploadWidget: React.FC<Props> = ({ setImages, images }) => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    console.log(images);
  }, [images]);


  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'dzqihtcs4',
      uploadPreset: 'ecommicro',
      multiple: true, // Enable multiple image uploads
    }, function(error, result) {
      if (error) {
        console.error('Upload error:', error);
      } else if (result.event === 'success' && result.info) {
        // Check if the `files` property exists
        if (Array.isArray(result.info.files)) {
          // Multiple files case
          const uploadedImages = result.info.files.map((file: any) => ({
            url: file.uploadInfo.secure_url,
            // public_id: file.uploadInfo.public_id,
            // width: file.uploadInfo.width,
            // height: file.uploadInfo.height,
          }));
  
          setImages((prevImages) => [...prevImages, ...uploadedImages]);
        } else {
          // Single file case, or when `files` is not present
          const uploadedImage = {
            url: result.info.secure_url,
            // public_id: result.info.public_id,
            // width: result.info.width,
            // height: result.info.height,
          };
  
          setImages((prevImages) => [...prevImages, uploadedImage]);
        }
      }
    });
  }, [setImages]);

  const handleRemoveImage = async (url: string) => {
    try {
      // await removeImage(public_id);
      setImages((prevImages) => prevImages.filter((img) => img.url !== url));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };
  


  return (
  <div>
 <div>
    <button onClick={() => widgetRef.current.open()}>
      Upload123
    </button>
  </div>
  
  <div className="image-preview">
  {images.length > 0 &&
    images.map((image, index) => (
      <div key={index} style={{ display: "inline-block", margin: "10px", position: "relative" }}>
        <img
          src={image}
          alt={`Uploaded preview ${index}`}
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRemoveImage(image.public_id)}
        >
          Remove
        </button>
      </div>
    ))}
</div>

  </div>
  );
};

export default UpdateUploadWidget;
