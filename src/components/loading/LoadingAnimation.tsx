import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-40">
      <pre className="text-terminal-green animate-pulse">
        {`
   Loading...
   [##########]
        `}
      </pre>
    </div>
  );
}