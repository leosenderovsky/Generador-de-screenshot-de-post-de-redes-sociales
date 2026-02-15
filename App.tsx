
import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { PostData, SocialNetwork, Layout, Theme, ExportFormat } from './types';
import ControlPanel from './components/ControlPanel';
import PreviewCanvas from './components/PreviewCanvas';

const App: React.FC = () => {
  const [postData, setPostData] = useState<PostData>({
    network: 'instagram',
    displayName: 'Usuario Demo',
    username: '@usuario_demo',
    profilePic: 'https://picsum.photos/id/237/50/50',
    text: 'Crea imágenes increíbles de tus posts en redes sociales con SocialSnap Generator. ¡Personaliza y exporta en segundos!',
    mediaUrl: 'https://picsum.photos/id/1062/600/400',
    likes: '1,234',
    comments: '56',
    retweets: '789',
    date: '1h',
    isVideo: false,
    isVerified: true,
  });

  const [layout, setLayout] = useState<Layout>('vertical');
  const [theme, setTheme] = useState<Theme>('light');
  const [background, setBackground] = useState<string>('bg-gray-200 dark:bg-gray-800');
  const [scale, setScale] = useState<number>(2);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [customScale, setCustomScale] = useState<string>("2");

  const previewRef = useRef<HTMLDivElement>(null);
  
  const generateMockDataForNetwork = (network: SocialNetwork) => {
    if (network === 'none') {
        setPostData(prev => ({
            ...prev,
            network: 'none',
        }));
        return;
    };
     setPostData({
        ...postData,
        network: network,
        displayName: `${network.charAt(0).toUpperCase() + network.slice(1)} User`,
        username: `@${network}_user`,
        profilePic: `https://i.pravatar.cc/50?u=${network}_user`,
        text: `Este es un post de ejemplo para ${network}. ¡Puedes editar todo el contenido!`,
        mediaUrl: `https://picsum.photos/seed/${network}post/600/400`,
        likes: Math.floor(Math.random() * 5000 + 100).toLocaleString(),
        comments: Math.floor(Math.random() * 500 + 10).toLocaleString(),
        retweets: Math.floor(Math.random() * 1000 + 50).toLocaleString(),
        date: `${Math.floor(Math.random() * 23 + 1)}h`,
        isVideo: Math.random() > 0.8,
        isVerified: Math.random() > 0.5,
      });
  }

  const handleNetworkChange = (network: SocialNetwork) => {
    generateMockDataForNetwork(network);
  };

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `social-snap-${Date.now()}.${exportFormat}`;
      link.href = canvas.toDataURL(`image/${exportFormat}`, 1.0);
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Hubo un error al exportar la imagen. Asegúrate de que las imágenes no estén bloqueadas por CORS.');
    }
  }, [scale, exportFormat]);

  const handleScaleChange = (newScale: string) => {
    if (newScale === 'custom') {
      const val = parseFloat(customScale);
      setScale(isNaN(val) || val <= 0 ? 1 : val);
    } else {
      setScale(parseFloat(newScale));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-gray-800 dark:text-gray-200">
      <ControlPanel
        postData={postData}
        setPostData={setPostData}
        layout={layout}
        setLayout={setLayout}
        theme={theme}
        setTheme={setTheme}
        background={background}
        setBackground={setBackground}
        scale={scale}
        setScale={handleScaleChange}
        customScale={customScale}
        setCustomScale={setCustomScale}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        onNetworkChange={handleNetworkChange}
        onExport={handleExport}
      />
      <PreviewCanvas
        ref={previewRef}
        background={background}
        postData={postData}
        layout={layout}
        theme={theme}
      />
    </div>
  );
};

export default App;
