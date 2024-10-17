import axios from "axios";
import {removeImage} from "../../api/ProductAPI";

// Define the image type including the URL and public_id
interface ImageType {
  url: string;
  public_id: string;
}

interface InputImagesProps {
  images: ImageType[];
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
}

const InputImages: React.FC<InputImagesProps> = ({ images, setImages }) => {
  // const [images, setImages1] = useState<ImageType[]>([]); // Store an array of image URLs and public IDs
  

  const uploadImages = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ecommicro"); // Cloudinary upload preset

        axios
          .post("https://api.cloudinary.com/v1_1/dzqihtcs4/image/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Image uploaded successfully:", response.data);

            const { secure_url, public_id } = response.data;
            setImages((prevImages) => [...prevImages, { url: secure_url, public_id: public_id }]); // Store URL and public_id
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      });
    }
  };

  const handleRemoveImage = async (public_id: string) => {
    try {
      await removeImage(public_id); // Use the centralized removeImage function from apiService
      // Update the local state after successful image removal
      setImages((prevImages) => prevImages.filter((img) => img.public_id !== public_id));
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };



  return (
    <div className="my-10">
      <input
        type="file"
        multiple // Allow selecting multiple files
        onChange={(e) => uploadImages(e.target.files)}
      />
      <div className="image-preview">
        {images.length > 0 &&
          images.map((image, index) => (
            <div key={index} style={{ display: "inline-block", margin: "10px", position: "relative" }}>
              <img
                src={image.url}
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

export default InputImages;
