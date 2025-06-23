import React, { useState, useRef } from "react";
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") readPDF(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") readPDF(file);
  };

  const readPDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const pdf = await getDocument({ data: reader.result }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        setResumeText(text.trim());
      } catch (err) {
        alert("Error reading PDF: " + err.message);
      }
    };
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return alert("Please provide resume content!");
    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDsDZJmml18dqhEwVDPSoZdhesZStaBDJ0`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the following resume text and return results under these sections:\n
1. 📌 Key Strengths\n
2. 💡 Skill Highlights\n
3. 🎯 Suggested Job Roles\n
4. 🏭 Suitable Industries\n
5. ✅ Improvement Suggestions\n\nResume:\n${resumeText}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await res.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAnalysis(result || "No analysis found.");
    } catch (err) {
      setAnalysis("Failed to analyze the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportText = () => {
    const blob = new Blob([analysis], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume_analysis.txt";
    link.click();
  };

  const exportPDF = async () => {
    if (!analysisRef.current) return;

    const element = analysisRef.current;

    // Temporarily style for better PDF layout
    element.classList.add("pdf-export-mode");
    await new Promise((res) => setTimeout(res, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    element.classList.remove("pdf-export-mode");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = {
      width: pdfWidth,
      height: (canvas.height * pdfWidth) / canvas.width,
    };

    let position = 0;
    let heightLeft = imgProps.height;

    pdf.addImage(imgData, "PNG", 0, position, imgProps.width, imgProps.height);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgProps.width, imgProps.height);
      heightLeft -= pdfHeight;
    }

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

      <div className="upload-box">
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
          placeholder="📄 Or paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        ></textarea>
      </div>

      <button onClick={analyzeResume} className="analyze-btn" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <>
          <div className="result-box" ref={analysisRef}>
            <div className="pdf-page-frame">
              <h2>📊 Analysis Result</h2>
              <pre className="styled-analysis">{analysis}</pre>
            </div>
          </div>

          <div className="export-buttons">
            <button onClick={exportText}>📄 Export as Text</button>
            <button onClick={exportPDF}>🧾 Export as PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
