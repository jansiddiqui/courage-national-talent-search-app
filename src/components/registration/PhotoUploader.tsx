"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';
import { Upload, X, Check, Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploaderProps {
  photoBase64?: string;
  onPhotoSelected: (base64: string) => void;
  error?: string;
}

export default function PhotoUploader({ photoBase64, onPhotoSelected, error }: PhotoUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [fileError, setFileError] = useState("");

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileError("");
      
      if (file.size > 2 * 1024 * 1024) {
        setFileError("File size exceeds 2 MB limit.");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setFileError("Only JPG, JPEG, and PNG formats are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const img = new window.Image();
        img.onload = () => {
          if (img.width < 300 || img.height < 400) {
            setFileError(`Image is too small (${img.width}x${img.height}). Minimum required is 300x400 px.`);
            return;
          }
          setImageSrc(reader.result?.toString() || null);
          setIsCropping(true);
        };
        img.src = reader.result?.toString() || '';
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
        onPhotoSelected(croppedImageBase64);
        setIsCropping(false);
      } catch (e) {
        console.error(e);
        setFileError("Failed to crop image.");
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Candidate Passport Photo <span className="text-red-500">*</span>
      </label>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex gap-4 text-xs text-slate-600 leading-relaxed">
        <div className="shrink-0 w-12 h-16 bg-white border border-blue-200 rounded-md flex flex-col items-center justify-center text-blue-300">
          <UserPlaceholder />
        </div>
        <div>
          <strong className="text-blue-900 block mb-1">Photo Requirements:</strong>
          <ul className="list-disc pl-4 space-y-1">
            <li>Face must be clearly visible (no masks/sunglasses).</li>
            <li>Plain light background preferred.</li>
            <li>Minimum size: 300x400 px (Recommended: 600x800 px).</li>
            <li>Max file size: 2 MB. Format: JPG, JPEG, or PNG.</li>
          </ul>
        </div>
      </div>

      {(fileError || error) && (
        <p className="text-xs text-red-500 font-medium mb-3">{fileError || error}</p>
      )}

      {/* Upload Box / Preview */}
      {!photoBase64 ? (
        <div className="relative group border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-6 text-center transition-all cursor-pointer">
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm transition-all">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Click to upload photo</p>
              <p className="text-xs text-slate-500 mt-1">or drag and drop here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl bg-white">
          <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <Image src={photoBase64} alt="Candidate Photo" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <Check size={16} />
              <span className="text-sm font-bold">Photo Uploaded</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Your passport photo looks good.</p>
            
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button type="button" className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center gap-1.5">
                <Upload size={14} /> Change Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh] max-h-[600px]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Crop Passport Photo</h3>
              <button onClick={() => setIsCropping(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="relative flex-1 bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCropping(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserPlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
