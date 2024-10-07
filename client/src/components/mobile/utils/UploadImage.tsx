import axios from "axios";

const uploadImage = async (
  event: React.ChangeEvent<HTMLInputElement>,
  toast: any,
  callback: (imageName: string, imageUrl: string) => void
) => {
  const upload_preset = "f7jnwshb";
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dat1uvwz1/image/upload`;
  let imageUrl = "";
  let imageName = "";
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    toast({
      title: `Uploading image`,
      description: "Please wait while the image is being uploaded...",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

    imageName = file.name;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset as string);
    formData.append("cloud_name", "dat1uvwz1");

    const response = await axios.post(CLOUDINARY_URL, formData);

    if (response) {
      imageUrl = response.data.secure_url;

      toast({
        title: `Image uploaded successfully!`,
        description: "Your image has been uploaded to Ojami.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      callback(imageName, imageUrl);
    } else {
      throw new Error(`Error uploading ${file.name}`);
    }
  } catch (error) {
    console.log("Error:", error);

    toast.closeAll();

    toast({
      title: `Error uploading image`,
      description: "An error occurred while uploading the image.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }
};

export default uploadImage;
