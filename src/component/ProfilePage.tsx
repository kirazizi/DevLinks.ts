import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  first_name: z.string().min(1, "Can't be empty"),
  last_name: z.string().min(1, "Can't be empty"),
  email: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $auth0Id: String!
    $first_name: String!
    $last_name: String!
    $email: String!
    $image: String!
  ) {
    update_users(
      _set: { first_name: $first_name, last_name: $last_name, email: $email, image: $image }
      where: { auth0_id: { _eq: $auth0Id } }
    ) {
      returning {
        id
        first_name
        last_name
        email
        image
      }
    }
  }
`;

const ProfilePage = () => {
  const { profile, setProfile, user } = useAuth();
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
    fetchPolicy: "no-cache",
  });
  const [imageUrl, setImageUrl] = useState(profile.image || "");
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        toast("Images have been uploaded");
        setImageUrl(data.url);
        setProfile((prev) => ({ ...prev, image: data.url }));
      } catch (error) {
        toast("Failed uploading image");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const validationResult = profileSchema.safeParse(profile);

      if (!validationResult.success) {
        const errorMap: Record<string, { message: string }> = {};
        validationResult.error.errors.forEach((err) => {
          errorMap[err.path[0] as string] = { message: err.message };
        });
        console.log(errorMap);
        setErrors(errorMap);
        return;
      }

      setErrors({});
      setIsSaving(true);

      await updateUserProfile({
        variables: {
          auth0Id: user,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          image: profile.image || "",
        },
      });

      setIsSaving(false);
      toast("Your changes have been successfully saved!");
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:w-[60%]">
      <Toaster position="bottom-center" className="" />
      <main className="max-w-screen-2xl mx-auto px-6 py-8 grid ">
        <div className="space-y-6">
          <div>
            <h1 className="md:text-4xl text-2xl font-bold mb-2">Profile Details</h1>
            <p className="text-gray-500">
              Add your details to create a personal touch to your profile.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-gray-50 rounded-lg space-y-4 md:flex items-center">
              <label className="text-sm text-gray-500 w-[30%]">Profile picture</label>
              <div className="md:flex md:items-center gap-8">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profileImage"
                  />
                  <label
                    htmlFor="profileImage"
                    className="w-48 h-48 flex flex-col items-center justify-center gap-3 bg-[#8860E6]/5 hover:bg-[#8860E6]/10 rounded-lg cursor-pointer relative overflow-hidden"
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <ImageIcon className="w-10 h-10 text-white" />
                          <span className="text-white font-medium">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-[#8860E6]" />
                        <span className="text-[#8860E6] font-medium">+ Upload Image</span>
                      </>
                    )}
                  </label>
                </div>
                <div className="flex-1 text-xs text-gray-500 mt-6">
                  <p>Image must be below 1024x1024px.</p>
                  <p>Use PNG or JPG format.</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-lg space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm text-gray-500">
                    First name*
                  </label>
                  <div className="relative">
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleInputChange}
                      placeholder="e.g. John"
                      className={`h-12 pr-24 ${errors.first_name ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                    />
                    {errors.first_name && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm text-gray-500">
                    Last name*
                  </label>
                  <div className="relative">
                    <Input
                      id="last_name"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Appleseed"
                      className={`h-12 pr-24 ${errors.last_name ? "border-[#FF3939] focus-visible:ring-[#FF3939]" : ""}`}
                    />
                    {errors.last_name && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#FF3939]">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-500">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="e.g. email@example.com"
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-end">
          <Button
            className="px-6 bg-[#8860E6] hover:bg-[#7447e7]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;