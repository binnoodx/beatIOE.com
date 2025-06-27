'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";

interface FormInput {
  fullName: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormInput>();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // 🟢 Check for duplicate user
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      checker();
    }
  }, [session, status]);

  const checker = async () => {
    if (!session) return;
    const response = await fetch("/api/checker/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user?.email }),
    });
    const res = await response.json();
    if (res.message === "Repeat") {
      router.push("/home/Feed");
    }
  };

  // 🟢 Image file input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string); // base64 preview
    };
    reader.readAsDataURL(selected);
  };

  // 🟢 Image upload handler
  const handleUpload = async () => {
    if (!preview) return null;
    setUploading(true);

    try {
      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: preview }),
      });

      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url);
        return data.url;
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }

    return null;
  };

  // 🟢 Form submission
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const imageUrl = await handleUpload();
    if (!imageUrl) return;

    const response = await fetch("/api/forUsers/fullName/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.fullName,
        email: session?.user?.email,
        profileImage: imageUrl, // include uploaded image
      }),
    });

    const res = await response.json();
    if (res.status) {
      router.push("/home/Feed");
    }

  };




  return (
    <div className="maindiv h-screen flex justify-center bg-white items-center w-screen">
      <div className="bg-slate-300 lg:w-[40vw] border-1 border-white flex flex-col items-center justify-center rounded-xl p-6 space-y-4">

        {/* File Input (hidden) */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview + Upload Label */}
        <label htmlFor="image-upload" className="cursor-pointer relative block w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={preview || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        </label>

        {preview ? "":<p className='text-sm italic mt-2'>Upload Your Image</p>}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  py-5 w-[80vw] justify-center items-center">

          <input
            placeholder='Enter Your Full Name'
            className='bg-gray-600 w-[70vw] lg:w-[35vw] px-10 py-2 text-white m-2 rounded-md'
            {...register("fullName", {
              required: "Full name is required",
              maxLength: 40,
            })}
          />
          {errors?.fullName?.message && <p className="text-black text-sm">{errors.fullName.message}</p>}

          <input
            type="submit"
            disabled={uploading}
            value={uploading ? "Loading..." : "Loading..."}
            className="bg-green-500 rounded-xl w-[60vw] lg:w-[30vw] mt-4 mb-6 cursor-pointer py-2"
          />
        </form>
      </div>
    </div>
  );
}
