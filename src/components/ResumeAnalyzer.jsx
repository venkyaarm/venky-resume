import React, { useState, useEffect, useRef } from "react";
import "./ResumeAnalyzer.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerURL from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

GlobalWorkerOptions.workerSrc = workerURL;

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const analysisRef = useRef(null);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      readPDF(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      readPDF(file);
    }
  };

  const readPDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const pdf = await getDocument({ data: reader.result }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          extractedText += strings.join(" ") + "\n";
        }

        setResumeText(extractedText.trim());
      } catch (err) {
        alert("Error reading PDF: " + err.message);
      }
    };
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      alert("Please provide resume content!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDsDZJmml18dqhEwVDPSoZdhesZStaBDJ0`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the following resume text and return the result under these sections: 
1. 📌 Key Strengths
2. 💡 Skill Highlights
3. 🎯 Suggested Job Roles
4. 🏭 Suitable Industries
5. ✅ Improvement Suggestions

Resume:
${resumeText}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAnalysis(result || "No analysis found.");
    } catch (error) {
      setAnalysis("Failed to analyze the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportText = () => {
    const element = document.createElement("a");
    const file = new Blob([analysis], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resume_analysis.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportPDF = async () => {
    if (!analysisRef.current) return;
    const canvas = await html2canvas(analysisRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume_analysis.pdf");
  };

  return (
    <div className={`resume-analyzer-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="header-bar">
        <h1 className="title">🚀 Venky Resume Analyzer</h1>
        <button className="toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div
        className={`drop-area ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <p>📥 Drag & drop a PDF here or</p>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      </div>

      <textarea
        className="resume-textarea"
        placeholder="Or paste your resume text here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      ></textarea>

      <button onClick={analyzeResume} className="analyze-btn" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <div className="result-box" ref={analysisRef}>
          <h2>📊 Analysis Result</h2>
          <pre className="styled-analysis">{analysis}</pre>
          <div className="export-buttons">
            <button onClick={exportText}>📄 Export as Text</button>
            <button onClick={exportPDF}>🧾 Export as PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
