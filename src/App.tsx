import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { ThemePanel } from './components/ThemePanel';
import { UploadZone } from './components/UploadZone';
import { DashboardPage } from './pages/DashboardPage';
import { FileManagerPage } from './pages/FileManagerPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { PaywallModal } from './components/PaywallModal';
import { useFileSystem } from './hooks/useFileSystem';
import { THEMES } from './themes';
import { ThemeColors, SheetData, FileSystemItem, SavedDashboard } from './types';
import { generateKPIs, generateCharts, generateLocalInsights } from './hooks/useSpreadsheet';
import { Palette, Save, Crown, LogOut, Bell, Menu } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useSystemData } from './hooks/useSystemData';
import { NotificationPanel } from './components/NotificationPanel';
import { ProfileModal } from './components/ProfileModal';

type View = 'landing' | 'login' | 'signup' | 'app';
const FREE_IMPORT_LIMIT = 5;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25 } }
};

function App() {
  const [theme, setTheme] = useState<ThemeColors>(THEMES['dark-purple']);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const { items, createFolder, deleteItem, renameItem, moveItem, getChildren, saveDashboard } = useFileSystem();

  const [activeItem, setActiveItem] = useState<FileSystemItem | null>(null);
  const [currentData, setCurrentData] = useState<SheetData | null>(null);
  const [dashboardMode, setDashboardMode] = useState<'auto' | 'manual' | 'saved'>('auto');
  const activeElements = React.useRef({ kpis: [], charts: [], insights: [] });

  const { notifications, markNotificationRead, markAllNotificationsRead } = useSystemData();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation
  const [view, setView] = useState<View>('landing');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trial / plan state
  const [importCount, setImportCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('nexus_import_count') || '0', 10);
  });
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('nexus_is_pro') === 'true';
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleProfile = async (session: any) => {
      setUserEmail(session.user.email ?? null);
      setUserId(session.user.id);
      const isMaster = session.user.email === 'expandix.br@outlook.com';

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro, import_count, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setIsPro(isMaster || profile.is_pro);
        setImportCount(profile.import_count);
        setUserFullName(profile.full_name || '');
        setUserAvatar(profile.avatar_url || '');
        localStorage.setItem('nexus_is_pro', String(isMaster || profile.is_pro));
        localStorage.setItem('nexus_import_count', String(profile.import_count));
      }
    };

    // Timeout de segurança: se algo falhar silenciosamente, o spinner não fica infinito
    const safetyTimeout = setTimeout(() => {
      setIsInitializing(false);
    }, 4000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          // Define email/userId imediatamente (sem await) para não bloquear
          setUserEmail(session.user.email ?? null);
          setUserId(session.user.id);
          const isMaster = session.user.email === 'expandix.br@outlook.com';
          if (isMaster) setIsPro(true);

          // Muda de view IMEDIATAMENTE — não espera a query do perfil
          setView('app');

          // Carrega o perfil em background sem bloquear a navegação
          supabase
            .from('profiles')
            .select('is_pro, import_count, full_name, avatar_url')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                setIsPro(isMaster || profile.is_pro);
                setImportCount(profile.import_count);
                setUserFullName(profile.full_name || '');
                setUserAvatar(profile.avatar_url || '');
                localStorage.setItem('nexus_is_pro', String(isMaster || profile.is_pro));
                localStorage.setItem('nexus_import_count', String(profile.import_count));
              }
            });
        } else {
          setView('landing');
        }
      } finally {
        clearTimeout(safetyTimeout);
        setIsInitializing(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const reloadProfile = async () => {
    if (!userId) return;
    const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', userId).single();
    if (profile) {
      setUserFullName(profile.full_name || '');
      setUserAvatar(profile.avatar_url || '');
    }
  };

  // Current inner view for animated transitions
  const [innerView, setInnerView] = useState<'upload' | 'vault' | 'dashboard' | 'empty'>('upload');

  useEffect(() => {
    if (!isImporting && !showVault && currentData) setInnerView('dashboard');
    else if (showVault) setInnerView('vault');
    else if (isImporting && !currentData) setInnerView('upload');
    else setInnerView('empty');
  }, [isImporting, showVault, currentData]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', theme.bg);
    document.documentElement.style.setProperty('--bg-card', theme.bgCard);
    document.documentElement.style.setProperty('--bg-input', theme.bgInput);
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--text-muted', theme.textMuted);
    document.documentElement.style.setProperty('--border', theme.border);
  }, [theme]);

  const handleSelect = (item: FileSystemItem) => {
    setActiveItem(item);
    if (item.type === 'dashboard' && item.data) {
      setCurrentData(item.data.sheetData ?? null);
      setDashboardMode('saved');
      setIsImporting(false);
      setShowVault(false);
    }
  };

  const handleSaveDashboard = () => {
    if (currentData) {
      const dashboard: SavedDashboard = {
        id: activeItem?.id || `dash-${Date.now()}`,
        name: activeItem?.name || currentData.fileName || 'Novo Dashboard',
        fileName: currentData.fileName || 'Novo Dashboard',
        savedAt: new Date().toISOString(),
        themeId: theme.id,
        kpis: activeElements.current.kpis,
        charts: activeElements.current.charts,
        insights: activeElements.current.insights,
        activeFilters: [],
        sheetData: currentData
      };
      saveDashboard(dashboard, activeItem?.parentId || 'root');
    }
  };

  const handleUpdateData = (newData: SheetData) => {
    setCurrentData(newData);
    let dashboardToSave: SavedDashboard | null = null;
    let parentId = 'root';
    if (activeItem && activeItem.type === 'dashboard') {
      dashboardToSave = { ...(activeItem.data as SavedDashboard), sheetData: newData };
      parentId = activeItem.parentId || 'root';
    } else if (currentData) {
      const rootItems = getChildren('root');
      const existing = rootItems.find(it => it.type === 'dashboard' && it.name === currentData.fileName.replace('.xlsx', ''));
      if (existing && existing.data) {
        dashboardToSave = { ...existing.data, sheetData: newData };
      }
    }
    if (dashboardToSave) saveDashboard(dashboardToSave, parentId);
  };

  const handleNewImport = async (data: SheetData, mode: 'auto' | 'manual') => {
    const newCount = importCount + 1;
    setImportCount(newCount);
    localStorage.setItem('nexus_import_count', String(newCount));

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({ import_count: newCount }).eq('id', session.user.id);
    }

    setDashboardMode(mode);
    setCurrentData(data);
    setIsImporting(false);
    
    let initialKpis: any[] = [];
    let initialCharts: any[] = [];
    let initialInsights: any[] = [];

    if (mode === 'auto') {
      initialKpis = generateKPIs(data);
      initialCharts = generateCharts(data);
      initialInsights = generateLocalInsights(data, initialKpis);
    }

    const dashboard: SavedDashboard = {
      id: `dash-${Date.now()}`,
      name: data.fileName || 'Novo Dashboard',
      fileName: data.fileName || 'Novo Dashboard',
      savedAt: new Date().toISOString(),
      themeId: theme.id,
      kpis: initialKpis, 
      charts: initialCharts, 
      insights: initialInsights, 
      activeFilters: [],
      sheetData: data
    };
    saveDashboard(dashboard, 'root');
  };

  const handleRequestImport = () => {
    const isMaster = userEmail === 'expandix.br@outlook.com';
    if (!isMaster && !isPro && importCount >= FREE_IMPORT_LIMIT) {
      setShowPaywall(true);
    } else {
      setIsImporting(true);
      setShowVault(false);
      setCurrentData(null);
      setActiveItem(null);
    }
  };

  const handleChoosePlan = async (plan: 'monthly' | 'annual') => {
    // Definimos os links originais direto do Stripe fornecidos pelo usuário
    const baseUrl = plan === 'monthly' 
      ? 'https://buy.stripe.com/cNieVd9EcdbI03c3n8dIA00'
      : 'https://buy.stripe.com/aFa5kD9Ec8Vs8zI3n8dIA01';
      
    // Anexamos o e-mail pré-preenchido e o client_reference_id (fundamental pra saber quem pagou)
    const checkoutUrl = `${baseUrl}?prefilled_email=${encodeURIComponent(userEmail || '')}&client_reference_id=${userId}`;
    
    // Redirecionamento blindado para checkout oficial.
    window.location.href = checkoutUrl;
  };

  const enterApp = () => setView('app');
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nexus_auth');
    localStorage.removeItem('nexus_is_pro');
    localStorage.removeItem('nexus_import_count');
    setView('landing');
  };

  const TopBar = () => (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-16 flex items-center justify-between px-4 md:px-8 border-b shrink-0 z-20 sticky top-0 backdrop-blur-md"
      style={{ background: 'var(--bg)dd', borderBottomColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'var(--primary)20', color: 'var(--primary)' }}
        >
          <Menu size={20} />
        </button>
        <h2 className="font-headline font-bold text-sm md:text-base truncate max-w-[140px] md:max-w-none" style={{ color: 'var(--text)' }}>
          {showVault ? 'Organizador de Cofres' : isImporting ? 'Nova Importação' : activeItem?.name || currentData?.fileName || 'Visão Geral'}
        </h2>
        {currentData && !isImporting && !showVault && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold"
            style={{ background: 'var(--primary)20', color: 'var(--accent)' }}
          >
            Dashboard Salvo
          </motion.span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Plan badge */}
        {isPro ? (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(56,189,248,0.2))', border: '1px solid rgba(124,58,237,0.4)', color: '#A78BFA' }}
          >
            <Crown size={12} /> PRO
          </motion.div>
        ) : (
          <button
            onClick={() => setShowPaywall(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}
          >
            <Crown size={12} />
            Free ({Math.max(0, FREE_IMPORT_LIMIT - importCount)} import{FREE_IMPORT_LIMIT - importCount !== 1 ? 's' : ''} restante{FREE_IMPORT_LIMIT - importCount !== 1 ? 's' : ''})
          </button>
        )}
        {currentData && !isImporting && !showVault && (
          <button
            onClick={handleSaveDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            <Save size={14} /> Salvar
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 relative"
            style={{ background: 'var(--primary)20', color: 'var(--text)' }}
            title="Notificações"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_var(--primary)]"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkRead={markNotificationRead}
                onMarkAllRead={markAllNotificationsRead}
              />
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowThemePanel(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'var(--primary)20', color: 'var(--primary)' }}
          title="Alterar Tema"
        >
          <Palette size={18} />
        </button>
        <button
          onClick={handleSignOut}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/20 text-slate-400 hover:text-red-400"
          title="Sair da Conta"
        >
          <LogOut size={18} />
        </button>
      </div>
    </motion.header>
  );

  // ===== Auth pages & Landing =====
  if (isInitializing) return (
    <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--primary) transparent transparent transparent' }} />
    </div>
  );
  if (view === 'landing') return (
    <LandingPage onEnter={() => setView('login')} onLogin={() => setView('login')} onSignUp={() => setView('signup')} />
  );
  if (view === 'login') return (
    <LoginPage onLogin={enterApp} onGoToSignUp={() => setView('signup')} onBack={() => setView('landing')} />
  );
  if (view === 'signup') return (
    <SignUpPage onSignUp={enterApp} onGoToLogin={() => setView('login')} onBack={() => setView('landing')} />
  );

  // ===== Main App =====
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar
        items={items}
        activeId={activeItem?.id || null}
        onSelect={(item) => { handleSelect(item); setMobileMenuOpen(false); }}
        onCreateFolder={createFolder}
        onDelete={deleteItem}
        onRename={renameItem}
        onMove={moveItem}
        getChildren={getChildren}
        onImport={() => { handleRequestImport(); setMobileMenuOpen(false); }}
        onOpenVault={() => { setShowVault(true); setIsImporting(false); setActiveItem(null); setMobileMenuOpen(false); }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        userFullName={userFullName}
        userAvatar={userAvatar}
        onProfileClick={() => setShowProfile(true)}
      />

      <main className="flex-1 flex flex-col md:ml-64 overflow-hidden relative w-full">
        <TopBar />

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar" style={{ padding: showVault ? '0' : '1rem md:p-8' }}>
          <div className={`mx-auto w-full ${showVault ? 'h-full' : 'max-w-7xl'}`}>

            {/* Animated inner view switcher */}
            <AnimatePresence mode="wait">

              {innerView === 'vault' && (
                <motion.div key="vault" {...pageVariants}>
                  <FileManagerPage
                    items={items}
                    getChildren={getChildren}
                    onCreateFolder={createFolder}
                    onDelete={deleteItem}
                    onRename={renameItem}
                    onMove={moveItem}
                    onOpenItem={handleSelect}
                  />
                </motion.div>
              )}

              {innerView === 'upload' && (
                <motion.div key="upload" {...pageVariants}>
                  <UploadZone onData={handleNewImport} />
                </motion.div>
              )}

              {innerView === 'dashboard' && currentData && (
                <motion.div key="dashboard" {...pageVariants}>
                  <DashboardPage
                    data={currentData}
                    theme={theme}
                    title={activeItem?.name || currentData.fileName || 'Dashboard'}
                    mode={dashboardMode}
                    savedKpis={activeItem?.data?.kpis}
                    savedCharts={activeItem?.data?.charts}
                    savedInsights={activeItem?.data?.insights}
                    onUpdateData={handleUpdateData}
                    onChangeElements={(k, c, i) => {
                      activeElements.current = { kpis: k as any, charts: c as any, insights: i as any };
                    }}
                  />
                </motion.div>
              )}

              {innerView === 'empty' && (
                <motion.div key="empty" {...pageVariants} className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
                    style={{ background: 'var(--primary)15' }}
                  >
                    <span className="text-3xl">🔮</span>
                  </motion.div>
                  <h3 className="font-headline text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Bem-vindo ao NEXUS BI</h3>
                  <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
                    Importe uma planilha ou selecione um dashboard salvo para começar.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleRequestImport}
                      className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
                      style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                    >
                      Nova Importação
                    </button>
                    <button
                      onClick={() => { setShowVault(true); setIsImporting(false); }}
                      className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                      style={{ background: 'var(--bg-input)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      Abrir Cofres
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Theme Panel */}
      <AnimatePresence>
        {showThemePanel && (
          <motion.div
            key="theme"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full z-50"
          >
            <ThemePanel current={theme} onSelect={setTheme} onClose={() => setShowThemePanel(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallModal
            onClose={() => setShowPaywall(false)}
            onChoosePlan={handleChoosePlan}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <ProfileModal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            email={userEmail || ''}
            isPro={isPro}
            importCount={importCount}
            userId={userId}
            fullName={userFullName}
            avatarUrl={userAvatar}
            onProfileUpdated={reloadProfile}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
