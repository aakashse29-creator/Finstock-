import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { BottomNavigation } from './components/BottomNavigation';
import { ProfileView } from './components/ProfileView';
import { WatchlistView } from './components/WatchlistView';
import { OrdersView } from './components/OrdersView';
import { PortfolioView } from './components/PortfolioView';
import { ExploreView } from './components/ExploreView';
import { AdminPortalView } from './components/AdminPortalView';
import { ApiArchitectureModal } from './components/ApiArchitectureModal';
import { SimpleDashboardView } from './components/SimpleDashboardView';
import { ProTradingView } from './components/ProTradingView';
import { CommodityTradingView } from './components/CommodityTradingView';

// Modals
import { AccountDetailsModal } from './components/modals/AccountDetailsModal';
import { ChangeRequestsModal } from './components/modals/ChangeRequestsModal';
import { BankAccountsModal } from './components/modals/BankAccountsModal';
import { NomineeManagementModal } from './components/modals/NomineeManagementModal';
import { SegmentManagementModal } from './components/modals/SegmentManagementModal';
import { DdpiModal } from './components/modals/DdpiModal';
import { ReportsCentreModal } from './components/modals/ReportsCentreModal';
import { ChargesCalculatorModal } from './components/modals/ChargesCalculatorModal';
import { SupportHubModal } from './components/modals/SupportHubModal';
import { ReferralModal } from './components/modals/ReferralModal';
import { AppSettingsModal } from './components/modals/AppSettingsModal';
import { PrivacyDataModal } from './components/modals/PrivacyDataModal';
import { LegalComplianceModal } from './components/modals/LegalComplianceModal';
import { OrderSheetModal } from './components/modals/OrderSheetModal';
import { DiagnosticsModal } from './components/modals/DiagnosticsModal';
import { AddFundsModal } from './components/modals/AddFundsModal';
import { DownloadApkModal } from './components/modals/DownloadApkModal';

// Data & Types
import {
  initialUserProfile,
  initialBankAccounts,
  initialNominees,
  initialChangeRequests,
  initialContractNotes,
  initialLedgerEntries,
  initialHelpArticles,
  initialFaqs,
  initialSupportTickets,
  initialReferralData,
  initialUserSettings,
  initialPrivacyConsents,
  initialClosurePreChecks,
} from './data/mockData';
import {
  AppTab,
  BankAccount,
  Nominee,
  ProfileChangeRequest,
  SupportTicket,
  SegmentType,
  UserSettings,
  ExperienceMode,
  LedgerEntry,
} from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'mobile' | 'admin' | 'architecture'>('mobile');
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('simple');
  const [currentTab, setCurrentTab] = useState<AppTab>('watchlist');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showCommoditiesHub, setShowCommoditiesHub] = useState(false);

  // Core Financial States
  const [availableFunds, setAvailableFunds] = useState<number>(148720.5);
  const [portfolioValue, setPortfolioValue] = useState<number>(348200.0);
  const [investedValue, setInvestedValue] = useState<number>(295000.0);
  const [totalPnl, setTotalPnl] = useState<number>(53200.0);
  const [todayPnl, setTodayPnl] = useState<number>(4280.0);

  // Core Data States
  const [profile, setProfile] = useState(initialUserProfile);
  const [settings, setSettings] = useState<UserSettings>(initialUserSettings);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [nominees, setNominees] = useState<Nominee[]>(initialNominees);
  const [changeRequests, setChangeRequests] = useState<ProfileChangeRequest[]>(initialChangeRequests);
  const [contractNotes, setContractNotes] = useState(initialContractNotes);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [referralData, setReferralData] = useState(initialReferralData);
  const [privacyConsents, setPrivacyConsents] = useState(initialPrivacyConsents);
  const [closureChecks, setClosureChecks] = useState(initialClosurePreChecks);

  // Modals Visibility
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [changeRequestInitialType, setChangeRequestInitialType] = useState('MOBILE');
  const [selectedStockOrder, setSelectedStockOrder] = useState<{
    symbol: string;
    ltp: number;
    side?: 'BUY' | 'SELL';
  } | null>(null);

  // Handlers
  const handleOpenModal = (modalName: string, extra?: any) => {
    if (modalName === 'CHANGE_REQUESTS' && extra) {
      setChangeRequestInitialType(extra);
    }
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSetPrimaryBank = (id: string) => {
    setBankAccounts((prev) =>
      prev.map((b) => ({
        ...b,
        isPrimary: b.id === id,
      }))
    );
  };

  const handleAddBank = (newBank: Omit<BankAccount, 'id' | 'addedAt' | 'status'>) => {
    const acc: BankAccount = {
      ...newBank,
      id: `bank_${Date.now()}`,
      status: 'VERIFIED',
      addedAt: new Date().toISOString(),
    };
    setBankAccounts((prev) => [...prev, acc]);
  };

  const handleDeleteBank = (id: string) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const handleToggleSegment = (segment: SegmentType, activate: boolean) => {
    setProfile((prev) => {
      const current = prev.activeSegments;
      const updated = activate
        ? [...current, segment]
        : current.filter((s) => s !== segment);
      return { ...prev, activeSegments: updated };
    });
  };

  const handleSubmitChangeRequest = (
    req: Omit<ProfileChangeRequest, 'id' | 'submittedAt' | 'updatedAt' | 'status'>
  ) => {
    const newReq: ProfileChangeRequest = {
      ...req,
      id: `cr_${Date.now()}`,
      status: 'UNDER_REVIEW',
      makerId: 'admin_maker_01',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChangeRequests((prev) => [newReq, ...prev]);
  };

  const handleApproveChangeRequest = (id: string, checkerId: string) => {
    setChangeRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: 'APPROVED',
            checkerId,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    const target = changeRequests.find((r) => r.id === id);
    if (target) {
      if (target.type === 'MOBILE') {
        setProfile((prev) => ({ ...prev, mobile: target.newValue }));
      } else if (target.type === 'EMAIL') {
        setProfile((prev) => ({ ...prev, email: target.newValue }));
      } else if (target.type === 'INCOME_OCCUPATION') {
        setProfile((prev) => ({ ...prev, annualIncome: target.newValue }));
      }
    }
  };

  const handleRejectChangeRequest = (id: string, checkerId: string, reason: string) => {
    setChangeRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              checkerId,
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const handleCreateTicket = (
    newTicket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'slaDeadline'>
  ) => {
    const tkt: SupportTicket = {
      ...newTicket,
      id: `tkt_${Date.now()}`,
      ticketNumber: `FIN-TK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    };
    setTickets((prev) => [tkt, ...prev]);
  };

  const handleToggleConsent = (id: string, granted: boolean) => {
    setPrivacyConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, granted } : c))
    );
  };

  // Add Funds Handler
  const handleAddFundsSuccess = (amount: number, method: string, referenceId: string) => {
    setAvailableFunds((prev) => prev + amount);

    const newLedger: LedgerEntry = {
      id: `led_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      narration: `Funds Payin via ${method} (Ref: ${referenceId})`,
      voucherType: 'PAYIN',
      referenceId,
      debit: 0,
      credit: amount,
      runningBalance: availableFunds + amount,
    };

    setLedgerEntries((prev) => [newLedger, ...prev]);
  };

  // Order Placement Handler
  const handleOrderPlaced = (order: any) => {
    const grossVal = Math.round(order.price * order.quantity * 100) / 100;
    if (order.side === 'BUY') {
      setAvailableFunds((prev) => Math.max(0, prev - (order.requiredMargin || grossVal)));
      setPortfolioValue((prev) => prev + grossVal);
      setInvestedValue((prev) => prev + grossVal);
    } else {
      setAvailableFunds((prev) => prev + grossVal);
      setPortfolioValue((prev) => Math.max(0, prev - grossVal));
    }

    const tradeEntry: LedgerEntry = {
      id: `led_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      narration: `Trade Settlement: ${order.side} ${order.quantity} ${order.symbol} (${order.productType}) @ ${order.price}`,
      voucherType: 'TRADE',
      referenceId: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      debit: order.side === 'BUY' ? grossVal : 0,
      credit: order.side === 'SELL' ? grossVal : 0,
      runningBalance: availableFunds - (order.side === 'BUY' ? grossVal : -grossVal),
    };

    setLedgerEntries((prev) => [tradeEntry, ...prev]);
  };

  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0];

  return (
    <div
      className={`min-h-screen ${
        settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      } flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white`}
    >
      {/* Top Header with Simple vs Pro Switcher */}
      <TopHeader
        currentMode={currentMode}
        onModeChange={(m) => setCurrentMode(m)}
        experienceMode={experienceMode}
        onExperienceModeChange={(mode) => setExperienceMode(mode)}
        onOpenProfile={() => {
          setCurrentMode('mobile');
          setCurrentTab('profile');
        }}
        onOpenSearch={() => handleOpenModal('SEARCH')}
        onOpenNotifications={() =>
          alert(
            'Notifications: All daily contract notes digitally signed by eMudhra Class 3 DSC and dispatched.'
          )
        }
        onOpenDownloadApk={() => handleOpenModal('DOWNLOAD_APK')}
        userInitial="AS"
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-start">
        {currentMode === 'mobile' && (
          <div className="flex-1 w-full">
            {/* WATCHLIST / DASHBOARD TAB */}
            {currentTab === 'watchlist' && (
              <>
                {showCommoditiesHub ? (
                  <div className="space-y-3">
                    <div className="max-w-4xl mx-auto px-4 pt-3 flex items-center justify-between">
                      <button
                        onClick={() => setShowCommoditiesHub(false)}
                        className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        ← Back to Main Dashboard
                      </button>
                    </div>
                    <CommodityTradingView
                      onOpenOrderSheet={(symbol, ltp) =>
                        setSelectedStockOrder({ symbol, ltp, side: 'BUY' })
                      }
                      colorBlindMode={settings.colorBlindMode}
                    />
                  </div>
                ) : experienceMode === 'simple' ? (
                  <SimpleDashboardView
                    portfolioValue={portfolioValue}
                    investedValue={investedValue}
                    totalPnl={totalPnl}
                    todayPnl={todayPnl}
                    availableFunds={availableFunds}
                    onOpenAddFunds={() => handleOpenModal('ADD_FUNDS')}
                    onOpenWithdraw={() => handleOpenModal('REPORTS')}
                    onOpenOrderSheet={(symbol, ltp) =>
                      setSelectedStockOrder({ symbol, ltp, side: 'BUY' })
                    }
                    onOpenCommodities={() => setShowCommoditiesHub(true)}
                    onOpenExplore={() => setCurrentTab('explore')}
                    onOpenDownloadApk={() => handleOpenModal('DOWNLOAD_APK')}
                    colorBlindMode={settings.colorBlindMode}
                  />
                ) : (
                  <ProTradingView
                    onOpenOrderSheet={(symbol, ltp, side) =>
                      setSelectedStockOrder({ symbol, ltp, side: side || 'BUY' })
                    }
                    colorBlindMode={settings.colorBlindMode}
                  />
                )}
              </>
            )}

            {/* ORDERS TAB */}
            {currentTab === 'orders' && (
              <OrdersView
                onOpenCalculator={() => handleOpenModal('CALCULATOR')}
                onOpenOrderSheet={(symbol, ltp) =>
                  setSelectedStockOrder({ symbol, ltp, side: 'BUY' })
                }
              />
            )}

            {/* PORTFOLIO TAB */}
            {currentTab === 'portfolio' && (
              <PortfolioView
                privacyMode={privacyMode}
                onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
                onOpenReports={() => handleOpenModal('REPORTS')}
              />
            )}

            {/* EXPLORE TAB */}
            {currentTab === 'explore' && (
              <ExploreView
                onOpenCalculator={() => handleOpenModal('CALCULATOR')}
                onOpenModal={handleOpenModal}
              />
            )}

            {/* PROFILE TAB */}
            {currentTab === 'profile' && (
              <ProfileView
                profile={profile}
                settings={settings}
                bankAccounts={bankAccounts}
                nominees={nominees}
                changeRequests={changeRequests}
                contractNotes={contractNotes}
                ledgerEntries={ledgerEntries}
                helpArticles={initialHelpArticles}
                faqs={initialFaqs}
                tickets={tickets}
                referralData={referralData}
                privacyConsents={privacyConsents}
                closureChecks={closureChecks}
                onOpenModal={handleOpenModal}
                onLogout={() =>
                  alert('Logged out safely. Encrypted credentials cleared from secure storage.')
                }
                privacyMode={privacyMode}
                onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
                onOpenDownloadApk={() => handleOpenModal('DOWNLOAD_APK')}
              />
            )}
          </div>
        )}

        {currentMode === 'admin' && (
          <AdminPortalView
            changeRequests={changeRequests}
            onApproveChangeRequest={handleApproveChangeRequest}
            onRejectChangeRequest={handleRejectChangeRequest}
            tickets={tickets}
          />
        )}

        {currentMode === 'architecture' && <ApiArchitectureModal />}
      </main>

      {/* Bottom Navigation (Active in Mobile App Mode) */}
      {currentMode === 'mobile' && (
        <BottomNavigation
          currentTab={currentTab}
          onTabChange={(tab) => {
            setShowCommoditiesHub(false);
            setCurrentTab(tab);
          }}
          language={settings.language}
        />
      )}

      {/* MODALS */}
      <DownloadApkModal
        isOpen={activeModal === 'DOWNLOAD_APK'}
        onClose={handleCloseModal}
      />

      <AddFundsModal
        isOpen={activeModal === 'ADD_FUNDS'}
        onClose={handleCloseModal}
        primaryBank={primaryBank}
        availableFunds={availableFunds}
        onAddFundsSuccess={handleAddFundsSuccess}
      />

      <AccountDetailsModal
        isOpen={activeModal === 'ACCOUNT_DETAILS'}
        onClose={handleCloseModal}
        profile={profile}
        onRequestChange={(type) => {
          handleCloseModal();
          handleOpenModal('CHANGE_REQUESTS', type);
        }}
      />

      <ChangeRequestsModal
        isOpen={activeModal === 'CHANGE_REQUESTS'}
        onClose={handleCloseModal}
        initialType={changeRequestInitialType}
        changeRequests={changeRequests}
        onSubmitRequest={handleSubmitChangeRequest}
      />

      <BankAccountsModal
        isOpen={activeModal === 'BANK_ACCOUNTS'}
        onClose={handleCloseModal}
        bankAccounts={bankAccounts}
        onSetPrimary={handleSetPrimaryBank}
        onAddAccount={handleAddBank}
        onDeleteAccount={handleDeleteBank}
      />

      <NomineeManagementModal
        isOpen={activeModal === 'NOMINEES'}
        onClose={handleCloseModal}
        nominees={nominees}
        onUpdateNominees={(updated) => setNominees(updated)}
      />

      <SegmentManagementModal
        isOpen={activeModal === 'SEGMENTS'}
        onClose={handleCloseModal}
        activeSegments={profile.activeSegments}
        onToggleSegment={handleToggleSegment}
      />

      <DdpiModal
        isOpen={activeModal === 'DDPI'}
        onClose={handleCloseModal}
        isDdpiActive={true}
        onToggleDdpi={(active) => {}}
      />

      <ReportsCentreModal
        isOpen={activeModal === 'REPORTS'}
        onClose={handleCloseModal}
        profile={profile}
        contractNotes={contractNotes}
        ledgerEntries={ledgerEntries}
      />

      <ChargesCalculatorModal
        isOpen={activeModal === 'CALCULATOR'}
        onClose={handleCloseModal}
      />

      <SupportHubModal
        isOpen={activeModal === 'SUPPORT'}
        onClose={handleCloseModal}
        articles={initialHelpArticles}
        faqs={initialFaqs}
        tickets={tickets}
        onCreateTicket={handleCreateTicket}
      />

      <ReferralModal
        isOpen={activeModal === 'REFERRAL'}
        onClose={handleCloseModal}
        referralData={referralData}
      />

      <AppSettingsModal
        isOpen={activeModal === 'SETTINGS'}
        onClose={handleCloseModal}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        onOpenDiagnostics={() => handleOpenModal('DIAGNOSTICS')}
      />

      <DiagnosticsModal
        isOpen={activeModal === 'DIAGNOSTICS'}
        onClose={handleCloseModal}
      />

      <PrivacyDataModal
        isOpen={activeModal === 'PRIVACY_DATA'}
        onClose={handleCloseModal}
        consents={privacyConsents}
        onToggleConsent={handleToggleConsent}
        closureChecks={closureChecks}
      />

      <LegalComplianceModal
        isOpen={activeModal === 'LEGAL'}
        onClose={handleCloseModal}
      />

      {selectedStockOrder && (
        <OrderSheetModal
          isOpen={Boolean(selectedStockOrder)}
          onClose={() => setSelectedStockOrder(null)}
          symbol={selectedStockOrder.symbol}
          initialPrice={selectedStockOrder.ltp}
          initialSide={selectedStockOrder.side || 'BUY'}
          onOpenCalculator={() => {
            setSelectedStockOrder(null);
            handleOpenModal('CALCULATOR');
          }}
          onOrderPlaced={handleOrderPlaced}
        />
      )}
    </div>
  );
}
