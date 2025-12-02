import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  code: string;
  refreshKey?: number;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code, refreshKey }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, [code, refreshKey]);

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        ref={iframeRef}
        title="App Preview"
        className="w-full h-full border-0 block"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default PreviewFrame;