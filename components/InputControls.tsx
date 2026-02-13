import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-[11px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5 ml-1">
        {label}
      </label>
    )}
    <textarea
      className={`w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition-all resize-none ${className}`}
      {...props}
    />
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-[11px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5 ml-1">
        {label}
      </label>
    )}
    <input
      className={`w-full bg-slate-950/50 border-2 border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  options?: { label: string; value: string }[];
  groupedOptions?: { label: string; options: { label: string; value: string }[] }[];
}

export const Select: React.FC<SelectProps> = ({ label, icon, options, groupedOptions, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-[11px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
          {icon}
        </span>
      )}
      <select
        className={`w-full appearance-none bg-slate-800/50 border-2 border-slate-700 text-slate-200 rounded-xl py-3 pr-10 ${icon ? 'pl-10' : 'pl-4'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition-all cursor-pointer hover:bg-slate-800 ${className}`}
        {...props}
      >
        {options && options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {groupedOptions && groupedOptions.map(group => (
          <optgroup key={group.label} label={group.label} className="bg-slate-900 text-slate-400">
             {group.options.map(opt => (
               <option key={opt.value} value={opt.value}>{opt.label}</option>
             ))}
          </optgroup>
        ))}
      </select>
      <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        expand_more
      </span>
    </div>
  </div>
);

export const FileUpload: React.FC<{ 
  onFileSelect: (file: string) => void; 
  currentImage: string | null;
  label?: string;
}> = ({ onFileSelect, currentImage, label }) => {
  const { t } = useLanguage();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-[11px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5 ml-1">
        {label || t('upload.label')}
      </label>
      <div className="relative w-full h-36 border-2 border-dashed border-slate-700 rounded-3xl hover:border-violet-500/50 transition-colors bg-slate-950/50 group overflow-hidden">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {currentImage ? (
          <img src={currentImage} alt="Preview" className="w-full h-full object-contain opacity-80 group-hover:opacity-60 transition-opacity" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <span className="material-icons-round text-4xl mb-2 group-hover:text-violet-400 transition-colors">cloud_upload</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{t('upload.click_drop')}</span>
          </div>
        )}
        
        {currentImage && (
           <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/60 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10">{t('upload.replace')}</span>
           </div>
        )}
      </div>
    </div>
  );
};

export const MultiFileUpload: React.FC<{
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}> = ({ images, onImagesChange, maxImages = 3 }) => {
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = [...images];
      let processedCount = 0;
      
      Array.from(files).forEach((file: File) => {
        if (newImages.length >= maxImages) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processedCount++;
          if (processedCount === Math.min(files.length, maxImages - images.length)) {
             onImagesChange(newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="mb-6">
      <label className="block text-[11px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5 ml-1 flex justify-between">
        <span>{t('upload.ref_label')}</span>
        <span className="text-slate-500 font-mono">{images.length} / {maxImages}</span>
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 group">
            <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-xl"
            >
              <span className="material-icons-round text-xs block">close</span>
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div className="relative aspect-square border-2 border-dashed border-slate-700 rounded-2xl hover:border-violet-500/50 transition-colors bg-slate-950/50 flex flex-col items-center justify-center text-slate-500 hover:text-violet-400 cursor-pointer">
             <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="material-icons-round text-3xl mb-1">add_photo_alternate</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">{t('upload.add')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
