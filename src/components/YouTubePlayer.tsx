import { cn } from '@project/components/lib/utils';

/**
 * YouTube embed. Error 153 happens when YouTube receives no Referer header,
 * so we send one explicitly (referrerPolicy) and pass our origin.
 * vq=hd1080 asks for 1080p; the large player size also lets YouTube pick HD.
 */
export default function YouTubePlayer({ videoId, autoplay = true, className }: { videoId: string; autoplay?: boolean; className?: string }) {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    vq: 'hd1080',
    hd: '1',
    enablejsapi: '1',
    origin: window.location.origin,
    widget_referrer: window.location.href,
  });
  return (
    <div className={cn('relative w-full aspect-video overflow-hidden rounded-xl border border-border bg-black', className)}>
      <iframe
        key={videoId}
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title="YouTube video player"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export function youTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? null;
}
