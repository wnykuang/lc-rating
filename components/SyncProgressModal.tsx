import React, { useState } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import AllProgress from "@components/AllProgress";

interface SyncProgressModalProps {
  show: boolean;
  onHide: () => void;
  isAuthenticated: boolean;
}

export default function SyncProgressModal({
  show,
  onHide,
  isAuthenticated,
}: SyncProgressModalProps) {
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "fetched" | "set" | "error"
  >("idle");
  const [fetchedData, setFetchedData] = useState("");
  const [inputData, setInputData] = useState("");


  const cleanUpResponse = (response) => {
	const cleanedData = {};
	response.forEach(item => {
	  cleanedData[item.problem_id] = item.progress;
	});
	return cleanedData;
  };

  
  const handleFetch = () => {
    const allProgress = new AllProgress();
    const result = allProgress.getAllProgress();
    setFetchedData(JSON.stringify(result, null, 2));
    setInputData(JSON.stringify(result, null, 2));
    setSyncStatus("fetched");
  };

  const handleSet = () => {
    try {
      const allProgress = new AllProgress();
      const parsedData = JSON.parse(inputData);
      allProgress.setAllProgress(parsedData);
      setSyncStatus("set");
    } catch (error) {
      setSyncStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fetchedData);
  };

  const handleUpload = async () => {
    if (isAuthenticated) {
      const token = localStorage.getItem("jwtToken");
      console.log("token", token);
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:8787/api/uploadprogress",
            {
              method: "POST", // Use POST method for uploading data
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(JSON.parse(inputData)),
            }
          );

          if (response.ok) {
            setSyncStatus("set");
          } else {
            setSyncStatus("error");
          }
        } catch (error) {
          setSyncStatus("error");
        }
      }
    }
  };

  const handleDownload = async () => {
    if (isAuthenticated) {
      const token = localStorage.getItem("jwtToken");
      console.log("token", token);
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:8787/api/getprogress",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
			console.log("data", cleanUpResponse(data.result.results));
            setFetchedData(JSON.stringify(cleanUpResponse(data.result.results), null, 2));
            setSyncStatus("fetched");
          } else {
            setSyncStatus("error");
          }
        } catch (error) {
          setSyncStatus("error");
        }
      }
    }
  };
  
  console.log("isAuthenticated", isAuthenticated);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Sync Progress</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Button onClick={handleFetch} className="mt-3" >Fetch Progress</Button>
          <Button onClick={handleDownload} className="mt-3 ms-2" > Download Progress </Button>
        {syncStatus === "fetched" && (
          <div className="mt-3 position-relative">
            <pre className="bg-light p-3 rounded">
              <code>{fetchedData}</code>
            </pre>
            <Button
              variant="link"
              className="position-absolute top-0 end-0 p-2"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              📋
            </Button>
          </div>
        )}
        {syncStatus === "error" && (
          <Alert variant="danger" className="mt-3">
            Failed to set progress. Please check the input data.
          </Alert>
        )}
        <Form.Group className="mt-3">
          <Form.Label>Input Progress Data:</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleSet} className="mt-3">
          Set Progress
        </Button>
        <Button onClick={handleUpload} className="mt-3 ms-2">
          Upload Progress
        </Button>
      </Modal.Body>
    </Modal>
  );
}
