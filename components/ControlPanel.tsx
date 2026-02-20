
import React from 'react';
import { PostData, Layout, Theme, ExportFormat, SocialNetwork } from '../types';
import { PREDEFINED_GRADIENTS } from '../constants';
import { Settings, Link, Image as ImageIcon, Video, Type, Rows, Columns, Sun, Moon, Palette, Download, FileImage, FileJson, Verified, BarChart2 } from 'lucide-react';
import { InstagramLogo, FacebookLogo, XLogo } from './IconComponents';


interface ControlPanelProps {
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
  layout: Layout;
  setLayout: (layout: Layout) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: string;
  setBackground: (background: string) => void;
  scale: number;
  setScale: (scale: string) => void;
  customScale: string;
  setCustomScale: React.Dispatch<React.SetStateAction<string>>;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  onNetworkChange: (network: SocialNetwork) => void;
  onExport: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-6 bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
  postData,
  setPostData,
  layout,
  setLayout,
  theme,
  setTheme,
  setBackground,
  scale,
  setScale,
  customScale,
  setCustomScale,
  exportFormat,
  setExportFormat,
  onNetworkChange,
  onExport,
}) => {
    
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPostData(prev => ({ ...prev, mediaUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPostData(prev => ({ ...prev, profilePic: event.target.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const socialOptions: { id: SocialNetwork; label: string; icon: React.ReactNode }[] = [
    { id: 'instagram', label: 'Instagram', icon: <InstagramLogo className="w-5 h-5" /> },
    { id: 'facebook', label: 'Facebook', icon: <FacebookLogo className="w-5 h-5" /> },
    { id: 'x', label: 'X', icon: <XLogo className={`w-4 h-4 ${theme === 'dark' ? 'fill-white' : 'fill-black'}`} /> },
  ];

  return (
    <aside className="w-full lg:w-1/3 xl:w-1/4 p-4 lg:p-6 bg-gray-50 dark:bg-gray-900/50 lg:h-screen lg:overflow-y-auto">
      <div className="flex items-center mb-6">
        <Settings className="text-blue-500" size={28} />
        <h2 className="text-2xl font-bold ml-2">Generador de screenshot de post de redes sociales</h2>
      </div>

      <Section title="Red social de origen" icon={<Link size={20} />}>
        <div className="space-y-2">
          {socialOptions.map(option => (
            <label key={option.id} className={`w-full p-3 border dark:border-gray-700 rounded-md flex items-center cursor-pointer transition-all ${postData.network === option.id ? 'bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
              <input
                type="radio"
                name="social-network"
                value={option.id}
                checked={postData.network === option.id}
                onChange={() => onNetworkChange(option.id)}
                className="sr-only"
              />
              <div className="mr-3">{option.icon}</div>
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Contenido del Post" icon={<Type size={20} />}>
        <label className="block text-sm font-medium mb-1">Nombre a mostrar</label>
        <input
          type="text"
          value={postData.displayName}
          onChange={(e) => setPostData(prev => ({ ...prev, displayName: e.target.value }))}
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
        <label className="block text-sm font-medium mb-1">Nombre de usuario (@)</label>
        <input
          type="text"
          value={postData.username}
          onChange={(e) => setPostData(prev => ({ ...prev, username: e.target.value }))}
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
        <label className="block text-sm font-medium mb-1">Texto del post</label>
                <textarea
          value={postData.text}
          onChange={(e) => setPostData(prev => ({ ...prev, text: e.target.value }))}
          rows={4}
          className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
        
        <div className="flex space-x-2">
            <label className="w-1/2 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors text-sm">
                <ImageIcon size={16} className="mr-2"/> Post Media
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <label className="w-1/2 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600 transition-colors text-sm">
                <ImageIcon size={16} className="mr-2"/> Foto Perfil
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
            </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is-video"
              checked={postData.isVideo}
              onChange={(e) => setPostData(prev => ({ ...prev, isVideo: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is-video" className="ml-2 block text-sm">Es un video</label>
            <Video size={16} className="ml-2 text-gray-400" />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is-verified"
              checked={postData.isVerified}
              onChange={(e) => setPostData(prev => ({ ...prev, isVerified: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is-verified" className="ml-2 block text-sm">Verificado</label>
            <Verified size={16} className="ml-2 text-blue-500" />
          </div>
        </div>
      </Section>
      
      <Section title="Estadísticas del Post" icon={<BarChart2 size={20} />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Likes</label>
            <input
              type="text"
              value={postData.likes}
              onChange={(e) => setPostData(prev => ({ ...prev, likes: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comentarios</label>
            <input
              type="text"
              value={postData.comments}
              onChange={(e) => setPostData(prev => ({ ...prev, comments: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {postData.network === 'x' ? 'Retweets' : 'Compartidos'}
            </label>
            <input
              type="text"
              value={postData.retweets}
              onChange={(e) => setPostData(prev => ({ ...prev, retweets: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="text"
              value={postData.date}
              onChange={(e) => setPostData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </Section>

      <Section title="Opciones de Diseño" icon={<Palette size={20}/>}>
        <div className="mb-4">
            <h4 className="font-medium mb-2">Layout</h4>
            <div className="flex space-x-2">
                <button onClick={() => setLayout('vertical')} className={`w-1/2 p-2 rounded-md flex items-center justify-center transition-colors ${layout === 'vertical' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Rows size={16} className="mr-2"/> Vertical</button>
                <button onClick={() => setLayout('wide')} className={`w-1/2 p-2 rounded-md flex items-center justify-center transition-colors ${layout === 'wide' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><Columns size={16} className="mr-2"/> Wide</button>
            </div>
        </div>
        <div className="mb-4">
             <h4 className="font-medium mb-2">Tema del Post</h4>
             <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-full p-2 rounded-md flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                {theme === 'light' ? <Sun size={16} className="mr-2"/> : <Moon size={16} className="mr-2"/>}
                {theme === 'light' ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
        </div>
        <div>
            <h4 className="font-medium mb-2">Fondo del Canvas</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {PREDEFINED_GRADIENTS.map(g => (
                    <button key={g.name} onClick={() => setBackground(g.class)} className={`h-10 w-full rounded-md ${g.class}`}></button>
                ))}
            </div>
            <input type="color" onChange={(e) => setBackground(`bg-[${e.target.value}]`)} className="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-md" />
        </div>
      </Section>

      <Section title="Exportación" icon={<Download size={20}/>}>
          <div className="mb-4">
              <h4 className="font-medium mb-2">Resolución</h4>
              <div className="flex space-x-2">
                  <button onClick={() => setScale('1')} className={`w-1/3 p-2 rounded-md ${scale === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>1x</button>
                  <button onClick={() => setScale('2')} className={`w-1/3 p-2 rounded-md ${scale === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>2x</button>
                  <input
                    type="number"
                    value={customScale}
                    onChange={(e) => {
                      setCustomScale(e.target.value);
                      const val = parseFloat(e.target.value);
                      setScale(isNaN(val) || val <= 0 ? "1" : e.target.value);
                    }}
                    placeholder="Custom"
                    className="w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-center"
                  />
              </div>
          </div>
          <div className="mb-4">
              <h4 className="font-medium mb-2">Formato</h4>
              <div className="flex space-x-2">
                  <button onClick={() => setExportFormat('png')} className={`w-1/2 p-2 rounded-md flex items-center justify-center ${exportFormat === 'png' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><FileImage size={16} className="mr-2"/> PNG</button>
                  <button onClick={() => setExportFormat('jpeg')} className={`w-1/2 p-2 rounded-md flex items-center justify-center ${exportFormat === 'jpeg' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><FileJson size={16} className="mr-2"/> JPG</button>
              </div>
          </div>
          <button onClick={onExport} className="w-full p-3 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 transition-colors flex items-center justify-center">
            <Download size={20} className="mr-2"/>
            Descargar Imagen
          </button>
      </Section>
      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        &copy; Leo Aquiba Senderovsky
      </div>
    </aside>
  );
};

export default ControlPanel;
