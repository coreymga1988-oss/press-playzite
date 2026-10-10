import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Crown, ExternalLink, Loader2 } from 'lucide-react';
import { recordAdView, startPlayback, type StartPlaybackOutputType } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import YouTubePlayer, { youTubeId } from '../components/YouTubePlayer';

function MainVideo({ url }: { url: string }) {
  const yt = youTubeId(url);
  if (yt) return <YouTubePlayer videoId={yt} />;
  return <video src={url} controls autoPlay playsInline className="w-full aspect-video rounded-xl border border-border bg-black" />;
}

function PreRoll({ ad, onDone }: { ad: NonNullable<StartPlaybackOutputType['ad']>; onDone: () => void }) {
  const [left, setLeft] = useState<number | null>(null);
  const counted = useRef(false);
  const finish = () => {
    if (!counted.current) {
      counted.current = true;
      recordAdView({ adId: ad.id }).catch(() => undefined);
    }
    onDone();
  };
  return (
    <div className="relative">
      <video
        src={ad.videoUrl}
        autoPlay
        playsInline
        onTimeUpdate={(e) => setLeft(Math.ceil(e.currentTarget.duration - e.currentTarget.currentTime))}
        onEnded={finish}
        onError={onDone}
        className="w-full aspect-video rounded-xl border border-primary/40 bg-black"
      />
      <div className="absolute top-3 left-3 bg-background/80 rounded px-2 py-1 text-xs font-tech uppercase tracking-widest">
        Ad {left !== null && Number.isFinite(left) ? `· ${left}s` : ''}
      </div>
      <div className="absolute bottom-3 right-3 flex gap-2">
        {ad.clickUrl && (
          <Button size="sm" variant="secondary" asChild>
            <a href={ad.clickUrl} target="_blank" rel="noopener noreferrer">Learn more <ExternalLink className="h-3 w-3" /></a>
          </Button>
        )}
        <Button size="sm" asChild variant="outline"><Link to="/premium"><Crown className="h-3 w-3" />Go ad-free</Link></Button>
      </div>
    </div>
  );
}

export default function Watch() {
  const { episodeId } = useParams();
  const [data, setData] = useState<StartPlaybackOutputType | null>(null);
  const [error, setError] = useState('');
  const [adDone, setAdDone] = useState(false);

  useEffect(() => {
    if (!episodeId) return;
    setData(null);
    setAdDone(false);
    startPlayback({ episodeId }).then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Could not load episode'));
  }, [episodeId]);

  if (error) return <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">{error}</div>;
  if (!data) return <div className="py-32 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const showAd = data.ad && !adDone;
  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 max-w-6xl">
      {data.episode.seriesId && (
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link to={`/series/${data.episode.seriesId}`}><ArrowLeft className="h-4 w-4" />{data.episode.seriesTitle}</Link>
        </Button>
      )}
      {data.locked ? (
        <div className="aspect-video rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-4 text-center p-6">
          <Crown className="h-10 w-10 text-primary" />
          <h2 className="font-display text-4xl">Premium episode</h2>
          <p className="text-muted-foreground">Upgrade to Premium for $8/month to watch this and every episode ad-free.</p>
          <Button asChild><Link to="/premium">Upgrade to Premium</Link></Button>
        </div>
      ) : showAd ? (
        <PreRoll ad={data.ad!} onDone={() => setAdDone(true)} />
      ) : data.episode.videoUrl ? (
        <MainVideo url={data.episode.videoUrl} />
      ) : (
        <div className="aspect-video rounded-xl border border-border flex items-center justify-center text-muted-foreground">Video coming soon.</div>
      )}
      <h1 className="font-display text-4xl mt-5">E{data.episode.episodeNumber} · {data.episode.title}</h1>
      {!data.isPremium && !data.locked && (
        <p className="text-sm text-muted-foreground mt-1">Free viewing is ad-supported. <Link to="/premium" className="text-primary">Go Premium</Link> to skip ads.</p>
      )}
    </div>
  );
}
