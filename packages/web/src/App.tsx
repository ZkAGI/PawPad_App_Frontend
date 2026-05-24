import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from './components/common/BottomNav';
import './lib/storage';
import { getStoredWallet, loadSession } from './services/teeService';
import AgentArena from './pages/AgentArena';


const HIDE_NAV_ROUTES = [
  '/onboarding', '/mxe-explanation', '/quick-summary', '/chain-selection',
  '/email-input', '/vault-name', '/tee-login', '/tee-setup', '/recover-tee',
  '/creating-vault', '/creating-seedless', '/vault-success', '/recover-seedless',
];

function AppContent() {
  const location = useLocation();
  const hideNav = HIDE_NAV_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <div className="app-container">
      <Routes>
        {/* ONBOARDING */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/mxe-explanation" element={<MXEExplanation />} />
        <Route path="/quick-summary" element={<QuickSummary />} />
        <Route path="/chain-selection" element={<ChainSelection />} />
        <Route path="/email-input" element={<EmailInput />} />
        <Route path="/vault-name" element={<VaultNameInput />} />
        <Route path="/arena" element={<AgentArena />} />


        {/* TEE WALLET */}
        <Route path="/tee-login" element={<TEELogin />} />
        <Route path="/tee-setup" element={<TEESetup />} />
        <Route path="/recover-tee" element={<RecoverTEEWallet />} />

        {/* VAULT CREATION */}
        <Route path="/creating-vault" element={<CreatingVault />} />
        <Route path="/creating-seedless" element={<CreatingSeedlessVault />} />
        <Route path="/vault-success" element={<VaultSuccess />} />
        <Route path="/recover-seedless" element={<RecoverSeedlessVault />} />

        {/* MAIN APP */}
        <Route path="/home" element={<Home />} />
        <Route path="/send" element={<Send />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/fund" element={<FundWallet />} />
        <Route path="/lending" element={<Lending />} />
        <Route path="/darkpool" element={<DarkPool />} />
        <Route path="/history" element={<History />} />

        {/* AGENTS */}
        <Route path="/agents" element={<AgentRouter />} />
        <Route path="/agents/setup" element={<AgentSetup />} />
        <Route path="/agents/preferences" element={<AgentPreferences />} />
        <Route path="/agents/creating" element={<AgentCreating />} />
        <Route path="/agents/dashboard" element={<AgentDashboard />} />

        {/* SETTINGS / BACKUP / RECOVERY */}
        <Route path="/backup" element={<Backup />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/settings" element={<Settings />} />

        {/* DEFAULT */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
}

// Checks for existing wallet like the real RN app
function RootRedirect() {
  const wallet = getStoredWallet();
  if (wallet) {
    if (loadSession()) return <Navigate to="/home" replace />;
    return <Navigate to="/tee-login" replace />;
  }
  return <Navigate to="/onboarding" replace />;
}

// Onboarding
import Onboarding from './pages/onboarding/Onboarding';
import MXEExplanation from './pages/onboarding/MXEExplanation';
import QuickSummary from './pages/onboarding/QuickSummary';
import ChainSelection from './pages/onboarding/ChainSelection';
import EmailInput from './pages/onboarding/EmailInput';
import VaultNameInput from './pages/onboarding/VaultNameInput';

// TEE Wallet
import TEELogin from './pages/tee/TEELogin';
import TEESetup from './pages/tee/TEESetup';
import RecoverTEEWallet from './pages/tee/RecoverTEEWallet';

// Vault Creation
import CreatingVault from './pages/vault/CreatingVault';
import CreatingSeedlessVault from './pages/vault/CreatingSeedlessVault';
import VaultSuccess from './pages/vault/VaultSuccess';
import RecoverSeedlessVault from './pages/vault/RecoverSeedlessVault';

// Main App
import Home from './pages/Home';
import Send from './pages/Send';
import Swap from './pages/Swap';
import FundWallet from './pages/FundWallet';
import Lending from './pages/Lending';
import DarkPool from './pages/DarkPool';
import History from './pages/History';

// Agents
import AgentRouter from './pages/agents/AgentRouter';
import AgentSetup from './pages/agents/AgentSetup';
import AgentPreferences from './pages/agents/AgentPreferences';
import AgentCreating from './pages/agents/AgentCreating';
import AgentDashboard from './pages/agents/AgentDashboard';

// Settings / Backup / Recovery
import Backup from './pages/Backup';
import Recovery from './pages/Recovery';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
