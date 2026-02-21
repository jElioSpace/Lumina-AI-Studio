
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="w-full group">
    {label && (
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-500 dark:group-focus-within:text-violet-400 transition-colors">
        {label}
      </label>
    )}
    <div className="relative">
      <textarea
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-violet-500/5 outline-none transition-all resize-none shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700 ${className}`}
        {...props}
      />
      <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
        <span className="material-icons-round text-slate-300 dark:text-slate-700 text-sm">edit</span>
      </div>
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="w-full group">
    {label && (
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-500 dark:group-focus-within:text-violet-400 transition-colors">
        {label}
      </label>
    )}
    <input
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-indigo-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-violet-500/5 outline-none transition-all shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700 ${className}`}
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
  <div className="w-full">
    {label && (
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg pointer-events-none">
          {icon}
        </span>
      )}
      <select
        className={`w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl py-3 pr-10 ${icon ? 'pl-10' : 'pl-4'} focus:border-indigo-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-violet-500/5 outline-none transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
        {...props}
      >
        {options && options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">{opt.label}</option>
        ))}
        {groupedOptions && groupedOptions.map(group => (
          <optgroup key={group.label} label={group.label} className="bg-slate-100 dark:bg-slate-950 text-slate-400">
             {group.options.map(opt => (
               <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">{opt.label}</option>
             ))}
          </optgroup>
        ))}
      </select>
      <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xl">
        expand_more
      </span>
    </div>
  </div>
);

export const FileUpload: React.FC<{ 
  onFileSelect: (file: string) => void; 
  onFileRemove?: () => void;
  currentImage: string | null;
  label?: string;
}> = ({ onFileSelect, onFileRemove, currentImage, label }) => {
  const { t } = useLanguage();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onFileSelect(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 ml-1">
        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          {label || t('upload.label')}
        </label>
        {currentImage && onFileRemove && (
          <button onClick={onFileRemove} className="text-[9px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest hover:text-red-600 dark:hover:text-red-300 flex items-center gap-1 transition-colors">
            <span className="material-icons-round text-xs">delete</span>
            {t('upload.remove')}
          </button>
        )}
      </div>
      <div className="relative w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-violet-500/50 transition-all bg-slate-50 dark:bg-slate-900 group overflow-hidden">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        {currentImage ? (
          <img src={currentImage} alt="Preview" className="w-full h-full object-contain p-2" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <span className="material-icons-round text-3xl mb-1 group-hover:text-indigo-500 dark:group-hover:text-violet-500 transition-colors">upload_file</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{t('upload.click_drop')}</span>
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
    <div className="w-full">
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1 flex justify-between">
        <span>{t('upload.ref_label')}</span>
        <span className="text-slate-300 dark:text-slate-700 font-mono">{images.length}/{maxImages}</span>
      </label>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group">
            <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
            <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white/90 dark:bg-black/80 hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg">
              <span className="material-icons-round text-xs block">close</span>
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="relative aspect-square border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 dark:hover:border-violet-500/50 transition-all bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-violet-500 cursor-pointer">
             <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             <span className="material-icons-round text-2xl">add_photo_alternate</span>
          </div>
        )}
      </div>
    </div>
  );
};
