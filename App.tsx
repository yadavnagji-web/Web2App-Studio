
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Globe, 
  Settings, 
  Palette, 
  Smartphone, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Cpu,
  Layers,
  Sparkles,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Store,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Rocket,
  QrCode,
  Terminal,
  Activity,
  Wifi,
  Package,
  Zap,
  Lock,
  User,
  ShieldAlert,
  Server,
  Key,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { AppConfig, AppStep, GeneratedCode, StoreMetadata } from './types';
import { GeminiService } from './services/geminiService';

// --- Sub-components ---

const StepIndicator: React.FC<{ currentStep: AppStep }> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.INITIAL, label: 'URL', icon: Globe },
    { id: AppStep.BRANDING, label: 'Branding', icon: Palette },
    { id: AppStep.FEATURES, label: 'Code', icon: Settings },
    { id: AppStep.STORE_LISTING, label: 'Store', icon: Store },
    { id: AppStep.COMPLETE, label: 'Ready', icon: Rocket },
  ];

  const getStepStatus = (stepId: AppStep) => {
    const stepOrder = [AppStep.INITIAL, AppStep.BRANDING, AppStep.FEATURES, AppStep.GENERATING, AppStep.BUILDING, AppStep.STORE_LISTING, AppStep.COMPLETE];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                status === 'completed' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                status === 'active' ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600 shadow-lg shadow-indigo-100' : 
                'bg-slate-200 text-slate-400'
              }`}>
                {status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] mt-2 font-black uppercase tracking-widest ${status === 'active' ? 'text-indigo-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-px w-8 sm:w-16 ${status === 'completed' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const QrModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      // @ts-ignore
      new QRCode(qrRef.current, {
        text: url || "https://google.com",
        width: 200,
        height: 200,
        colorDark: "#4f46e5",
        colorLight: "#ffffff",
        correctLevel: 1
      });
    }
  }, [url]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-indigo-100">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Mobile Bridge</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol Version 4.0</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
        </div>
        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-[2.5rem] flex items-center justify-center border-2 border-indigo-100 shadow-inner relative group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"></div>
            <div ref={qrRef} className="rounded-2xl overflow-hidden shadow-xl ring-4 ring-white"></div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center space-x-4 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200"><Smartphone className="w-5 h-5" /></div>
               <div className="flex-grow">
                 <p className="text-xs font-black text-slate-800">Scan QR Code</p>
                 <p className="text-[10px] text-slate-500 font-medium italic">Instant PWA-to-Native runtime</p>
               </div>
             </div>
             <div className="flex items-center space-x-4 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
               <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200"><Wifi className="w-5 h-5" /></div>
               <div className="flex-grow">
                 <p className="text-xs font-black text-slate-800">Direct Connection</p>
                 <p className="text-[10px] text-slate-500 font-medium italic">Peer-to-peer cloud build bridge</p>
               </div>
             </div>
          </div>
          <button onClick={onClose} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-xl shadow-slate-300">
            Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INITIAL);
  const [config, setConfig] = useState<AppConfig>({
    url: '',
    name: '',
    packageName: 'com.webapp.studio',
    themeColor: '#4f46e5',
    category: 'Business & SaaS',
    permissions: {
      camera: false,
      location: true,
      microphone: false,
      storage: true,
    }
  });
  
  const [storeData, setStoreData] = useState<StoreMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedCode | null>(null);
  const [gemini] = useState(() => new GeminiService());
  const [showQr, setShowQr] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);

  const handleNext = () => {
    if (step === AppStep.INITIAL) setStep(AppStep.BRANDING);
    else if (step === AppStep.BRANDING) setStep(AppStep.FEATURES);
    else if (step === AppStep.FEATURES) startGeneration();
    else if (step === AppStep.STORE_LISTING) setStep(AppStep.COMPLETE);
  };

  const handleBack = () => {
    if (step === AppStep.BRANDING) setStep(AppStep.INITIAL);
    else if (step === AppStep.FEATURES) setStep(AppStep.BRANDING);
    else if (step === AppStep.STORE_LISTING) setStep(AppStep.FEATURES);
    else if (step === AppStep.COMPLETE) setStep(AppStep.STORE_LISTING);
  };

  const startGeneration = async () => {
    setLoading(true);
    setStep(AppStep.GENERATING);
    try {
      const code = await gemini.generateAndroidProject(config);
      setGeneratedData(code);
      simulateCloudBuild();
    } catch (error) {
      console.error(error);
      alert("AI Architecture Engine failed. Ensure valid environment keys are set.");
      setStep(AppStep.FEATURES);
    } finally {
      setLoading(false);
    }
  };

  const simulateCloudBuild = () => {
    setStep(AppStep.BUILDING);
    const logs = [
      "Initializing Cloud Build Engine...",
      "Validating Package: " + config.packageName,
      "Compiling AI Architecture Manifest...",
      "Resolving AndroidX Dependencies...",
      "Building Native Java Bridge Framework...",
      "Compiling Resources (AAPT2 Optimized)...",
      "Zipalign: Optimizing binary alignment...",
      "Signing APK with v2/v3 signing scheme...",
      "Generating App Bundle (AAB) for Store...",
      "BUILD SUCCESSFUL: Artifacts generated."
    ];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setBuildLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[currentIdx]}`]);
        setBuildProgress(((currentIdx + 1) / logs.length) * 100);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(AppStep.STORE_LISTING), 1000);
      }
    }, 600);
  };

  const generateStoreListing = async () => {
    setLoading(true);
    try {
      const [metadata, featureGraphic] = await Promise.all([
        gemini.generateStoreMetadata(config),
        gemini.generateFeatureGraphic(config)
      ]);
      setStoreData({
        ...metadata,
        featureGraphicUrl: featureGraphic
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate store listing.");
    } finally {
      setLoading(false);
    }
  };

  const generateAIIcon = async () => {
    setLoading(true);
    try {
      const icon = await gemini.generateAppIcon(config);
      setConfig(prev => ({ ...prev, iconUrl: icon }));
    } catch (error) {
      console.error(error);
      alert("Could not generate AI icon.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAPK = () => {
    const mockApk = new Blob(["MOCK_APK_DATA"], { type: 'application/vnd.android.package-archive' });
    const url = window.URL.createObjectURL(mockApk);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, '_')}_v1.0.apk`;
    a.click();
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-inter">
      {showQr && <QrModal url={config.url} onClose={() => setShowQr(false)} />}
      
      {/* Header */}
      <nav className="glass sticky top-0 z-[60] border-b border-slate-200/60 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-[1.2rem] shadow-xl shadow-indigo-200/50 flex items-center justify-center transform hover:rotate-6 transition-transform">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                Web2App Studio
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                Pro Edition
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
            <button onClick={() => setShowQr(true)} className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 group">
              <QrCode className="w-4 h-4 group-hover:scale-110 transition" />
              <span>Live Bridge</span>
            </button>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition shadow-lg text-xs font-black uppercase tracking-widest">
              My Projects
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <header className="space-y-3">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm">
                <Activity className="w-3 h-3 mr-2" />
                Production Pipeline: Active
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Convert <span className="text-indigo-600">Web</span> to <span className="text-violet-600">Production</span> APKs.
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                Experience the world's most powerful AI-driven WebView generator. Built for performance, security, and high-conversion Play Store presence.
              </p>
            </header>

            <StepIndicator currentStep={step} />

            <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] relative overflow-hidden">
              {step === AppStep.INITIAL && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Source Web Application URL</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Globe className="w-6 h-6" />
                      </div>
                      <input 
                        type="url"
                        placeholder="https://your-webapp.com"
                        className="w-full pl-14 pr-6 py-5 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium shadow-inner"
                        value={config.url}
                        onChange={(e) => setConfig({ ...config, url: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Native App Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Acme Commerce"
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium shadow-inner"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value, packageName: `com.${e.target.value.toLowerCase().replace(/\s+/g, '.')}.app` })}
                    />
                  </div>
                </div>
              )}

              {step === AppStep.BRANDING && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Primary Brand Color</label>
                      <div className="flex items-center space-x-5">
                        <input 
                          type="color"
                          className="w-20 h-20 rounded-[2.5rem] cursor-pointer border-4 border-white shadow-2xl p-0 overflow-hidden shrink-0 transform hover:scale-105 transition-transform"
                          value={config.themeColor}
                          onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                        />
                        <div className="flex-grow">
                          <input 
                            type="text"
                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-sm shadow-inner uppercase font-black text-indigo-600"
                            value={config.themeColor}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">App Category</label>
                      <select 
                        className="w-full px-5 py-4 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition outline-none font-black text-slate-700 uppercase text-[11px] tracking-widest"
                        value={config.category}
                        onChange={(e) => setConfig({ ...config, category: e.target.value })}
                      >
                        <option>E-commerce & Shopping</option>
                        <option>Business & SaaS</option>
                        <option>Portfolio & Personal</option>
                        <option>Productivity Tool</option>
                        <option>Health & Wellness</option>
                        <option>Entertainment</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Native 512px Identity</label>
                    <div className="flex items-center space-x-8 p-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 group relative">
                      <div className="w-28 h-28 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 flex items-center justify-center overflow-hidden relative border-2 border-indigo-50 shrink-0">
                        {config.iconUrl ? (
                          <img src={config.iconUrl} alt="App Icon" className="w-full h-full object-cover animate-in fade-in duration-500" />
                        ) : (
                          <div className="flex flex-col items-center">
                             <ImageIcon className="text-slate-200 w-12 h-12 mb-1" />
                             <span className="text-[10px] text-slate-300 font-black">AI ASSET</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow space-y-3">
                        <button 
                          onClick={generateAIIcon}
                          disabled={loading}
                          className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-white text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all font-black uppercase tracking-widest text-[11px] border-2 border-indigo-50 shadow-sm"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                          <span>Generate Identity</span>
                        </button>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">AI uses categories to design minimalist icons.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === AppStep.FEATURES && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Android Package ID</label>
                    <input 
                      type="text"
                      className="w-full px-6 py-5 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none font-mono text-indigo-600 font-black tracking-tight"
                      value={config.packageName}
                      onChange={(e) => setConfig({ ...config, packageName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-widest ml-1">Runtime Bridge Permissions</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.keys(config.permissions).map((perm) => (
                        <label key={perm} className="flex items-center p-5 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 hover:border-indigo-500 hover:bg-white transition-all cursor-pointer group shadow-sm">
                          <input 
                            type="checkbox"
                            className="w-6 h-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={config.permissions[perm as keyof typeof config.permissions]}
                            onChange={(e) => setConfig({
                              ...config,
                              permissions: { ...config.permissions, [perm]: e.target.checked }
                            })}
                          />
                          <div className="ml-4">
                             <span className="block text-sm font-black text-slate-800 uppercase tracking-widest">{perm} Bridge</span>
                             <span className="text-[10px] text-slate-400 font-bold italic">Enable native handler</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === AppStep.GENERATING && (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-20 text-center">
                  <div className="relative">
                    <div className="w-36 h-36 border-[12px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-14 h-14" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Mapping Infrastructure</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-bold text-sm leading-relaxed uppercase tracking-wider">
                      Gemini-3-Pro Architecture Build
                    </p>
                  </div>
                </div>
              )}

              {step === AppStep.BUILDING && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Terminal className="text-indigo-600 w-5 h-5" />
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Cloud Engine Output</h3>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">{Math.round(buildProgress)}% COMPILED</span>
                  </div>
                  
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500 ease-out shadow-lg" style={{ width: `${buildProgress}%` }}></div>
                  </div>

                  <div className="bg-slate-900 rounded-[2.5rem] p-8 h-[250px] overflow-y-auto font-mono text-[11px] space-y-2 shadow-2xl no-scrollbar border border-slate-800">
                    {buildLogs.map((log, i) => (
                      <div key={i} className="flex space-x-4">
                        <span className="text-slate-700 select-none font-bold italic">{String(i+1).padStart(2, '0')}</span>
                        <span className={`${log.includes('SUCCESSFUL') ? 'text-emerald-400 font-black' : 'text-slate-400'}`}>{log}</span>
                      </div>
                    ))}
                    {buildProgress < 100 && <div className="text-indigo-400 animate-pulse font-black">_</div>}
                  </div>
                </div>
              )}

              {step === AppStep.STORE_LISTING && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!storeData ? (
                    <div className="text-center py-10 space-y-8">
                      <div className="bg-indigo-50 w-28 h-28 rounded-[3rem] flex items-center justify-center mx-auto shadow-xl border border-indigo-100">
                        <Store className="text-indigo-600 w-12 h-12" />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">Store SEO Optimizer</h3>
                         <p className="text-slate-500 text-sm max-w-sm mx-auto font-bold uppercase tracking-wider">Automate high-converting metadata & graphics.</p>
                      </div>
                      <button 
                        onClick={generateStoreListing}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center space-x-3 mx-auto shadow-2xl shadow-indigo-300 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                      >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        <span>Optimize Store Listing</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Store Short Pitch</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                              value={storeData.shortDescription}
                              onChange={(e) => setStoreData({...storeData, shortDescription: e.target.value})}
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Play Category</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-indigo-600 uppercase tracking-wider"
                              value={storeData.category}
                              onChange={(e) => setStoreData({...storeData, category: e.target.value})}
                            />
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SEO Full Description</label>
                         <textarea 
                           className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-medium min-h-[160px] no-scrollbar leading-relaxed"
                           value={storeData.fullDescription}
                           onChange={(e) => setStoreData({...storeData, fullDescription: e.target.value})}
                         />
                       </div>

                       <div className="p-6 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center space-x-5">
                             <div className="bg-emerald-600 text-white p-3 rounded-[1.2rem] shadow-lg shadow-emerald-200"><ShieldCheck className="w-6 h-6" /></div>
                             <div>
                                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tighter">Security Ready</h4>
                                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Privacy Bundle Generated</p>
                             </div>
                          </div>
                          <button className="px-5 py-2.5 bg-white text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-200 hover:bg-emerald-100 transition uppercase tracking-widest">Docs Ready</button>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {step === AppStep.COMPLETE && (
                <div className="space-y-10 animate-in zoom-in-95 duration-500">
                  <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                     <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-12 -translate-y-12 rotate-12 scale-150">
                        <Rocket className="w-56 h-56" />
                     </div>
                     <div className="relative z-10 space-y-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30 border border-indigo-400">
                           <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-5xl font-black tracking-tighter mb-2 italic">Build Ready.</h3>
                          <p className="text-slate-400 font-bold text-lg uppercase tracking-wide">Artifacts finalized for {config.name}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <button 
                      onClick={downloadAPK}
                      className="group p-10 bg-white rounded-[3rem] border-2 border-slate-100 flex flex-col items-center text-center space-y-6 hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-100/50"
                    >
                       <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                          <Package className="w-10 h-10" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-widest mb-1">Download APK</h4>
                          <p className="text-[11px] text-indigo-500 font-black italic">RELEASE_SIGNED.apk (v1.0)</p>
                       </div>
                    </button>

                    <button className="group p-10 bg-white rounded-[3rem] border-2 border-slate-100 flex flex-col items-center text-center space-y-6 hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
                       <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                          <Code2 className="w-10 h-10" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-widest mb-1">Source Kit</h4>
                          <p className="text-[11px] text-slate-500 font-black italic">ANDROID_STUDIO_SRC.zip</p>
                       </div>
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowQr(true)}
                    className="w-full flex items-center justify-center space-x-4 bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-300 transform active:scale-95"
                  >
                    <QrCode className="w-7 h-7" />
                    <span>Live Pair Device</span>
                  </button>
                </div>
              )}

              {/* Navigation Controls */}
              {step !== AppStep.GENERATING && step !== AppStep.BUILDING && step !== AppStep.COMPLETE && (
                <div className="flex items-center justify-between mt-12 pt-10 border-t border-slate-100">
                  <button 
                    onClick={handleBack}
                    disabled={step === AppStep.INITIAL}
                    className={`flex items-center space-x-2 px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition ${
                      step === AppStep.INITIAL ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>

                  <button 
                    onClick={handleNext}
                    disabled={(step === AppStep.INITIAL && !config.url) || (step === AppStep.STORE_LISTING && !storeData)}
                    className={`flex items-center space-x-3 bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 transform active:scale-95 ${
                      ((step === AppStep.INITIAL && !config.url) || (step === AppStep.STORE_LISTING && !storeData)) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>{step === AppStep.FEATURES ? 'Initiate Cloud Build' : step === AppStep.STORE_LISTING ? 'Finalize Bundle' : 'Proceed'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5 hidden lg:block sticky top-28">
            <div className="space-y-8">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center space-x-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 status-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                     {step === AppStep.STORE_LISTING || step === AppStep.COMPLETE ? 'Store Front' : 'Device Runtime'}
                   </h2>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                  <Wifi className="w-4 h-4" />
                  <span>BRIDGE ONLINE</span>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-8 bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-600 rounded-[5rem] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                   <div className="mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[3.5rem] h-[640px] w-[320px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-700 ring-4 ring-white/10">
                    <div className="w-[160px] h-[20px] bg-gray-800 top-0 left-1/2 -translate-x-1/2 absolute rounded-b-[1.5rem] z-20"></div>
                    <div className="rounded-[2.8rem] overflow-hidden w-full h-full bg-white relative">
                      {storeData ? (
                        <div className="h-full overflow-y-auto bg-white pt-8 pb-20 no-scrollbar">
                           <div className="px-8 flex items-start space-x-5 mb-8">
                              <div className="w-20 h-20 rounded-[1.8rem] shadow-2xl border border-slate-50 overflow-hidden flex-shrink-0 ring-1 ring-slate-100">
                                {config.iconUrl ? <img src={config.iconUrl} alt="Icon" className="w-full h-full object-cover" /> : <div className="bg-slate-100 w-full h-full" />}
                              </div>
                              <div className="flex-grow pt-2">
                                 <h4 className="font-black text-xl leading-tight text-slate-900 tracking-tight">{config.name || "App Name"}</h4>
                                 <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-1">{storeData.category || "General"}</p>
                                 <div className="flex items-center space-x-1 mt-2">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Safe for all</span>
                                 </div>
                              </div>
                           </div>
                           <div className="px-8 mb-8">
                             <button className="w-full bg-emerald-600 text-white rounded-2xl py-3.5 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 active:scale-95 transition-transform">Install</button>
                           </div>
                           <div className="px-8 space-y-6">
                              <div className="border-t border-slate-100 pt-6">
                                 <h5 className="text-[11px] font-black text-slate-800 mb-2 uppercase tracking-widest">Description</h5>
                                 <p className="text-[12px] text-slate-500 line-clamp-4 leading-relaxed font-medium">
                                   {storeData.shortDescription || "Optimization pending..."}
                                 </p>
                              </div>
                              <div className="w-full aspect-[16/9] rounded-[2rem] bg-slate-100 overflow-hidden relative shadow-inner">
                                 {storeData.featureGraphicUrl ? (
                                   <img src={storeData.featureGraphicUrl} alt="Feature" className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <ImageIcon className="w-12 h-12 opacity-50" />
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute top-0 left-0 right-0 h-16 flex items-center px-8 z-10 shadow-lg" style={{ backgroundColor: config.themeColor }}>
                            <div className="w-9 h-9 rounded-[1rem] bg-white/20 mr-4 flex items-center justify-center overflow-hidden border border-white/20">
                               {config.iconUrl ? <img src={config.iconUrl} alt="Icon" className="w-full h-full object-cover" /> : <Smartphone className="text-white w-5 h-5" />}
                            </div>
                            <span className="text-white font-black text-sm uppercase tracking-widest truncate">{config.name || "System"}</span>
                          </div>
                          <div className="pt-16 h-full w-full bg-slate-50 flex items-center justify-center text-center p-8">
                            {config.url ? (
                              <div className="space-y-4">
                                <Globe className="w-16 h-16 text-indigo-200 mx-auto animate-pulse" />
                                <div className="space-y-1">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Runtime Connection</p>
                                  <p className="text-sm font-black text-indigo-600 truncate max-w-[200px] bg-indigo-50 px-3 py-1 rounded-full">{config.url}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4 opacity-30">
                                <Wifi className="w-12 h-12 text-slate-300 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Bridge</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Connections</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-black text-slate-900">Pixel 8 Pro (Bridge_WA1)</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">2.4ms Latency</span>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex -space-x-3">
                       <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 border-4 border-white flex items-center justify-center text-white font-black text-xs shadow-xl">YN</div>
                       <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-100 border-4 border-white flex items-center justify-center text-indigo-400 font-black text-xs shadow-lg">+</div>
                    </div>
                    <button 
                      onClick={() => setShowQr(true)}
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition uppercase tracking-widest border-b-2 border-indigo-100 pb-1"
                    >
                      Pair New Test Node
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-20 px-8 bg-white mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-1 space-y-8">
            <div className="flex items-center space-x-3">
              <Zap className="text-indigo-600 w-8 h-8 fill-indigo-600" />
              <span className="font-black text-2xl tracking-tighter">Web2App Pro</span>
            </div>
            <p className="text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-wider opacity-60">
              Hyperscale mobile architecture powered by neural engineering. 
            </p>
          </div>
          <div>
            <h5 className="font-black text-xs text-slate-900 uppercase tracking-[0.3em] mb-8">Ecosystem</h5>
            <ul className="text-sm text-slate-400 font-black uppercase tracking-widest space-y-4">
              <li><a href="#" className="hover:text-indigo-600 transition">Keystore Engine</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Asset Optimizer</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Cloud Dashboard</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Store Manager</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs text-slate-900 uppercase tracking-[0.3em] mb-8">Compliance</h5>
            <ul className="text-sm text-slate-400 font-black uppercase tracking-widest space-y-4">
              <li><a href="#" className="hover:text-indigo-600 transition">Proguard Core</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">SSL Pinning</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">GDPR Bridge</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">App Signing</a></li>
            </ul>
          </div>
          <div className="text-right">
             <div className="inline-block bg-slate-900 p-10 rounded-[3.5rem] text-left shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-800 relative group overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Instance Monitor</p>
                <div className="flex items-end space-x-1.5 h-10 mb-6">
                   <div className="w-1.5 h-4 bg-indigo-500/50 rounded-full"></div>
                   <div className="w-1.5 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                   <div className="w-1.5 h-5 bg-indigo-500/50 rounded-full"></div>
                   <div className="w-1.5 h-10 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
                   <span className="text-[11px] font-black text-white italic tracking-widest uppercase">CLOUD_CLUSTER_01</span>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 flex items-center justify-between opacity-40">
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Web2App Studio Pro v4.0.2</span>
           <div className="flex space-x-8 text-[10px] font-black uppercase tracking-[0.4em]">
              <a href="#">Privacy Policy</a>
              <a href="#">Security Audit</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
