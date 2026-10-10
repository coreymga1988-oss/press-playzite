import { Link } from 'react-router-dom';
import { ArrowRight, Clapperboard, FlaskConical, Globe2, Languages, Sparkles } from 'lucide-react';
import { loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { useApp } from '../lib/AppContext';
import YouTubeGallery from '../components/YouTubeGallery';
import { COMPANY_SITE } from '../lib/socials';

function Hero() {
  const { settings, signedIn, audience } = useApp();
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg" />
      <div className="container mx-auto px-4 py-16 sm:py-24 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary mb-6">
          <FlaskConical className="h-3.5 w-3.5" />
          <span className="font-tech uppercase tracking-widest text-[0.6rem]">Closed Beta</span>
        </div>
        <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.92] max-w-4xl">
          Press Play. <span className="text-gradient">Anime, Officially.</span>
        </h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-2xl">
          {settings.beta_message ||
            "We're currently testing the site in closed beta. While we license and prepare our own titles for release, enjoy everything we've produced so far — streamed right here from our YouTube channel."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="font-tech text-xs uppercase tracking-widest">
            <a href="#videos">Watch now <ArrowRight className="h-4 w-4" /></a>
          </Button>
          {!signedIn && (
            <Button size="lg" variant="outline" onClick={() => loginWithRedirect()} className="font-tech text-xs uppercase tracking-widest">
              Create free account
            </Button>
          )}
          {audience === 'licensor' && (
            <Button asChild size="lg" variant="outline"><Link to="/licensor">Open Licensor Hub</Link></Button>
          )}
        </div>
      </div>
    </section>
  );
}

const PILLARS = [
  { icon: Languages, title: 'Localization', body: 'Subtitling, English dubbing and cultural adaptation done with care by fans who are also professionals.' },
  { icon: Globe2, title: 'Licensing & Distribution', body: 'We work directly with Japanese rights holders to bring feature films and series to English-speaking audiences.' },
  { icon: Clapperboard, title: 'Community-Funded', body: 'Fans help greenlight new releases through crowdfunding — you decide what comes next.' },
];

function About() {
  const { audience } = useApp();
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="eyebrow mb-4">Who We Are</div>
      <h2 className="font-display text-5xl sm:text-6xl max-w-3xl">Bringing anime to the world, officially.</h2>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Press Play International Media licenses, localizes, and distributes anime for English-speaking audiences — working directly with rights holders to bring exceptional stories to a global audience.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {PILLARS.map((p) => (
          <div key={p.title} className="neon-card p-6">
            <p.icon className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-display text-2xl">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{p.body}</p>
          </div>
        ))}
      </div>
      <div className={`mt-8 neon-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${audience === 'licensor' ? 'border-primary/60' : ''}`}>
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-1" />
          <div>
            <p className="font-medium">Rights holders & licensors</p>
            <p className="text-sm text-muted-foreground">Looking for a localization partner? Visit our company website to get in touch about partnering with us.</p>
          </div>
        </div>
        <Button asChild variant="outline"><a href={COMPANY_SITE} target="_blank" rel="noopener noreferrer">pressplayanime.neocities.org</a></Button>
      </div>
    </section>
  );
}

export default function Home() {
  const { canSee } = useApp();
  return (
    <>
      <Hero />
      {canSee('youtube') && (
        <section id="videos" className="container mx-auto px-4 py-16 scroll-mt-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="eyebrow mb-3">From Our Channel</div>
              <h2 className="font-display text-5xl">Watch What We've Made</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex"><Link to="/videos">See all <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <YouTubeGallery limit={8} />
          <Button asChild variant="outline" className="mt-6 sm:hidden w-full"><Link to="/videos">See all videos</Link></Button>
        </section>
      )}
      {canSee('about') && <About />}
    </>
  );
}
