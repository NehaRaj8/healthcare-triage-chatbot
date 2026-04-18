export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export enum WorkflowState {
  GREETING,
  ASK_FIRST_NAME,
  ASK_LAST_NAME,
  ASK_AGE,
  ASK_POSTCODE,
  VERIFYING_IDENTITY,
  ASK_SYMPTOMS,
  ASK_SEVERITY,
  CLOSING,
  COMPLETED,
}

export interface Patient {
  first_name: string;
  last_name: string;
  age: number;
  postcode: string;
}

export interface DashboardPatientSummary {
  first_name: string;
  last_name: string;
  age: number;
  postcode: string;
  symptoms: string[];
  severity: string;
}

export interface SessionData {
  dashboardSummary: DashboardPatientSummary;
  chatHistory: ChatMessage[];
  sessionTimestamp: string;
}

export interface CurrentSessionDisplaySummary {
  verified: boolean;
  first_name: string;
  last_name: string;
  age: any;
  postcode: string;
  symptoms: string;
  severity: string;
  timestamp: string;
}
