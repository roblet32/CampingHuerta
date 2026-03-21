"use client";

import { useState, useRef, useCallback } from "react";
import { SpaceType } from "@prisma/client";

type SpaceFormData = {
    id?: string;
    name: string;
    description: string | null;
    price: number;
    capacity: number;
    type: SpaceType;
    images: string[];
    isAvailable: boolean;
};

type SpaceFormProps = {
    initialData?: SpaceFormData;
    action: (payload: FormData) => void;
};

function UploadIcon() {
    return (
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function SpinnerIcon() {
    return (
        <svg className="animate-spin w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

export default function SpaceForm({ initialData, action }: SpaceFormProps) {
    const isEditing = !!initialData;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>(initialData?.images ?? []);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        setUploadError(null);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) {
                setUploadError(data.error ?? "Error al subir imagen.");
                return;
            }
            setImages(prev => [...prev, data.url]);
        } catch {
            setUploadError("Error de red al subir la imagen.");
        } finally {
            setUploading(false);
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        for (const file of files) {
            await uploadFile(file);
        }
        // Reset so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
        for (const file of files) {
            await uploadFile(file);
        }
    }, [uploadFile]);

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form action={action} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl space-y-6">

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Espacio *</label>
                <input
                    type="text" id="name" name="name" required
                    defaultValue={initialData?.name}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-700"
                    placeholder="Ej: Zona Familiar #2"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type */}
                <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Espacio *</label>
                    <select
                        id="type" name="type" required
                        defaultValue={initialData?.type || "OPEN_FIELD"}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-700 bg-white"
                    >
                        <option value="PARKING">Estacionamiento</option>
                        <option value="OPEN_FIELD">Campo Abierto</option>
                        <option value="PALAPA">Palapa</option>
                        <option value="RIVERSIDE">Cerca del Río</option>
                        <option value="HOUSE">Casa / Cabaña</option>
                    </select>
                </div>

                {/* Capacity */}
                <div>
                    <label htmlFor="capacity" className="block text-sm font-semibold text-slate-700 mb-1.5">Capacidad (Personas) *</label>
                    <input
                        type="number" id="capacity" name="capacity" min="1" required
                        defaultValue={initialData?.capacity || 1}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-700"
                    />
                </div>
            </div>

            {/* Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">Precio por Noche ($) *</label>
                <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium">$</span>
                    <input
                        type="number" id="price" name="price" step="0.01" min="0" required
                        defaultValue={initialData?.price}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-700"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
                <textarea
                    id="description" name="description" rows={4}
                    defaultValue={initialData?.description || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-700 resize-y"
                    placeholder="Describe este espacio y sus beneficios..."
                />
            </div>

            {/* Image Uploader */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fotos del Espacio
                </label>

                {/* Hidden input that carries the final image URLs */}
                <input type="hidden" name="images" value={images.join(",")} />

                {/* Current images preview */}
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                        {images.map((src, i) => (
                            <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${src}')` }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                    title="Eliminar imagen"
                                >
                                    <XIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Drop Zone */}
                <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        isDragging
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50 bg-white"
                    }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <SpinnerIcon />
                            <p className="text-sm text-slate-500">Subiendo imagen...</p>
                        </div>
                    ) : (
                        <>
                            <UploadIcon />
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-700">Arrastra imágenes aquí o haz clic para seleccionar</p>
                                <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP · Máximo 5 MB por imagen</p>
                            </div>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </div>

                {uploadError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {uploadError}
                    </p>
                )}
            </div>

            {/* Is Available */}
            <div className="flex items-center gap-3 pt-2">
                <input
                    type="checkbox" id="isAvailable" name="isAvailable"
                    defaultChecked={initialData ? initialData.isAvailable : true}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-colors"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Espacio Disponible / Activo
                </label>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={uploading}
                    className="px-8 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? "Guardar Cambios" : "Crear Espacio"}
                </button>
            </div>
        </form>
    );
}
