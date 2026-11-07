import { AppLanguage } from '../types';

export interface Translations {
  appName: string;
  tabs: {
    watchlist: string;
    orders: string;
    portfolio: string;
    explore: string;
    profile: string;
  };
  profile: {
    title: string;
    ucc: string;
    copy: string;
    copied: string;
    accountStatus: string;
    active: string;
    completeness: string;
    viewDetails: string;
    accountPersonal: string;
    accountPersonalDesc: string;
    bankAccounts: string;
    bankAccountsDesc: string;
    nominees: string;
    nomineesDesc: string;
    segments: string;
    segmentsDesc: string;
    ddpi: string;
    ddpiDesc: string;
    reportsCentre: string;
    reportsCentreDesc: string;
    brokerageCalculator: string;
    brokerageCalculatorDesc: string;
    supportHelp: string;
    supportHelpDesc: string;
    referral: string;
    referralDesc: string;
    appSettings: string;
    appSettingsDesc: string;
    privacyData: string;
    privacyDataDesc: string;
    legalCompliance: string;
    legalComplianceDesc: string;
    logout: string;
    logoutConfirm: string;
  };
  reports: {
    title: string;
    contractNotes: string;
    ledger: string;
    pnl: string;
    tradebook: string;
    holdingsStatement: string;
    taxPackage: string;
    downloadPdf: string;
    downloadCsv: string;
    sendEmail: string;
    emailSent: string;
    passwordNotice: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    delivery: string;
    intraday: string;
    futures: string;
    options: string;
    buyPrice: string;
    sellPrice: string;
    quantity: string;
    turnover: string;
    brokerage: string;
    stt: string;
    exchangeCharges: string;
    sebiCharges: string;
    gst: string;
    stampDuty: string;
    dpCharges: string;
    totalCharges: string;
    netPnl: string;
    breakEven: string;
  };
  support: {
    title: string;
    searchPlaceholder: string;
    liveChat: string;
    raiseTicket: string;
    callback: string;
    grievance: string;
    faq: string;
    verifiedSender: string;
    verifyContact: string;
  };
  common: {
    close: string;
    cancel: string;
    save: string;
    submit: string;
    confirm: string;
    search: string;
    status: string;
    back: string;
    verify: string;
    verified: string;
    pending: string;
    review: string;
    disclaimer: string;
  };
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    appName: 'Finstock Broking',
    tabs: {
      watchlist: 'Watchlist',
      orders: 'Orders',
      portfolio: 'Portfolio',
      explore: 'Explore',
      profile: 'Profile',
    },
    profile: {
      title: 'Profile & Account',
      ucc: 'Client ID (UCC)',
      copy: 'Copy',
      copied: 'Copied!',
      accountStatus: 'Account Status',
      active: 'Active & Verified',
      completeness: 'Profile Completeness',
      viewDetails: 'View Profile',
      accountPersonal: 'Account & Personal Details',
      accountPersonalDesc: 'PAN, Aadhaar, address and KYC records',
      bankAccounts: 'Bank Accounts',
      bankAccountsDesc: 'Manage linked bank accounts & payout mandates',
      nominees: 'Nominee Management',
      nomineesDesc: 'Add or modify up to 3 legal nominees',
      segments: 'Segment Management',
      segmentsDesc: 'Equity, F&O, Currency and Commodity trading',
      ddpi: 'DDPI & Demat Authorisation',
      ddpiDesc: 'Digital delivery instruction slip without TPIN',
      reportsCentre: 'Reports Centre',
      reportsCentreDesc: 'Contract notes, Ledger, Tax P&L & DP statements',
      brokerageCalculator: 'Brokerage & Charges Calculator',
      brokerageCalculatorDesc: 'Transparent statutory fees & break-even estimator',
      supportHelp: 'Help & Customer Support',
      supportHelpDesc: 'Help articles, Live chat, Tickets & Grievance SCORES',
      referral: 'Referral Program',
      referralDesc: 'Invite friends and earn ₹500 brokerage cashback',
      appSettings: 'App Settings & Security',
      appSettingsDesc: 'Theme, MPIN, Biometrics, Languages & Preferences',
      privacyData: 'Privacy & Data Protection (DPDP)',
      privacyDataDesc: 'Consents, Download my data & Guided account closure',
      legalCompliance: 'Legal & Regulatory Compliance',
      legalComplianceDesc: 'SEBI registration, policies, DP details & risks',
      logout: 'Log Out',
      logoutConfirm: 'Are you sure you want to log out of Finstock?',
    },
    reports: {
      title: 'Reports & Statements',
      contractNotes: 'Daily Contract Notes',
      ledger: 'Ledger Statement',
      pnl: 'P&L Statement',
      tradebook: 'Trade Book (5 Years)',
      holdingsStatement: 'Demat Holdings Statement',
      taxPackage: 'Tax P&L Package (ZIP)',
      downloadPdf: 'Download PDF',
      downloadCsv: 'Download CSV',
      sendEmail: 'Send to Registered Email',
      emailSent: 'Report dispatched to your registered email address.',
      passwordNotice: 'PDF Password: Your PAN in uppercase followed by DOB as DDMMYYYY (e.g. ABCDE1234F15081995)',
    },
    calculator: {
      title: 'Brokerage & Charges Calculator',
      subtitle: 'Accurate SEBI, Exchange, STT, Stamp Duty, GST & DP charges',
      delivery: 'Equity Delivery',
      intraday: 'Equity Intraday',
      futures: 'Futures',
      options: 'Options',
      buyPrice: 'Buy Price (₹)',
      sellPrice: 'Sell Price (₹)',
      quantity: 'Quantity / Lots',
      turnover: 'Total Turnover',
      brokerage: 'Brokerage',
      stt: 'Securities Transaction Tax (STT)',
      exchangeCharges: 'Exchange Transaction Fees',
      sebiCharges: 'SEBI Turnover Fees',
      gst: 'GST (18%)',
      stampDuty: 'Stamp Duty',
      dpCharges: 'DP Charges (CDSL)',
      totalCharges: 'Total Statutory & Brokerage Charges',
      netPnl: 'Net P&L',
      breakEven: 'Points to Break-Even',
    },
    support: {
      title: 'Support & Help Centre',
      searchPlaceholder: 'Search articles, FAQs, topics...',
      liveChat: 'Live Chat with Agent',
      raiseTicket: 'Raise Support Ticket',
      callback: 'Request a Call-Back',
      grievance: 'Grievance & SCORES Portal',
      faq: 'Frequently Asked Questions',
      verifiedSender: 'Official Sender Verification',
      verifyContact: 'Verify Sender ID / Phone Number',
    },
    common: {
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save Changes',
      submit: 'Submit Request',
      confirm: 'Confirm',
      search: 'Search',
      status: 'Status',
      back: 'Back',
      verify: 'Verify',
      verified: 'Verified',
      pending: 'Pending',
      review: 'Under Review',
      disclaimer: 'Investments in securities market are subject to market risks, read all scheme related documents carefully.',
    },
  },
  hi: {
    appName: 'फिनस्टॉक ब्रोकिंग',
    tabs: {
      watchlist: 'वॉचलिस्ट',
      orders: 'ऑर्डर्स',
      portfolio: 'पोर्टफोलियो',
      explore: 'एक्सप्लोर',
      profile: 'प्रोफाइल',
    },
    profile: {
      title: 'प्रोफाइल और खाता',
      ucc: 'क्लाइंट आईडी (UCC)',
      copy: 'कॉपी करें',
      copied: 'कॉपी हो गया!',
      accountStatus: 'खाता स्थिति',
      active: 'सक्रिय एवं सत्यापित',
      completeness: 'प्रोफाइल पूर्णता',
      viewDetails: 'प्रोफाइल देखें',
      accountPersonal: 'खाता और व्यक्तिगत विवरण',
      accountPersonalDesc: 'पैन, आधार, पता और केवाईसी दस्तावेज',
      bankAccounts: 'बैंक खाते',
      bankAccountsDesc: 'लिंक किए गए बैंक खाते और पे-आउट प्रबंधित करें',
      nominees: 'नॉमिनी प्रबंधन',
      nomineesDesc: 'अधिकतम 3 कानूनी नॉमिनी जोड़ें या बदलें',
      segments: 'सेगमेंट प्रबंधन',
      segmentsDesc: 'इक्विटी, एफ एंड ओ, करेंसी और कमोडिटी ट्रेडिंग',
      ddpi: 'डीडीपीआई और डीमैट प्राधिकरण',
      ddpiDesc: 'बिना टीपिन त्वरित डिलीवरी डेबिट',
      reportsCentre: 'रिपोर्ट्स केंद्र',
      reportsCentreDesc: 'कॉन्ट्रैक्ट नोट्स, लेजर, टैक्स पीएंडएल और डीमैट विवरण',
      brokerageCalculator: 'ब्रोकरेज और शुल्क कैलकुलेटर',
      brokerageCalculatorDesc: 'पारदर्शी विनियामक शुल्क और ब्रेक-ईवन अनुमान',
      supportHelp: 'सहायता और कस्टमर सपोर्ट',
      supportHelpDesc: 'सहायता लेख, लाइव चैट, टिकट और स्कोर्स शिकायत',
      referral: 'रेफरल कार्यक्रम',
      referralDesc: 'दोस्तों को आमंत्रित करें और ₹500 ब्रोकरेज कैशबैक पाएं',
      appSettings: 'ऐप सेटिंग्स और सुरक्षा',
      appSettingsDesc: 'थीम, एमपिन, बायोमेट्रिक, भाषाएं और प्राथमिकताएं',
      privacyData: 'डेटा गोपनीयता (DPDP)',
      privacyDataDesc: 'सहमति, मेरा डेटा डाउनलोड करें और खाता बंद करें',
      legalCompliance: 'कानूनी और सेबी अनुपालन',
      legalComplianceDesc: 'सेबी पंजीकरण, नीतियां, डीपी विवरण और जोखिम प्रकटीकरण',
      logout: 'लॉग आउट',
      logoutConfirm: 'क्या आप निश्चित रूप से फिनस्टॉक से लॉग आउट करना चाहते हैं?',
    },
    reports: {
      title: 'रिपोर्ट्स और विवरण',
      contractNotes: 'दैनिक कॉन्ट्रैक्ट नोट्स',
      ledger: 'लेजर विवरण',
      pnl: 'पीएंडएल विवरण',
      tradebook: 'ट्रेड बुक (5 वर्ष)',
      holdingsStatement: 'डीमैट होल्डिंग्स विवरण',
      taxPackage: 'टैक्स पीएंडएल पैकेज (ZIP)',
      downloadPdf: 'पीडीएफ डाउनलोड करें',
      downloadCsv: 'सीएसवी डाउनलोड करें',
      sendEmail: 'पंजीकृत ईमेल पर भेजें',
      emailSent: 'रिपोर्ट आपके पंजीकृत ईमेल पते पर भेज दी गई है।',
      passwordNotice: 'पीडीएफ पासवर्ड: आपका पैन बड़े अक्षरों में और जन्मतिथि DDMMYYYY रूप में (उदा. ABCDE1234F15081995)',
    },
    calculator: {
      title: 'ब्रोकरेज और शुल्क कैलकुलेटर',
      subtitle: 'सटीक सेबी, एक्सचेंज, एसटीटी, स्टाम्प ड्यूटी, जीएसटी और डीपी शुल्क',
      delivery: 'इक्विटी डिलीवरी',
      intraday: 'इक्विटी इंट्राडे',
      futures: 'फ्यूचर्स',
      options: 'ऑप्शंस',
      buyPrice: 'खरीद मूल्य (₹)',
      sellPrice: 'बिक्री मूल्य (₹)',
      quantity: 'मात्रा / लॉट्स',
      turnover: 'कुल टर्नओवर',
      brokerage: 'ब्रोकरेज',
      stt: 'सिक्योरिटीज ट्रांजैक्शन टैक्स (STT)',
      exchangeCharges: 'एक्सचेंज लेनदेन शुल्क',
      sebiCharges: 'सेबी टर्नओवर शुल्क',
      gst: 'जीएसटी (18%)',
      stampDuty: 'स्टाम्प ड्यूटी',
      dpCharges: 'डीपी शुल्क (CDSL)',
      totalCharges: 'कुल विनियामक और ब्रोकरेज शुल्क',
      netPnl: 'शुद्ध लाभ / हानि (Net P&L)',
      breakEven: 'ब्रेक-ईवन पॉइंट्स',
    },
    support: {
      title: 'सपोर्ट और सहायता केंद्र',
      searchPlaceholder: 'लेख, प्रश्नोत्तर खोजें...',
      liveChat: 'एजेंट के साथ लाइव चैट',
      raiseTicket: 'सपोर्ट टिकट बनाएं',
      callback: 'कॉल-बैक का अनुरोध करें',
      grievance: 'शिकायत निवारण एवं सेबी स्कोर्स',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      verifiedSender: 'आधिकारिक प्रेषक सत्यापन',
      verifyContact: 'सेंडर आईडी या फोन नंबर सत्यापित करें',
    },
    common: {
      close: 'बंद करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      submit: 'अनुरोध भेजें',
      confirm: 'पुष्टि करें',
      search: 'खोजें',
      status: 'स्थिति',
      back: 'वापस',
      verify: 'सत्यापित करें',
      verified: 'सत्यापित',
      pending: 'लंबित',
      review: 'समीक्षाधीन',
      disclaimer: 'प्रतिभूति बाजार में निवेश बाजार के जोखिमों के अधीन है, संबंधित सभी दस्तावेज ध्यानपूर्वक पढ़ें।',
    },
  },
  mr: generateRegionalTranslation('मराठी', 'Finstock Broking'),
  gu: generateRegionalTranslation('ગુજરાતી', 'Finstock Broking'),
  ta: generateRegionalTranslation('தமிழ்', 'Finstock Broking'),
  te: generateRegionalTranslation('తెలుగు', 'Finstock Broking'),
  kn: generateRegionalTranslation('ಕನ್ನಡ', 'Finstock Broking'),
  bn: generateRegionalTranslation('বাংলা', 'Finstock Broking'),
};

function generateRegionalTranslation(langName: string, brand: string): Translations {
  return {
    appName: brand,
    tabs: {
      watchlist: 'Watchlist',
      orders: 'Orders',
      portfolio: 'Portfolio',
      explore: 'Explore',
      profile: 'Profile',
    },
    profile: {
      title: `Profile & Account (${langName})`,
      ucc: 'Client ID (UCC)',
      copy: 'Copy',
      copied: 'Copied!',
      accountStatus: 'Account Status',
      active: 'Active',
      completeness: 'Profile Completeness',
      viewDetails: 'View Details',
      accountPersonal: 'Account & Personal Details',
      accountPersonalDesc: 'PAN, Aadhaar & KYC',
      bankAccounts: 'Bank Accounts',
      bankAccountsDesc: 'Linked bank accounts',
      nominees: 'Nominee Management',
      nomineesDesc: 'Manage legal nominees',
      segments: 'Segment Management',
      segmentsDesc: 'Equity, F&O, Currency, Commodity',
      ddpi: 'DDPI & Demat Authorisation',
      ddpiDesc: 'Instant demat debit',
      reportsCentre: 'Reports Centre',
      reportsCentreDesc: 'Contract notes & Tax P&L',
      brokerageCalculator: 'Brokerage & Charges Calculator',
      brokerageCalculatorDesc: 'Statutory fees & break-even',
      supportHelp: 'Help & Customer Support',
      supportHelpDesc: 'Help articles & Live chat',
      referral: 'Referral Program',
      referralDesc: 'Invite friends & earn cashback',
      appSettings: 'App Settings & Security',
      appSettingsDesc: 'Theme, MPIN & Preferences',
      privacyData: 'Privacy & Data Protection (DPDP)',
      privacyDataDesc: 'Consents & Account closure',
      legalCompliance: 'Legal & Compliance',
      legalComplianceDesc: 'SEBI registration & policies',
      logout: 'Log Out',
      logoutConfirm: 'Confirm logout from Finstock?',
    },
    reports: {
      title: 'Reports & Statements',
      contractNotes: 'Daily Contract Notes',
      ledger: 'Ledger Statement',
      pnl: 'P&L Statement',
      tradebook: 'Trade Book',
      holdingsStatement: 'Demat Statement',
      taxPackage: 'Tax Package (ZIP)',
      downloadPdf: 'Download PDF',
      downloadCsv: 'Download CSV',
      sendEmail: 'Send to Email',
      emailSent: 'Dispatched to registered email.',
      passwordNotice: 'PDF Password: PAN in capitals + DOB as DDMMYYYY',
    },
    calculator: {
      title: 'Brokerage Calculator',
      subtitle: 'SEBI, Exchange, STT & GST charges',
      delivery: 'Equity Delivery',
      intraday: 'Equity Intraday',
      futures: 'Futures',
      options: 'Options',
      buyPrice: 'Buy Price (₹)',
      sellPrice: 'Sell Price (₹)',
      quantity: 'Quantity / Lots',
      turnover: 'Total Turnover',
      brokerage: 'Brokerage',
      stt: 'STT',
      exchangeCharges: 'Exchange Fees',
      sebiCharges: 'SEBI Fees',
      gst: 'GST (18%)',
      stampDuty: 'Stamp Duty',
      dpCharges: 'DP Charges',
      totalCharges: 'Total Charges',
      netPnl: 'Net P&L',
      breakEven: 'Points to Break-Even',
    },
    support: {
      title: 'Support Hub',
      searchPlaceholder: 'Search articles & FAQs...',
      liveChat: 'Live Chat with Agent',
      raiseTicket: 'Raise Ticket',
      callback: 'Request Callback',
      grievance: 'Grievance & SCORES',
      faq: 'FAQs',
      verifiedSender: 'Official Sender Check',
      verifyContact: 'Verify Sender ID',
    },
    common: {
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      confirm: 'Confirm',
      search: 'Search',
      status: 'Status',
      back: 'Back',
      verify: 'Verify',
      verified: 'Verified',
      pending: 'Pending',
      review: 'Under Review',
      disclaimer: 'Investments in securities market are subject to market risks, read all scheme related documents carefully.',
    },
  };
}
