"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Loader2, Upload, X } from "lucide-react";

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
}: ActivityCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "approved" | "rejected" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const needsProofUpload = type === "Metro";

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
      setErrorMessage("Geolocation is not supported in this browser.");
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
          formData.append("lat", pos.coords.latitude.toString());
          formData.append("lng", pos.coords.longitude.toString());
          formData.append("type", type);

          const res = await fetch("/api/activities/verify", {
            method: "POST",
            body: formData,
          });

          const data = (await res.json().catch(() => null)) as
            | { error?: string; message?: string; status?: "approved" | "rejected" }
            | null;

          if (!res.ok) {
            throw new Error(data?.error || "Verification failed.");
          }

          setIsLoading(false);
          setStatus(data?.status === "rejected" ? "rejected" : "approved");
          setSuccessMessage(
            data?.message ||
              (type === 'Metro'
                ? 'Metro ticket verified and credits issued.'
                : 'Activity verified and credits issued.')
          );

          if (data?.status !== "rejected") {
            setTimeout(() => router.push("/dashboard"), 1800);
          }
        } catch (err) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Verification failed.");
          setIsLoading(false);
        }
      },
      () => {
        setStatus("error");
        setErrorMessage("Location access is required for Eco-Verification.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="dashboard-surface grid gap-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_24px_48px_-34px_rgba(15,23,42,0.35)] lg:grid-cols-[minmax(0,1.15fr)_320px]">
      <div className="flex flex-col justify-between gap-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full ${accentColor} px-4 py-2 text-sm font-semibold text-slate-700`}>
              {icon}
              {type}
            </span>
            <span className="dashboard-surface-soft dashboard-text-secondary inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Activity flow
            </span>
          </div>

          <div>
            <h3 className="dashboard-text-primary text-3xl font-semibold tracking-tight text-slate-950">{title}</h3>
            <p className="dashboard-text-secondary mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
          </div>

          <div className="dashboard-surface-alt rounded-xl border border-gray-200 bg-gray-50 p-5">
            {needsProofUpload ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="dashboard-text-primary text-sm font-semibold text-slate-900">Upload metro proof</p>
                    <p className="dashboard-text-secondary mt-1 text-sm text-slate-500">
                      Add a clear ticket image so the verification flow can confirm the trip details.
                    </p>
                  </div>
                  {!selectedFile && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="dashboard-outline-btn inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#D5DBFF] hover:text-[#465FFF]"
                    >
                      <Upload size={16} />
                      Upload
                    </button>
                  )}
                </div>

                {selectedFile ? (
                  <div className="dashboard-surface flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="dashboard-surface-soft relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                        {previewUrl ? (
                          <Image src={previewUrl} alt="Metro ticket preview" fill className="object-cover" />
                        ) : (
                          <div className="dashboard-text-secondary flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                            Preview
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="dashboard-text-primary text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                        <p className="dashboard-text-secondary mt-1 text-xs text-slate-500">Ticket image ready for verification.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-100"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="dashboard-outline-btn flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-5 py-4 text-left transition hover:border-[#B7C5FF]"
                  >
                    <div>
                      <p className="dashboard-text-primary text-sm font-semibold text-slate-900">Choose metro ticket image</p>
                      <p className="dashboard-text-secondary mt-1 text-sm text-slate-500">
                        Phone camera captures work well for on-the-go submission.
                      </p>
                    </div>
                    <ArrowUpRight size={18} className="text-slate-400" />
                  </button>
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
            ) : (
              <div className="space-y-2">
                <p className="dashboard-text-primary text-sm font-semibold text-slate-900">Instant planting validation</p>
                <p className="dashboard-text-secondary text-sm leading-6 text-slate-500">
                  This flow uses your live location and activity type so you can contribute quickly from the dashboard.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || (needsProofUpload && !selectedFile)}
            className="inline-flex w-fit items-center gap-3 rounded-lg bg-[#465FFF] px-6 py-4 text-sm font-semibold text-white shadow-[0_22px_45px_-26px_rgba(15,23,42,0.55)] transition hover:bg-[#3649d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
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
              'Verify and contribute'
            )}
          </button>
          {(status === "approved" || status === "rejected") && successMessage && (
            <p className={`ml-1 text-sm font-medium ${status === "approved" ? "text-emerald-600" : "text-rose-500"}`}>
              {successMessage}
            </p>
          )}
          {status === "error" && (
            <p className="ml-1 text-sm font-medium text-red-500">
              {errorMessage || "Verification failed. Please try again."}
            </p>
          )}
        </div>
      </div>

      <div className="relative min-h-[280px] overflow-hidden rounded-2xl shadow-[0_24px_55px_-34px_rgba(15,23,42,0.6)]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
    </div>
  );
}
