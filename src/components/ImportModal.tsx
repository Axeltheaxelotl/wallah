import { useState } from 'react';
import { Upload, FileJson, X, Check } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
  onImport: (workflow: any) => void;
}

export function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Le fichier doit être au format .json');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        
        // Validation basique
        if (!workflow.nodes || !workflow.edges) {
          setError('Format de workflow invalide');
          return;
        }

        // Import réussi
        setTimeout(() => {
          onImport(workflow);
          onClose();
        }, 500);
      } catch (err) {
        setError('Erreur lors de la lecture du fichier JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              📥 Importer un Workflow
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Glissez-déposez ou sélectionnez un fichier .json
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-3 border-dashed rounded-2xl p-12 text-center transition-all
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
              ${fileName ? 'border-green-500 bg-green-50' : ''}
              ${error ? 'border-red-500 bg-red-50' : ''}
            `}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".json"
              onChange={handleChange}
            />
            
            {!fileName && !error && (
              <>
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                  ${dragActive ? 'bg-blue-500 scale-110' : 'bg-gray-200'}
                  transition-all duration-200
                `}>
                  <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  {dragActive ? '📂 Déposez le fichier ici' : 'Glissez-déposez votre fichier'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou
                </p>
                <label htmlFor="file-upload">
                  <span className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                    Parcourir les fichiers
                  </span>
                </label>
              </>
            )}

            {fileName && !error && (
              <div className="animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileJson className="w-5 h-5 text-green-600" />
                  <p className="text-gray-900 font-medium">{fileName}</p>
                </div>
                <p className="text-sm text-green-600">
                  ✓ Importation réussie !
                </p>
              </div>
            )}

            {error && (
              <div className="animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-8 h-8 text-white" />
                </div>
                <p className="text-red-600 font-medium mb-4">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setFileName(null);
                  }}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 <strong>Astuce :</strong> Vous pouvez partager vos workflows en envoyant le fichier .json à vos collègues !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
