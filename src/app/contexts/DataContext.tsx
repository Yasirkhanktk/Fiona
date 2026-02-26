import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Company {
  id: string;
  name: string;
  type: 'funder' | 'originator' | 'supervisor';
  status: 'active' | 'inactive';
  createdAt: string;
  contactEmail: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'originator' | 'supervisor' | 'funder';
  companyId: string;
  companyName: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

export interface Environment {
  id: string;
  name: string;
  originatorId: string;
  originatorName: string;
  funderId: string;
  funderName: string;
  supervisorId: string;
  supervisorName: string;
  approvalAuthority: 'funder' | 'supervisor';
  status: 'active' | 'inactive';
  createdAt: string;
  documentTypes: DocumentType[];
  dealTerms: {
    approvalLogic: string;
    maxLoanAmount?: number;
    minLoanAmount?: number;
  };
}

export interface DocumentReview {
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'supervisor' | 'funder';
  status: 'approved' | 'rejected';
  comment: string;
  reviewedAt: string;
}

export interface UploadedDocument {
  id: string;
  documentTypeId: string;
  documentTypeName: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
  reviews?: DocumentReview[];
}

export interface ReviewComment {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'supervisor' | 'funder';
  comment: string;
  createdAt: string;
  action: 'approved' | 'rejected' | 'requested_changes';
}

export interface LoanRequest {
  id: string;
  creditId: string;
  environmentId: string;
  environmentName: string;
  originatorId: string;
  originatorName: string;
  borrowerName: string;
  amount: number;
  currency: string;
  maturityDate: string;
  interestRate: number;
  purpose: string;
  status: 'draft' | 'submitted' | 'under_review_supervisor' | 'under_review_funder' | 'approved' | 'rejected' | 'disbursed';
  submittedAt?: string;
  documents: UploadedDocument[];
  reviews: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  loanRequestId: string;
  creditId: string;
  environmentId: string;
  originatorId: string;
  originatorName: string;
  funderId: string;
  funderName: string;
  borrowerName: string;
  amount: number;
  currency: string;
  maturityDate: string;
  interestRate: number;
  status: 'active' | 'overdue' | 'repaid';
  disbursedAt: string;
  outstandingBalance: number;
}

interface DataContextType {
  companies: Company[];
  users: AppUser[];
  environments: Environment[];
  loanRequests: LoanRequest[];
  loans: Loan[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  addUser: (user: Omit<AppUser, 'id'>) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  addEnvironment: (env: Omit<Environment, 'id' | 'createdAt'>) => void;
  updateEnvironment: (id: string, updates: Partial<Environment>) => void;
  addDocumentTypeToEnvironment: (envId: string, docType: Omit<DocumentType, 'id'>) => void;
  removeDocumentTypeFromEnvironment: (envId: string, docTypeId: string) => void;
  addLoanRequest: (request: Omit<LoanRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLoanRequest: (id: string, updates: Partial<LoanRequest>) => void;
  addReviewToLoanRequest: (requestId: string, review: Omit<ReviewComment, 'id' | 'createdAt'>) => void;
  addDocumentReview: (requestId: string, documentId: string, review: Omit<DocumentReview, 'reviewedAt'>) => void;
  addLoan: (loan: Omit<Loan, 'id' | 'disbursedAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialCompanies: Company[] = [
  {
    id: 'c1',
    name: 'Global Capital Fund',
    type: 'funder',
    status: 'active',
    createdAt: '2024-01-15',
    contactEmail: 'contact@globalcapital.com',
  },
  {
    id: 'c2',
    name: 'Premier Lending Inc',
    type: 'originator',
    status: 'active',
    createdAt: '2024-01-20',
    contactEmail: 'info@premierlending.com',
  },
  {
    id: 'c3',
    name: 'Trust Validation Services',
    type: 'supervisor',
    status: 'active',
    createdAt: '2024-01-25',
    contactEmail: 'support@trustvalidation.com',
  },
  {
    id: 'c4',
    name: 'Apex Financial Group',
    type: 'funder',
    status: 'active',
    createdAt: '2024-01-18',
    contactEmail: 'invest@apexfinancial.com',
  },
  {
    id: 'c5',
    name: 'Velocity Lending Solutions',
    type: 'originator',
    status: 'active',
    createdAt: '2024-01-22',
    contactEmail: 'loans@velocitylending.com',
  },
  {
    id: 'c6',
    name: 'Integrity Audit Partners',
    type: 'supervisor',
    status: 'active',
    createdAt: '2024-01-28',
    contactEmail: 'audit@integritypartners.com',
  },
];

const initialUsers: AppUser[] = [
  {
    id: 'u1',
    name: 'John Originator',
    email: 'john@premierlending.com',
    role: 'originator',
    companyId: 'c2',
    companyName: 'Premier Lending Inc',
    status: 'active',
    permissions: ['create_loan_request', 'view_portfolio'],
  },
  {
    id: 'u2',
    name: 'Sarah Supervisor',
    email: 'sarah@trustvalidation.com',
    role: 'supervisor',
    companyId: 'c3',
    companyName: 'Trust Validation Services',
    status: 'active',
    permissions: ['review_loan_request', 'view_portfolio'],
  },
  {
    id: 'u3',
    name: 'Michael Funder',
    email: 'michael@globalcapital.com',
    role: 'funder',
    companyId: 'c1',
    companyName: 'Global Capital Fund',
    status: 'active',
    permissions: ['approve_loan_request', 'view_portfolio'],
  },
];

const initialEnvironments: Environment[] = [
  {
    id: 'e1',
    name: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    funderId: 'c1',
    funderName: 'Global Capital Fund',
    supervisorId: 'c3',
    supervisorName: 'Trust Validation Services',
    approvalAuthority: 'supervisor',
    status: 'active',
    createdAt: '2024-02-01',
    documentTypes: [
      {
        id: 'dt1',
        name: 'Business Registration Certificate',
        description: 'Valid business registration document',
        required: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
      },
      {
        id: 'dt2',
        name: 'Financial Statements',
        description: 'Last 2 years audited financial statements',
        required: true,
        acceptedFormats: ['PDF', 'XLSX'],
      },
      {
        id: 'dt3',
        name: 'Credit Report',
        description: 'Recent credit bureau report',
        required: true,
        acceptedFormats: ['PDF'],
      },
      {
        id: 'dt4',
        name: 'Business Plan',
        description: 'Detailed business plan',
        required: false,
        acceptedFormats: ['PDF', 'DOCX'],
      },
      {
        id: 'dt5',
        name: 'Collateral Documentation',
        description: 'Proof of collateral ownership',
        required: false,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
      },
    ],
    dealTerms: {
      approvalLogic: 'Supervisor validates all documentation and credit worthiness. Funder retains final approval for amounts > $100K',
      maxLoanAmount: 500000,
      minLoanAmount: 10000,
    },
  },
  {
    id: 'e2',
    name: 'Apex-Velocity Corporate Lending',
    originatorId: 'c5',
    originatorName: 'Velocity Lending Solutions',
    funderId: 'c4',
    funderName: 'Apex Financial Group',
    supervisorId: 'c6',
    supervisorName: 'Integrity Audit Partners',
    approvalAuthority: 'funder',
    status: 'active',
    createdAt: '2024-02-05',
    documentTypes: [
      {
        id: 'dt2e1',
        name: 'Corporate Registration',
        description: 'Valid corporate registration certificate',
        required: true,
        acceptedFormats: ['PDF'],
      },
      {
        id: 'dt2e2',
        name: 'Audited Financials',
        description: 'Last 3 years audited financial statements',
        required: true,
        acceptedFormats: ['PDF', 'XLSX'],
      },
      {
        id: 'dt2e3',
        name: 'Tax Returns',
        description: 'Corporate tax returns for last 2 years',
        required: true,
        acceptedFormats: ['PDF'],
      },
      {
        id: 'dt2e4',
        name: 'Board Resolution',
        description: 'Board approval for loan application',
        required: true,
        acceptedFormats: ['PDF'],
      },
    ],
    dealTerms: {
      approvalLogic: 'Funder has final approval authority. Supervisor reviews compliance and documentation.',
      maxLoanAmount: 1000000,
      minLoanAmount: 50000,
    },
  },
  {
    id: 'e3',
    name: 'Global-Premier Micro Finance',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    funderId: 'c1',
    funderName: 'Global Capital Fund',
    supervisorId: 'c3',
    supervisorName: 'Trust Validation Services',
    approvalAuthority: 'supervisor',
    status: 'active',
    createdAt: '2024-02-10',
    documentTypes: [
      {
        id: 'dt3e1',
        name: 'ID Verification',
        description: 'Government-issued ID',
        required: true,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
      },
      {
        id: 'dt3e2',
        name: 'Bank Statements',
        description: 'Last 6 months bank statements',
        required: true,
        acceptedFormats: ['PDF'],
      },
      {
        id: 'dt3e3',
        name: 'Income Proof',
        description: 'Proof of income or business revenue',
        required: true,
        acceptedFormats: ['PDF', 'JPG'],
      },
    ],
    dealTerms: {
      approvalLogic: 'Fast-track approval for amounts under $25K with complete documentation.',
      maxLoanAmount: 25000,
      minLoanAmount: 1000,
    },
  },
];

const initialLoanRequests: LoanRequest[] = [
  {
    id: 'lr1',
    creditId: 'CR-2024-001',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'ABC Manufacturing Ltd',
    amount: 150000,
    currency: 'USD',
    maturityDate: '2025-06-23',
    interestRate: 8.5,
    purpose: 'Working capital for inventory expansion',
    status: 'under_review_supervisor',
    submittedAt: '2024-02-20T10:30:00Z',
    documents: [
      {
        id: 'doc1',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'abc_manufacturing_registration.pdf',
        fileSize: 245000,
        uploadedAt: '2024-02-20T10:15:00Z',
        fileUrl: '/mock/documents/registration.pdf',
        reviews: [],
      },
      {
        id: 'doc2',
        documentTypeId: 'dt2',
        documentTypeName: 'Financial Statements',
        fileName: 'financial_statements_2022_2023.pdf',
        fileSize: 1250000,
        uploadedAt: '2024-02-20T10:20:00Z',
        fileUrl: '/mock/documents/financials.pdf',
        reviews: [],
      },
      {
        id: 'doc3',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'credit_bureau_report_feb_2024.pdf',
        fileSize: 180000,
        uploadedAt: '2024-02-20T10:25:00Z',
        fileUrl: '/mock/documents/credit.pdf',
        reviews: [],
      },
    ],
    reviews: [],
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'lr2',
    creditId: 'CR-2024-002',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'XYZ Trading Co',
    amount: 75000,
    currency: 'USD',
    maturityDate: '2025-03-15',
    interestRate: 9.0,
    purpose: 'Equipment purchase',
    status: 'approved',
    submittedAt: '2024-02-18T14:20:00Z',
    documents: [
      {
        id: 'doc4',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'xyz_trading_registration.pdf',
        fileSize: 220000,
        uploadedAt: '2024-02-18T14:00:00Z',
        fileUrl: '/mock/documents/xyz_registration.pdf',
        reviews: [],
      },
      {
        id: 'doc5',
        documentTypeId: 'dt2',
        documentTypeName: 'Financial Statements',
        fileName: 'xyz_financials_2023.pdf',
        fileSize: 980000,
        uploadedAt: '2024-02-18T14:05:00Z',
        fileUrl: '/mock/documents/xyz_financials.pdf',
        reviews: [],
      },
      {
        id: 'doc6',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'xyz_credit_report.pdf',
        fileSize: 195000,
        uploadedAt: '2024-02-18T14:10:00Z',
        fileUrl: '/mock/documents/xyz_credit.pdf',
        reviews: [],
      },
    ],
    reviews: [
      {
        id: 'rev1',
        reviewerId: 'u2',
        reviewerName: 'Sarah Supervisor',
        reviewerRole: 'supervisor',
        comment: 'All documentation verified. Credit score is excellent. Business fundamentals are strong. Recommended for approval.',
        createdAt: '2024-02-19T11:00:00Z',
        action: 'approved',
      },
      {
        id: 'rev2',
        reviewerId: 'u3',
        reviewerName: 'Michael Funder',
        reviewerRole: 'funder',
        comment: 'Approved based on supervisor recommendation and strong financial position.',
        createdAt: '2024-02-19T15:30:00Z',
        action: 'approved',
      },
    ],
    createdAt: '2024-02-18T13:00:00Z',
    updatedAt: '2024-02-19T15:30:00Z',
  },
  {
    id: 'lr3',
    creditId: 'CR-2024-003',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'Tech Innovations Inc',
    amount: 50000,
    currency: 'USD',
    maturityDate: '2025-04-30',
    interestRate: 8.75,
    purpose: 'Marketing and expansion',
    status: 'rejected',
    submittedAt: '2024-02-15T09:00:00Z',
    documents: [
      {
        id: 'doc7',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'tech_innovations_registration.pdf',
        fileSize: 210000,
        uploadedAt: '2024-02-15T08:45:00Z',
        fileUrl: '/mock/documents/tech_registration.pdf',
        reviews: [],
      },
      {
        id: 'doc8',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'tech_credit_report.pdf',
        fileSize: 175000,
        uploadedAt: '2024-02-15T08:50:00Z',
        fileUrl: '/mock/documents/tech_credit.pdf',
        reviews: [],
      },
    ],
    reviews: [
      {
        id: 'rev3',
        reviewerId: 'u2',
        reviewerName: 'Sarah Supervisor',
        reviewerRole: 'supervisor',
        comment: 'Missing required Financial Statements. Credit history shows recent late payments. Cannot recommend approval without complete documentation and improved credit profile.',
        createdAt: '2024-02-16T10:00:00Z',
        action: 'rejected',
      },
    ],
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-02-16T10:00:00Z',
  },
  {
    id: 'lr4',
    creditId: 'CR-2024-004',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'Sunrise Retail Group',
    amount: 200000,
    currency: 'USD',
    maturityDate: '2025-09-30',
    interestRate: 8.25,
    purpose: 'Store expansion and renovation',
    status: 'under_review_funder',
    submittedAt: '2024-02-22T08:00:00Z',
    documents: [
      {
        id: 'doc9',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'sunrise_retail_registration.pdf',
        fileSize: 235000,
        uploadedAt: '2024-02-22T07:30:00Z',
        fileUrl: '/mock/documents/sunrise_registration.pdf',
        reviews: [],
      },
      {
        id: 'doc10',
        documentTypeId: 'dt2',
        documentTypeName: 'Financial Statements',
        fileName: 'sunrise_financials_2022_2023.pdf',
        fileSize: 1450000,
        uploadedAt: '2024-02-22T07:35:00Z',
        fileUrl: '/mock/documents/sunrise_financials.pdf',
        reviews: [],
      },
      {
        id: 'doc11',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'sunrise_credit_feb_2024.pdf',
        fileSize: 190000,
        uploadedAt: '2024-02-22T07:40:00Z',
        fileUrl: '/mock/documents/sunrise_credit.pdf',
        reviews: [],
      },
      {
        id: 'doc12',
        documentTypeId: 'dt4',
        documentTypeName: 'Business Plan',
        fileName: 'expansion_plan_2024.pdf',
        fileSize: 850000,
        uploadedAt: '2024-02-22T07:45:00Z',
        fileUrl: '/mock/documents/expansion_plan.pdf',
        reviews: [],
      },
    ],
    reviews: [
      {
        id: 'rev4',
        reviewerId: 'u2',
        reviewerName: 'Sarah Supervisor',
        reviewerRole: 'supervisor',
        comment: 'Documentation is complete and thorough. Strong financial position with steady growth over past 3 years. Expansion plan is well-structured. Recommended for funder review.',
        createdAt: '2024-02-23T10:30:00Z',
        action: 'approved',
      },
    ],
    createdAt: '2024-02-22T07:00:00Z',
    updatedAt: '2024-02-23T10:30:00Z',
  },
  {
    id: 'lr5',
    creditId: 'CR-2024-005',
    environmentId: 'e3',
    environmentName: 'Global-Premier Micro Finance',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'Maria Rodriguez',
    amount: 15000,
    currency: 'USD',
    maturityDate: '2024-12-31',
    interestRate: 12.0,
    purpose: 'Small business inventory purchase',
    status: 'under_review_supervisor',
    submittedAt: '2024-02-23T14:20:00Z',
    documents: [
      {
        id: 'doc13',
        documentTypeId: 'dt3e1',
        documentTypeName: 'ID Verification',
        fileName: 'maria_rodriguez_id.pdf',
        fileSize: 125000,
        uploadedAt: '2024-02-23T14:00:00Z',
        fileUrl: '/mock/documents/maria_id.pdf',
        reviews: [],
      },
      {
        id: 'doc14',
        documentTypeId: 'dt3e2',
        documentTypeName: 'Bank Statements',
        fileName: 'bank_statements_sept_2023_feb_2024.pdf',
        fileSize: 480000,
        uploadedAt: '2024-02-23T14:10:00Z',
        fileUrl: '/mock/documents/maria_bank.pdf',
        reviews: [],
      },
      {
        id: 'doc15',
        documentTypeId: 'dt3e3',
        documentTypeName: 'Income Proof',
        fileName: 'business_revenue_records.pdf',
        fileSize: 290000,
        uploadedAt: '2024-02-23T14:15:00Z',
        fileUrl: '/mock/documents/maria_income.pdf',
        reviews: [],
      },
    ],
    reviews: [],
    createdAt: '2024-02-23T13:30:00Z',
    updatedAt: '2024-02-23T14:20:00Z',
  },
  {
    id: 'lr6',
    creditId: 'CR-2024-006',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'Dynamic Construction LLC',
    amount: 350000,
    currency: 'USD',
    maturityDate: '2026-01-15',
    interestRate: 7.75,
    purpose: 'Equipment acquisition and working capital',
    status: 'under_review_supervisor',
    submittedAt: '2024-02-24T09:15:00Z',
    documents: [
      {
        id: 'doc16',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'dynamic_construction_registration.pdf',
        fileSize: 255000,
        uploadedAt: '2024-02-24T08:45:00Z',
        fileUrl: '/mock/documents/dynamic_registration.pdf',
        reviews: [],
      },
      {
        id: 'doc17',
        documentTypeId: 'dt2',
        documentTypeName: 'Financial Statements',
        fileName: 'dynamic_financials_2022_2023.pdf',
        fileSize: 1680000,
        uploadedAt: '2024-02-24T08:55:00Z',
        fileUrl: '/mock/documents/dynamic_financials.pdf',
        reviews: [],
      },
      {
        id: 'doc18',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'dynamic_credit_report.pdf',
        fileSize: 205000,
        uploadedAt: '2024-02-24T09:00:00Z',
        fileUrl: '/mock/documents/dynamic_credit.pdf',
        reviews: [],
      },
      {
        id: 'doc19',
        documentTypeId: 'dt5',
        documentTypeName: 'Collateral Documentation',
        fileName: 'equipment_ownership_proof.pdf',
        fileSize: 920000,
        uploadedAt: '2024-02-24T09:10:00Z',
        fileUrl: '/mock/documents/collateral_docs.pdf',
        reviews: [],
      },
    ],
    reviews: [],
    createdAt: '2024-02-24T08:00:00Z',
    updatedAt: '2024-02-24T09:15:00Z',
  },
  {
    id: 'lr7',
    creditId: 'CR-2024-007',
    environmentId: 'e1',
    environmentName: 'Global-Premier SME Facility',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    borrowerName: 'Green Energy Solutions',
    amount: 275000,
    currency: 'USD',
    maturityDate: '2025-11-20',
    interestRate: 8.0,
    purpose: 'Solar panel installation project',
    status: 'under_review_funder',
    submittedAt: '2024-02-21T11:00:00Z',
    documents: [
      {
        id: 'doc20',
        documentTypeId: 'dt1',
        documentTypeName: 'Business Registration Certificate',
        fileName: 'green_energy_registration.pdf',
        fileSize: 240000,
        uploadedAt: '2024-02-21T10:30:00Z',
        fileUrl: '/mock/documents/green_registration.pdf',
        reviews: [],
      },
      {
        id: 'doc21',
        documentTypeId: 'dt2',
        documentTypeName: 'Financial Statements',
        fileName: 'green_energy_financials.pdf',
        fileSize: 1320000,
        uploadedAt: '2024-02-21T10:40:00Z',
        fileUrl: '/mock/documents/green_financials.pdf',
        reviews: [],
      },
      {
        id: 'doc22',
        documentTypeId: 'dt3',
        documentTypeName: 'Credit Report',
        fileName: 'green_energy_credit.pdf',
        fileSize: 185000,
        uploadedAt: '2024-02-21T10:50:00Z',
        fileUrl: '/mock/documents/green_credit.pdf',
        reviews: [],
      },
    ],
    reviews: [
      {
        id: 'rev5',
        reviewerId: 'u2',
        reviewerName: 'Sarah Supervisor',
        reviewerRole: 'supervisor',
        comment: 'Innovative business model in growing sector. All required documentation provided. Financial metrics are solid. Moving to funder for final approval.',
        createdAt: '2024-02-22T14:20:00Z',
        action: 'approved',
      },
    ],
    createdAt: '2024-02-21T10:00:00Z',
    updatedAt: '2024-02-22T14:20:00Z',
  },
];

const initialLoans: Loan[] = [
  {
    id: 'l1',
    loanRequestId: 'lr2',
    creditId: 'CR-2024-002',
    environmentId: 'e1',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    funderId: 'c1',
    funderName: 'Global Capital Fund',
    borrowerName: 'XYZ Trading Co',
    amount: 75000,
    currency: 'USD',
    maturityDate: '2025-03-15',
    interestRate: 9.0,
    status: 'active',
    disbursedAt: '2024-02-20T09:00:00Z',
    outstandingBalance: 75000,
  },
  {
    id: 'l2',
    loanRequestId: 'lr-old-1',
    creditId: 'CR-2023-045',
    environmentId: 'e1',
    originatorId: 'c2',
    originatorName: 'Premier Lending Inc',
    funderId: 'c1',
    funderName: 'Global Capital Fund',
    borrowerName: 'Legacy Business Corp',
    amount: 100000,
    currency: 'USD',
    maturityDate: '2024-02-10',
    interestRate: 7.5,
    status: 'overdue',
    disbursedAt: '2024-01-10T11:00:00Z',
    outstandingBalance: 102250,
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [environments, setEnvironments] = useState<Environment[]>(initialEnvironments);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(initialLoanRequests);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);

  const addCompany = (company: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...company,
      id: `c${companies.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(companies.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addUser = (user: Omit<AppUser, 'id'>) => {
    const newUser: AppUser = {
      ...user,
      id: `u${users.length + 1}`,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    setUsers(users.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const addEnvironment = (env: Omit<Environment, 'id' | 'createdAt'>) => {
    const newEnv: Environment = {
      ...env,
      id: `e${environments.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEnvironments([...environments, newEnv]);
  };

  const updateEnvironment = (id: string, updates: Partial<Environment>) => {
    setEnvironments(environments.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const addDocumentTypeToEnvironment = (envId: string, docType: Omit<DocumentType, 'id'>) => {
    setEnvironments(environments.map(e => {
      if (e.id === envId) {
        const newDocType: DocumentType = {
          ...docType,
          id: `dt${e.documentTypes.length + 1}-${Date.now()}`,
        };
        return {
          ...e,
          documentTypes: [...e.documentTypes, newDocType],
        };
      }
      return e;
    }));
  };

  const removeDocumentTypeFromEnvironment = (envId: string, docTypeId: string) => {
    setEnvironments(environments.map(e => {
      if (e.id === envId) {
        return {
          ...e,
          documentTypes: e.documentTypes.filter(dt => dt.id !== docTypeId),
        };
      }
      return e;
    }));
  };

  const addLoanRequest = (request: Omit<LoanRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRequest: LoanRequest = {
      ...request,
      id: `lr${loanRequests.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    setLoanRequests([...loanRequests, newRequest]);
  };

  const updateLoanRequest = (id: string, updates: Partial<LoanRequest>) => {
    setLoanRequests(loanRequests.map(lr => 
      lr.id === id ? { ...lr, ...updates, updatedAt: new Date().toISOString() } : lr
    ));
  };

  const addReviewToLoanRequest = (requestId: string, review: Omit<ReviewComment, 'id' | 'createdAt'>) => {
    const newReview: ReviewComment = {
      ...review,
      id: `rev${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setLoanRequests(loanRequests.map(lr => {
      if (lr.id === requestId) {
        return {
          ...lr,
          reviews: [...lr.reviews, newReview],
          updatedAt: new Date().toISOString(),
        };
      }
      return lr;
    }));
  };

  const addDocumentReview = (requestId: string, documentId: string, review: Omit<DocumentReview, 'reviewedAt'>) => {
    const newReview: DocumentReview = {
      ...review,
      reviewedAt: new Date().toISOString(),
    };
    
    setLoanRequests(loanRequests.map(lr => {
      if (lr.id === requestId) {
        return {
          ...lr,
          documents: lr.documents.map(doc => {
            if (doc.id === documentId) {
              return {
                ...doc,
                reviews: [...(doc.reviews || []), newReview],
              };
            }
            return doc;
          }),
          updatedAt: new Date().toISOString(),
        };
      }
      return lr;
    }));
  };

  const addLoan = (loan: Omit<Loan, 'id' | 'disbursedAt'>) => {
    const newLoan: Loan = {
      ...loan,
      id: `l${loans.length + 1}`,
      disbursedAt: new Date().toISOString(),
    };
    setLoans([...loans, newLoan]);
  };

  return (
    <DataContext.Provider
      value={{
        companies,
        users,
        environments,
        loanRequests,
        loans,
        addCompany,
        updateCompany,
        addUser,
        updateUser,
        addEnvironment,
        updateEnvironment,
        addDocumentTypeToEnvironment,
        removeDocumentTypeFromEnvironment,
        addLoanRequest,
        updateLoanRequest,
        addReviewToLoanRequest,
        addDocumentReview,
        addLoan,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
