import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { findProfile, ids } from '../server/session';

export default createEndpoint({
  description: 'Starts playback of an episode: returns the video, plus a pre-roll ad for free or signed-out viewers',
  inputSchema: z.object({ episodeId: z.string() }),
  outputSchema: z.object({
    episode: z.object({ id: z.string(), title: z.string(), videoUrl: z.string(), seriesTitle: z.string(), seriesId: z.string(), episodeNumber: z.number() }),
    isPremium: z.boolean(),
    locked: z.boolean(),
    ad: z.object({ id: z.string(), title: z.string(), videoUrl: z.string(), clickUrl: z.string() }).nullable(),
  }),
  execute: async ({ input, context }) => {
    const ep = await zite.episodes.findOne({ id: input.episodeId });
    if (!ep) throw new ZiteError({ code: 'NOT_FOUND', message: 'Episode missing', userFacingMessage: 'Episode not found.' });
    const series = ids(ep.series)[0] ? await zite.series.findOne({ id: ids(ep.series)[0] }) : undefined;
    const profile = context.user ? await findProfile(context.user.id) : undefined;
    if (profile?.status === 'Banned') throw new ZiteError({ code: 'FORBIDDEN', message: 'Banned', userFacingMessage: 'This account has been suspended.' });
    const isPremium = profile?.tier === 'Premium' || profile?.role === 'Admin';
    const locked = !!ep.premiumOnly && !isPremium;

    let ad: { id: string; title: string; videoUrl: string; clickUrl: string } | null = null;
    if (!isPremium && !locked) {
      const { records } = await zite.ads.findAll({ filters: { status: 'Approved' }, limit: 500 });
      const eligible = records.filter((a) => a.videoUrl && (a.deliveredViews ?? 0) < (a.targetViews ?? Infinity));
      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      if (pick) ad = { id: pick.id, title: pick.title ?? 'Sponsored', videoUrl: pick.videoUrl!, clickUrl: pick.clickUrl ?? '' };
    }
    if (!locked) await zite.episodes.update({ id: ep.id, record: { views: (ep.views ?? 0) + 1 } });

    return {
      episode: {
        id: ep.id,
        title: ep.title ?? '',
        videoUrl: locked ? '' : ep.videoUrl ?? '',
        seriesTitle: series?.title ?? '',
        seriesId: series?.id ?? '',
        episodeNumber: ep.episodeNumber ?? 0,
      },
      isPremium,
      locked,
      ad,
    };
  },
});
