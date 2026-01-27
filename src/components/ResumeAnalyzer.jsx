import React, { useState, useRef } from "react";
import "./ResumeAnalyzer.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerURL from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

GlobalWorkerOptions.workerSrc = workerURL;

/* ------------------ AI ENGINE DATA ------------------ */

const skillKeywords = [
  "java","python","react","node","javascript","html","css","sql",
  "mongodb","firebase","aws","docker","git","linux","ui","ux",
  "machine learning","ai","data science","opencv","tensorflow"
];

const educationKeywords = [
  "bachelor","b.tech","b.e","b.sc","m.tech","m.sc","mba",
  "degree","diploma","college","university","school"
];

const jobRoles = {
  "react": "Frontend Developer",
  "node": "Backend Developer",
  "python": "Python Developer",
  "java": "Java Developer",
  "ai": "AI Engineer",
  "machine learning": "ML Engineer",
  "data": "Data Analyst",
  "ui": "UI Designer",
  "ux": "UX Designer",
  "sql": "Database Engineer",
  "aws": "Cloud Engineer",
  "firebase": "Full Stack Developer"
};

/* ------------------ COMPONENT ------------------ */

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const analysisRef = useRef(null);

  /* ------------------ PDF Reader ------------------ */

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
        alert("Error reading PDF");
      }
    };
  };

  /* ------------------ AI Resume Analysis ------------------ */

  const analyzeResume = () => {
  if (!resumeText.trim()) return alert("Please provide resume content!");
  setLoading(true);

  setTimeout(() => {
    const text = resumeText.toLowerCase();

    const skillsFound = skillKeywords.filter(s => text.includes(s));
    const educationFound = educationKeywords.filter(e => text.includes(e));

    const experience = [];
    if (text.includes("intern")) experience.push("Internship Experience");
    if (text.includes("project")) experience.push("Project Work");
    if (text.includes("company")) experience.push("Industry Exposure");
    if (text.includes("freelance")) experience.push("Freelance Experience");

    const roles = [];
    Object.keys(jobRoles).forEach(k => {
      if (text.includes(k)) roles.push(jobRoles[k]);
    });

    const strengths = [];
    if (skillsFound.length >= 4) strengths.push("Strong Technical Skill Set");
    if (text.includes("team")) strengths.push("Good Team Player");
    if (text.includes("lead")) strengths.push("Leadership Qualities");
    if (text.includes("problem")) strengths.push("Problem Solving Skills");
    if (text.includes("award") || text.includes("achievement")) strengths.push("Achievements & Awards");

    /* --------- SMART IMPROVEMENT ENGINE --------- */

    const improvements = [];

    if (!text.match(/\d{10}/)) improvements.push("Add a valid phone number");
    if (!text.includes("@")) improvements.push("Add a professional email address");
    if (!text.includes("linkedin")) improvements.push("Add your LinkedIn profile");
    if (!text.includes("github")) improvements.push("Add your GitHub profile");
    if (!text.includes("summary") && !text.includes("objective"))
      improvements.push("Add a career summary or objective");
    if (skillsFound.length < 3)
      improvements.push("Add more technical skills relevant to your field");
    if (educationFound.length === 0)
      improvements.push("Clearly mention your education details");
    if (!text.includes("project") && !text.includes("intern"))
      improvements.push("Include projects or internship experience");
    if (!text.includes("certificate"))
      improvements.push("Add certifications to strengthen your profile");

    const report = `
📌 KEY STRENGTHS
${strengths.length ? strengths.map(s=>"• "+s).join("\n") : "• Good learning potential"}

💡 SKILL HIGHLIGHTS
${skillsFound.length ? skillsFound.map(s=>"• "+s.toUpperCase()).join("\n") : "• Skills not clearly mentioned"}

🎯 SUGGESTED JOB ROLES
${roles.length ? [...new Set(roles)].map(r=>"• "+r).join("\n") : "• Software Developer"}

🏫 EDUCATION
${educationFound.length ? educationFound.map(e=>"• "+e).join("\n") : "• Education not detected"}

💼 EXPERIENCE
${experience.length ? experience.map(e=>"• "+e).join("\n") : "• Fresher"}

🚀 IMPROVEMENTS
${improvements.length ? improvements.map(i=>"• "+i).join("\n") : "• Your resume is already strong and professional"}
`;

    setAnalysis(report);
    setLoading(false);
  }, 700);
};


  /* ------------------ EXPORT ------------------ */

  const exportText = () => {
    const blob = new Blob([analysis], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume_analysis.txt";
    link.click();
  };

  const exportPDF = async () => {
    if (!analysisRef.current) return;

    const canvas = await html2canvas(analysisRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p","mm","a4");

    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(imgData,"PNG",0,0,w,h);
    pdf.save("resume_analysis.pdf");
  };

  /* ------------------ UI ------------------ */

  return (
    <div className={`resume-analyzer-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="header-bar">
        <h1>🚀 Resume Analyzer</h1>
        <button onClick={()=>setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="upload-box">
        <div className={`drop-area ${dragging?"dragging":""}`}
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
        >
          <p>📄 Drag & Drop PDF</p>
          <input type="file" accept="application/pdf" onChange={handleFileUpload}/>
        </div>

        <textarea
          value={resumeText}
          onChange={e=>setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
        />
      </div>

      <button onClick={analyzeResume} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <>
          <div className="result-box" ref={analysisRef}>
            <pre>{analysis}</pre>
          </div>

          <div className="export-buttons">
            <button onClick={exportText}>📄 Export Text</button>
            <button onClick={exportPDF}>📑 Export PDF</button>
          </div>
        </>
      )}
    </div>
  );
}
