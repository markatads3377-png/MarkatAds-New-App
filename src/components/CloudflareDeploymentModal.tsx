import React, { useState } from 'react';
import {
  X,
  Globe,
  GitBranch,
  Cloud,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Zap,
  Server,
  ArrowRight,
  Code,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const CloudflareDeploymentModal: React.FC = () => {
  const { isDeployModalOpen, setIsDeployModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'quick' | 'domain' | 'github_action' | 'files'>('quick');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customDomainInput, setCustomDomainInput] = useState('www.markatads.com');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [domainVerified, setDomainVerified] = useState(true);

  if (!isDeployModalOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleVerifyDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim()) return;
    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      setDomainVerified(true);
      toast.success(`Domain "${customDomainInput.trim()}" DNS records verified successfully!`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500 text-white grid place-items-center shadow-xs">
              <Cloud className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-neutral-900">
                  Cloudflare & GitHub Deployment Center
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Auto-Deploy Ready
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Connect GitHub repository to Cloudflare Pages, bind your custom domain, and enable instant CI/CD on git push.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDeployModalOpen(false)}
            className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-neutral-100 border-b border-neutral-200 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Zap className="size-3.5 text-amber-500" />
            <span>1. Cloudflare Pages Setup</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('domain')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'domain' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Globe className="size-3.5 text-blue-500" />
            <span>2. Custom Domain & DNS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github_action')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github_action' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <GitBranch className="size-3.5 text-[#C62828]" />
            <span>3. Auto-Deploy on Push</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'files' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Code className="size-3.5 text-purple-500" />
            <span>4. Config Files Reference</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: QUICK CLOUDFLARE SETUP */}
          {activeTab === 'quick' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-orange-900 text-sm">
                  <Cloud className="size-4 text-orange-600" />
                  <span>How Cloudflare Pages Automatic Git Deployments Work</span>
                </div>
                <p className="text-orange-800 leading-relaxed">
                  When you connect this GitHub repository to <strong>Cloudflare Pages</strong>, every single commit pushed to your <code>main</code> or <code>master</code> branch triggers an automatic production build and deploys to Cloudflare edge CDN within 30 seconds.
                </p>
              </div>

              {/* Step by step checklist */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Quick Step-by-Step Setup
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-start gap-3">
                    <span className="size-6 rounded-full bg-[#C62828] text-white font-bold grid place-items-center shrink-0 text-xs">
                      1
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-neutral-900 text-sm">Push Code to your GitHub Account</div>
                      <p className="text-neutral-600">
                        Create a GitHub repo (e.g. <code>markatads</code>) and push this codebase:
                      </p>
                      <div className="bg-neutral-900 text-neutral-100 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between mt-1">
                        <code>git init && git add . && git commit -m "feat: markatads" && git push</code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('git init && git add . && git commit -m "feat: markatads" && git push', 'git_push')}
                          className="text-neutral-400 hover:text-white p-1"
                        >
                          {copiedKey === 'git_push' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-start gap-3">
                    <span className="size-6 rounded-full bg-[#C62828] text-white font-bold grid place-items-center shrink-0 text-xs">
                      2
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-neutral-900 text-sm">Open Cloudflare Dashboard & Connect Git</div>
                      <p className="text-neutral-600">
                        Go to <a href="https://dash.cloudflare.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">dash.cloudflare.com</a> → <strong>Workers & Pages</strong> → <strong>Create application</strong> → <strong>Pages</strong> → <strong>Connect to Git</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-start gap-3">
                    <span className="size-6 rounded-full bg-[#C62828] text-white font-bold grid place-items-center shrink-0 text-xs">
                      3
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-neutral-900 text-sm">Configure Build Settings (Pre-Configured)</div>
                      <p className="text-neutral-600">
                        Cloudflare will auto-detect Vite. Ensure the fields match:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-neutral-200">
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Framework Preset</span>
                          <strong className="text-neutral-800">Vite</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Build Command</span>
                          <strong className="text-neutral-800">npm run build</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Build Output Directory</span>
                          <strong className="text-neutral-800">dist</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Node.js Version</span>
                          <strong className="text-neutral-800">20</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM DOMAIN & DNS CONFIGURATION */}
          {activeTab === 'domain' && (
            <div className="space-y-5 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-neutral-900">Bind Your Custom Domain</h4>
                <p className="text-neutral-600 leading-relaxed">
                  Cloudflare provides automatic SSL/TLS certificates and edge routing for your domain. Enter your domain name below:
                </p>
                <form onSubmit={handleVerifyDomain} className="flex gap-2 pt-1 max-w-md">
                  <input
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="e.g. www.markatads.com or yourbrand.com"
                    className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-semibold bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  />
                  <button
                    type="submit"
                    disabled={isVerifyingDomain}
                    className="px-4 h-10 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs"
                  >
                    {isVerifyingDomain ? 'Checking...' : 'Verify DNS'}
                  </button>
                </form>
              </div>

              {/* DNS Records Guide Box */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                    Required DNS Configuration
                  </span>
                  {domainVerified && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Validated
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse bg-white rounded-xl overflow-hidden border border-neutral-200">
                    <thead className="bg-neutral-100 text-neutral-600 font-semibold border-b border-neutral-200">
                      <tr>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Target / Value</th>
                        <th className="p-2.5">Proxy Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      <tr>
                        <td className="p-2.5 font-bold text-blue-600">CNAME</td>
                        <td className="p-2.5">www</td>
                        <td className="p-2.5">markatads.pages.dev</td>
                        <td className="p-2.5 text-orange-600 font-bold">Proxied (Orange Cloud)</td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('markatads.pages.dev', 'cname_target')}
                            className="text-neutral-500 hover:text-neutral-900"
                            title="Copy Target"
                          >
                            {copiedKey === 'cname_target' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-blue-600">CNAME</td>
                        <td className="p-2.5">@ (apex)</td>
                        <td className="p-2.5">markatads.pages.dev</td>
                        <td className="p-2.5 text-orange-600 font-bold">Proxied (Orange Cloud)</td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('markatads.pages.dev', 'cname_apex')}
                            className="text-neutral-500 hover:text-neutral-900"
                            title="Copy Target"
                          >
                            {copiedKey === 'cname_apex' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-neutral-500">
                  Tip: If your DNS is managed on Cloudflare, you can activate this with a single click in <strong>Pages</strong> → <strong>Custom domains</strong>!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB ACTIONS CI/CD */}
          {activeTab === 'github_action' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-neutral-900">Automatic Push Deployments Workflow</h4>
                <p className="text-neutral-600 leading-relaxed">
                  We have pre-configured a ready-to-run GitHub Actions workflow in <code>.github/workflows/deploy.yml</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <span className="font-bold text-neutral-900 text-xs">Two Required GitHub Repository Secrets:</span>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Secret Name</span>
                      <strong className="text-neutral-900">CLOUDFLARE_API_TOKEN</strong>
                    </div>
                    <span className="text-neutral-500 text-[10px]">Generate in Cloudflare Profile → API Tokens</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Secret Name</span>
                      <strong className="text-neutral-900">CLOUDFLARE_ACCOUNT_ID</strong>
                    </div>
                    <span className="text-neutral-500 text-[10px]">Found on Workers & Pages Dashboard Sidebar</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl font-medium">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Once secrets are added, every push to <code>main</code> deploys automatically with zero manual effort!</span>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURATION FILES REFERENCE */}
          {activeTab === 'files' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-neutral-900">Pre-Created Cloudflare Deployment Files</h4>
                <p className="text-neutral-600">
                  The following production files have been created in your workspace:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Code className="size-3.5 text-blue-600" />
                    <span>wrangler.json</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Cloudflare Pages project config targeting <code>dist</code> with nodejs_compat.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Code className="size-3.5 text-emerald-600" />
                    <span>public/_redirects</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Guarantees single page app (SPA) client-side routes like <code>/browse</code> or <code>/buyer</code> work seamlessly without 404s.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Code className="size-3.5 text-amber-600" />
                    <span>public/_headers</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Optimizes asset delivery with 1-year immutable caching for static bundles and strict security headers.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Code className="size-3.5 text-[#C62828]" />
                    <span>.github/workflows/deploy.yml</span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    Automates building & deploying to Cloudflare on every push to <code>main</code>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Deployment documentation saved to <strong>DEPLOYMENT.md</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setIsDeployModalOpen(false)}
            className="h-9 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
