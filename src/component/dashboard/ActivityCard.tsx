"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, CheckCircle2, X, Eye } from 'lucide-react';

interface ActivityCardProps {
  type: "Metro" | "Planting";
  title: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  accentColor: string;
  borderColor: string;
  buttonColor: string;
}

export default function ActivityCard({
  type,
  title,
  icon,
  description,
  image,
  accentColor,
  borderColor,
  buttonColor,
}: ActivityCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'approved' | 'rejected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleVerify = async () => {
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');
    setSuccessMessage('');

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported in this browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const formData = new FormData();
          if (selectedFile) {
            formData.append('image', selectedFile);
          }
          formData.append('lat', pos.coords.latitude.toString());
          formData.append('lng', pos.coords.longitude.toString());
          formData.append('type', type);

          const res = await fetch('/api/activities/verify', {
            method: 'POST',
            body: formData,
          });

          const data = (await res.json().catch(() => null)) as
            | { error?: string; message?: string; status?: 'approved' | 'rejected' }
            | null;

          if (!res.ok) {
            throw new Error(data?.error || 'Verification failed.');
          }

          setIsLoading(false);
          setStatus(data?.status === 'rejected' ? 'rejected' : 'approved');
          setSuccessMessage(
            data?.message ||
              (type === 'Metro'
                ? 'Metro ticket verified and credits issued.'
                : 'Activity verified and credits issued.')
          );

          if (data?.status !== 'rejected') {
            setTimeout(() => router.push('/dashboard'), 1800);
          }
        } catch (err) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Verification failed.');
          setIsLoading(false);
        }
      },
      () => {
        setStatus('error');
        setErrorMessage('Location access is required for Eco-Verification.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`group ${accentColor} p-8 rounded-[2.5rem] border ${borderColor} backdrop-blur-xl flex flex-col md:flex-row gap-10 transition-all hover:shadow-2xl hover:shadow-emerald-500/10`}>
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-zinc-950/50 rounded-2xl shadow-sm text-emerald-500 ring-1 ring-white/10">{icon}</div>
            <h3 className="text-2xl font-black text-zinc-100 tracking-tight">{title}</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">{description}</p>

          {type === 'Metro' && (
            <div className="pt-2">
              {!selectedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group/btn flex items-center gap-3 px-5 py-3 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-500 hover:border-emerald-500 hover:text-emerald-500 transition-all bg-zinc-950/20"
                >
                  <Upload size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                  <span className="text-sm font-bold">Upload Metro Ticket</span>
                </button>
              ) : (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg bg-zinc-950">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Metro ticket preview" fill className="object-cover opacity-80" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-500/10 text-xs font-semibold text-emerald-500">
                      Preparing preview...
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || (type === 'Metro' && !selectedFile)}
            className={`w-fit px-10 py-4 ${buttonColor} text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Verifying...
              </>
            ) : status === 'approved' ? (
              <>
                <CheckCircle2 size={20} /> Credits Issued!
              </>
            ) : status === 'rejected' ? (
              <>
                <X size={20} /> Rejected
              </>
            ) : (
              'Verify & Contribute'
            )}
          </button>
          {(status === 'approved' || status === 'rejected') && successMessage && (
            <p className={`text-xs font-bold ml-2 ${status === 'approved' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {successMessage}
            </p>
          )}
          {status === 'error' && (
            <p className="text-xs font-bold text-red-500 ml-2">{errorMessage || 'Verification failed. Please try again.'}</p>
          )}
        </div>
      </div>

      <div className="w-full md:w-80 h-64 md:h-auto rounded-[2rem] overflow-hidden relative shadow-2xl shrink-0 group-hover:rotate-1 transition-transform duration-500">
        <Image src={image} alt={title} fill className="object-cover brightness-90 group-hover:brightness-100 transition-all" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">
          <Eye size={14} /> Activity Preview
        </div>
      </div>
    </div>
  );
}
