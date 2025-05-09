"use client";
import React, { useState } from "react";
import { uploadFiles } from "@/utils/uploadthing"; // Manual upload helper

const ProfilePictureUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const res = await uploadFiles("imageUploader", { files: [selectedFile] });
      console.log("Upload result:", res[0]);
      console.log("res key: " + res[0].key);
      
      alert("Upload completed! File key: " + res[0].key);
      // uložit klíč do databáze
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div>
          <p className="text-sm text-gray-500">Image preview:</p>
          <img src={previewUrl} alt="Preview" className="w-40 h-40 object-cover rounded-lg border" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ProfilePictureUploader;
