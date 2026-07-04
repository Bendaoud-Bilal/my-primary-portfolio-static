import { useState, useEffect } from 'react';

const GistCard = ({ id }) => {
  const [gist, setGist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const response = await fetch(`https://api.github.com/gists/${id}`);
        const data = await response.json();
        setGist(data);
        
        if (data.comments > 0) {
          const commResponse = await fetch(data.comments_url);
          const commData = await commResponse.json();
          if (commData.length > 0) {
            setComment(commData[0].body);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gist:', error);
        setLoading(false);
      }
    };
    fetchGist();
  }, [id]);

  if (loading || !gist) return null;

  const getMonthsAgo = (date) => {
    let now = new Date();
    let gistDate = new Date(date);
    let diff = now.getTime() - gistDate.getTime();
    let days = Math.floor(diff / (1000 * 3600 * 24));
    let months = Math.floor(days / 30);
    return months;
  };

  const getSnippet = (gistData) => {
    const file = Object.values(gistData.files)[0];
    return file.content;
  };

  return (
    <div className="flex flex-col mb-10 w-full animate-fade-in">
      {/* Header Info */}
      <div className="flex justify-between mb-3 px-1 lg:px-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img src={gist.owner.avatar_url} alt="" className="w-8 h-8 rounded-full border border-border" />
          
          {/* User & Date */}
          <div className="flex flex-col">
            <a 
              href={`https://github.com/${gist.owner.login}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-codeline-tag font-[Fira_Code_Bold] text-xs hover:underline"
            >
              @{gist.owner.login}
            </a>
            <p className="text-menu-text font-[Fira_Code_Retina] text-[10px]">
              Created {getMonthsAgo(gist.created_at)} months ago
            </p>
          </div>
        </div>

        {/* Details & Stars */}
        <div className="flex items-center gap-4 text-menu-text font-[Fira_Code_Retina] text-xs">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-white"
            onClick={() => setShowComments(!showComments)}
          >
            <img src="/icons/gist/comments.svg" alt="" className="w-4 h-4" />
            <span>details</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:text-white">
            <img src="/icons/gist/star.svg" alt="" className="w-4 h-4" />
            <span>stars</span>
          </div>
        </div>
      </div>

      {/* Code Snippet Container */}
      <div className="bg-[#011221] border border-border rounded-[15px] p-5 overflow-hidden max-h-[220px] transition-all hover:border-[#607B96]/30">
        <pre className="font-[Fira_Code_Retina] text-xs leading-5 text-menu-text overflow-auto max-h-[180px] custom-scrollbar">
          <code>{getSnippet(gist)}</code>
        </pre>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-top flex justify-between items-start animate-slide-down">
          <p className="text-menu-text font-[Fira_Code_Retina] text-sm w-[90%] break-words">
            {comment || "// No comments for this gist."}
          </p>
          <img 
            src="/icons/close.svg" 
            alt="close" 
            className="cursor-pointer opacity-60 hover:opacity-100" 
            onClick={() => setShowComments(false)}
          />
        </div>
      )}
    </div>
  );
};

export default GistCard;
