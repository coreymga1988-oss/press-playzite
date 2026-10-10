import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import { PageHeader } from '../../components/Gate';
import AdminOverview from './AdminOverview';
import AdminSettings from './AdminSettings';
import { AdsManager, CampaignsManager, CouponsManager, InvitesManager, MailingManager, NewsManager, SeriesManager, UsersManager } from './Managers';

const TABS = [
  { key: 'overview', label: 'Overview', el: <AdminOverview /> },
  { key: 'users', label: 'Users', el: <UsersManager /> },
  { key: 'invites', label: 'Invites', el: <InvitesManager /> },
  { key: 'content', label: 'Series & Episodes', el: <SeriesManager /> },
  { key: 'ads', label: 'Ads', el: <AdsManager /> },
  { key: 'campaigns', label: 'Crowdfunding', el: <CampaignsManager /> },
  { key: 'news', label: 'News', el: <NewsManager /> },
  { key: 'coupons', label: 'Coupons', el: <CouponsManager /> },
  { key: 'mailing', label: 'Mailing List', el: <MailingManager /> },
  { key: 'settings', label: 'Visibility & Settings', el: <AdminSettings /> },
];

export default function Admin() {
  const [tab, setTab] = useState('overview');
  return (
    <>
      <PageHeader eyebrow="Admin Console" title="Platform Control" />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="w-max">
              {TABS.map((t) => <TabsTrigger key={t.key} value={t.key} className="text-xs sm:text-sm">{t.label}</TabsTrigger>)}
            </TabsList>
          </div>
          {TABS.map((t) => <TabsContent key={t.key} value={t.key} className="mt-6">{tab === t.key && t.el}</TabsContent>)}
        </Tabs>
      </div>
    </>
  );
}
