
import React from 'react';
import { PostData, Layout, Theme } from '../types';
import { Heart, MessageCircle, Repeat, PlayCircle, Verified } from 'lucide-react';
import { InstagramLogo, FacebookLogo, XLogo } from './IconComponents';

interface PostCardProps {
  postData: PostData;
  layout: Layout;
  theme: Theme;
}

const PostCard: React.FC<PostCardProps> = ({ postData, layout, theme }) => {
  const { network, displayName, username, profilePic, text, mediaUrl, likes, comments, retweets, date, isVideo, isVerified } = postData;

  const isDark = theme === 'dark';
  const cardClasses = `
    w-[320px] md:w-[480px] lg:w-[560px] 
    ${isDark ? 'bg-black text-white' : 'bg-white text-black'} 
    rounded-xl shadow-2xl overflow-hidden transition-all duration-300
    ${layout === 'wide' ? 'flex flex-row' : 'flex flex-col'}
  `;
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const usernameColor = isDark ? 'text-white' : 'text-black';
  const statsColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const linkColor = network === 'facebook' ? 'text-blue-500' : network === 'x' ? 'text-blue-400' : 'text-blue-600';

  const renderNetworkIcon = () => {
    switch (network) {
      case 'instagram': return <InstagramLogo className="w-6 h-6" />;
      case 'facebook': return <FacebookLogo className="w-6 h-6" />;
      case 'x': return <XLogo className={`w-5 h-5 ${isDark ? 'fill-white' : 'fill-black'}`} />;
      default: return null;
    }
  };

  const Header: React.FC = () => (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3">
          <p className={`font-bold ${usernameColor} flex items-center`}>
            {displayName}
            {isVerified && <Verified size={16} className="ml-1 text-blue-500 fill-current" />}
          </p>
          {network !== 'instagram' && <p className={`text-sm ${statsColor}`}>{username}</p>}
        </div>
      </div>
      {renderNetworkIcon()}
    </div>
  );

  const TextContent: React.FC<{className?: string}> = ({className}) => (
    <div className={`p-4 ${className}`}>
      <p className={`whitespace-pre-wrap ${textColor}`} dangerouslySetInnerHTML={{ __html: text.replace(/(#\w+|@\w+)/g, `<span class="${linkColor}">$1</span>`) }} />
    </div>
  );

  const Media: React.FC<{className?: string}> = ({className}) => (
    <div className={`relative ${className}`}>
      <img src={mediaUrl} alt="Post media" className="w-full h-auto object-cover" />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <PlayCircle size={64} className="text-white opacity-80" />
        </div>
      )}
    </div>
  );
  
  const Stats: React.FC<{className?: string}> = ({className}) => (
    <div className={`flex items-center justify-between text-sm p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} ${statsColor} ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center"><Heart size={20} className="mr-1.5" /> {likes}</div>
        <div className="flex items-center"><MessageCircle size={20} className="mr-1.5" /> {comments}</div>
        <div className="flex items-center"><Repeat size={20} className="mr-1.5" /> {retweets}</div>
      </div>
      <span>{date}</span>
    </div>
  );

  if (layout === 'wide') {
    return (
      <div className={cardClasses} style={{ minWidth: '640px' }}>
        <div className="w-1/2">
          <Media className="h-full" />
        </div>
        <div className="w-1/2 flex flex-col">
          <Header />
          <TextContent className="flex-grow"/>
          <Stats />
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <Header />
      <Media />
      {text && <TextContent />}
      <Stats />
    </div>
  );
};

export default PostCard;
