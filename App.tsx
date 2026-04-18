import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ChatMessage,
  WorkflowState,
  CurrentSessionDisplaySummary,
  SessionData,
  Patient,
} from "./types";

import { verifyPatient } from "./services/patientService";
import { storeSessionData } from "./services/supabaseService";
import ChatWindow from "./components/ChatWindow";
import InputArea from "./components/InputArea";

const initialSummary: CurrentSessionDisplaySummary = {
  verified: false,
  first_name: "",
  last_name: "",
  age: "",
  postcode: "",
  symptoms: "",
  severity: "",
  timestamp: "",
};

const App: React.FC = () => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>(
    WorkflowState.GREETING
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPatientInput, setCurrentPatientInput] =
    useState<Partial<Patient>>({});
  const [summary, setSummary] = useState<CurrentSessionDisplaySummary>(
    initialSummary
  );

  const addBotMessage = useCallback((text: string) => {
    console.log("🤖 BOT:", text);
    setChatMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "bot", text },
    ]);
  }, []);

  // Handle workflow changes
  useEffect(() => {
    console.log("⚙️ WORKFLOW CHANGED:", WorkflowState[workflowState]);

    const run = async () => {
      switch (workflowState) {
        case WorkflowState.GREETING:
          addBotMessage("Hello! Let's confirm your identity.");
          setWorkflowState(WorkflowState.ASK_FIRST_NAME);
          break;

        case WorkflowState.ASK_FIRST_NAME:
          addBotMessage("What is your first name?");
          break;

        case WorkflowState.ASK_LAST_NAME:
          addBotMessage("What is your last name?");
          break;

        case WorkflowState.ASK_AGE:
          addBotMessage("What is your age?");
          break;

        case WorkflowState.ASK_POSTCODE:
          addBotMessage("What is your postcode?");
          break;

        case WorkflowState.VERIFYING_IDENTITY: {
          console.log("🔍 VERIFYING:", currentPatientInput);
          const verified = verifyPatient(currentPatientInput);

          if (verified) {
            addBotMessage("Identity verified.");

            setSummary((prev) => ({
              ...prev,
              verified: true,
              first_name: verified.first_name,
              last_name: verified.last_name,
              age: verified.age,
              postcode: verified.postcode,
            }));

            setWorkflowState(WorkflowState.ASK_SYMPTOMS);
          } else {
            addBotMessage("Identity could not be verified. Restarting...");
            setWorkflowState(WorkflowState.GREETING);
          }
          break;
        }

        case WorkflowState.ASK_SYMPTOMS:
          addBotMessage("Please describe your symptoms.");
          break;

        case WorkflowState.ASK_SEVERITY:
          addBotMessage("How severe are they? (mild / moderate / severe)");
          break;

        case WorkflowState.CLOSING: {
          console.log("🚀 CLOSING STATE STARTED");

          const timestamp = new Date().toLocaleString();

          // Flatten payload for Supabase
          const payload = {
            session_timestamp: timestamp,
            first_name: currentPatientInput.first_name || "",
            last_name: currentPatientInput.last_name || "",
            age: currentPatientInput.age || null,
            postcode: currentPatientInput.postcode || "",
            symptoms: [summary.symptoms || ""], // Store as array
            severity: summary.severity || "",
            chat_history: chatMessages,
          };

          console.log("📦 Payload to send:", payload);

          await storeSessionData(payload); // Store in Supabase

          setSummary((prev) => ({ ...prev, timestamp }));
          addBotMessage("Thank you. Your session has been recorded.");
          setWorkflowState(WorkflowState.COMPLETED);

          break;
        }

        default:
          break;
      }
    };

    run();
  }, [workflowState]);

  const handleSendMessage = (message: string) => {
    console.log("💬 USER:", message);

    setChatMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "user", text: message },
    ]);

    switch (workflowState) {
      case WorkflowState.ASK_FIRST_NAME:
        setCurrentPatientInput((p) => ({ ...p, first_name: message }));
        setWorkflowState(WorkflowState.ASK_LAST_NAME);
        break;

      case WorkflowState.ASK_LAST_NAME:
        setCurrentPatientInput((p) => ({ ...p, last_name: message }));
        setWorkflowState(WorkflowState.ASK_AGE);
        break;

      case WorkflowState.ASK_AGE:
        if (!isNaN(Number(message))) {
          setCurrentPatientInput((p) => ({ ...p, age: Number(message) }));
          setWorkflowState(WorkflowState.ASK_POSTCODE);
        } else {
          addBotMessage("Please enter a valid age.");
        }
        break;

      case WorkflowState.ASK_POSTCODE:
        setCurrentPatientInput((p) => ({ ...p, postcode: message }));
        setWorkflowState(WorkflowState.VERIFYING_IDENTITY);
        break;

      case WorkflowState.ASK_SYMPTOMS:
        setSummary((p) => ({ ...p, symptoms: message }));
        setWorkflowState(WorkflowState.ASK_SEVERITY);
        break;

      case WorkflowState.ASK_SEVERITY:
        if (["mild", "moderate", "severe"].includes(message.toLowerCase())) {
          setSummary((p) => ({
            ...p,
            severity: message.toLowerCase(),
          }));
          setWorkflowState(WorkflowState.CLOSING);
        } else {
          addBotMessage("Choose mild / moderate / severe");
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatWindow messages={chatMessages} />

      {workflowState === WorkflowState.COMPLETED ? (
        <div className="p-4 bg-gray-800 text-white">
          <h3 className="text-lg font-bold mb-2">Summary</h3>

          <div className="whitespace-pre-wrap text-sm">
            Verification Status: {summary.verified ? "Verified" : "Not Verified"}{"\n"}
            Name: {summary.first_name} {summary.last_name}{"\n"}
            Age: {summary.age}{"\n"}
            Postcode: {summary.postcode}{"\n"}
            Symptoms: {summary.symptoms}{"\n"}
            Severity: {summary.severity}{"\n"}
            Recorded At: {summary.timestamp}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 rounded"
          >
            Start New Chat
          </button>
        </div>
      ) : (
        <InputArea
          onSendMessage={handleSendMessage}
          showSeverityOptions={workflowState === WorkflowState.ASK_SEVERITY}
        />
      )}
    </div>
  );
};

export default App;
