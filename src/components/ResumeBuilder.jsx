import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ResumeBuilder.css";

export default function ResumeBuilder() {
  const resumeRef = useRef();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: "",
    certifications: "",
    declaration: "",
  });

  const [education, setEducation] = useState([
    { qualification: "", year: "", score: "" },
  ]);

  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");

  const [customSections, setCustomSections] = useState([]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* SKILLS */
  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (i) =>
    setSkills(skills.filter((_, index) => index !== i));

  /* LANGUAGES */
  const addLanguage = () => {
    if (langInput.trim()) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput("");
    }
  };

  const removeLanguage = (i) =>
    setLanguages(languages.filter((_, index) => index !== i));

  /* EDUCATION */
  const updateEducation = (i, field, value) => {
    const updated = [...education];
    updated[i][field] = value;
    setEducation(updated);
  };

  const addEducation = () =>
    setEducation([...education, { qualification: "", year: "", score: "" }]);

  /* CUSTOM SECTIONS */
  const addCustomSection = () => {
    const title = prompt("Enter section title (Projects, Achievements, etc.)");
    if (title) {
      setCustomSections([
        ...customSections,
        { title, description: "" },
      ]);
    }
  };

  const updateCustomSection = (i, value) => {
    const updated = [...customSections];
    updated[i].description = value;
    setCustomSections(updated);
  };

  /* PDF */
  const downloadPDF = async () => {
    const canvas = await html2canvas(resumeRef.current, {
      scale: 3,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${form.name || "Resume"}.pdf`);
  };

  const hasEducation = education.some(
    (e) => e.qualification || e.year || e.score
  );

  return (
    <div className="rb-container">
      {/* LEFT – BUILDER */}
      <div className="rb-form">
        <h2>Professional Resume Builder</h2>

        <section>
          <label>Full Name</label>
          <input name="name" onChange={handleChange} />

          <label>Email</label>
          <input name="email" onChange={handleChange} />

          <label>Phone</label>
          <input name="phone" onChange={handleChange} />

          <label>Location</label>
          <input name="address" onChange={handleChange} />
        </section>

        <section>
          <label>Professional Summary</label>
          <textarea name="summary" onChange={handleChange} />
        </section>

        {/* SKILLS */}
        <section>
          <label>Skills</label>
          <div className="inline-input">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
            />
            <button onClick={addSkill}>Add</button>
          </div>

          <div className="chip-list">
            {skills.map((s, i) => (
              <span key={i} className="chip" onClick={() => removeSkill(i)}>
                {s} ✕
              </span>
            ))}
          </div>
        </section>

        {/* LANGUAGES */}
        <section>
          <label>Languages</label>
          <div className="inline-input">
            <input
              value={langInput}
              onChange={(e) => setLangInput(e.target.value)}
              placeholder="Add language"
            />
            <button onClick={addLanguage}>Add</button>
          </div>

          <div className="chip-list">
            {languages.map((l, i) => (
              <span key={i} className="chip" onClick={() => removeLanguage(i)}>
                {l} ✕
              </span>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section>
          <label>Experience / Projects / Internships</label>
          <textarea
            name="experience"
            placeholder="Write each point in a new line"
            onChange={handleChange}
          />
        </section>

        {/* EDUCATION */}
        <section>
          <label>Education</label>
          {education.map((edu, i) => (
            <div key={i} className="edu-row">
              <input
                placeholder="Qualification"
                onChange={(e) =>
                  updateEducation(i, "qualification", e.target.value)
                }
              />
              <input
                placeholder="Year"
                onChange={(e) =>
                  updateEducation(i, "year", e.target.value)
                }
              />
              <input
                placeholder="Score"
                onChange={(e) =>
                  updateEducation(i, "score", e.target.value)
                }
              />
            </div>
          ))}
          <button onClick={addEducation}>Add Education</button>
        </section>

        {/* CUSTOM SECTIONS */}
        <section>
          <button onClick={addCustomSection}>➕ Add New Section</button>

          {customSections.map((sec, i) => (
            <textarea
              key={i}
              placeholder={`Describe ${sec.title}`}
              onChange={(e) => updateCustomSection(i, e.target.value)}
            />
          ))}
        </section>

        <section>
          <label>Certifications</label>
          <textarea name="certifications" onChange={handleChange} />
        </section>

        <section>
          <label>Declaration</label>
          <textarea name="declaration" onChange={handleChange} />
        </section>

        <button className="download" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      {/* RIGHT – LIVE PREVIEW */}
      <div className="preview">
        <div className="resume" ref={resumeRef}>
          {(form.name || form.email || form.phone || form.address) && (
            <header>
              {form.name && <h1>{form.name}</h1>}
              <p>
                {[form.email, form.phone, form.address]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            </header>
          )}

          {form.summary && (
            <section>
              <h2>Professional Summary</h2>
              <p>{form.summary}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2>Skills</h2>
              <ul className="multi-column">
                {skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2>Languages</h2>
              <ul className="multi-column">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </section>
          )}

          {form.experience && (
  <section>
    <h2>Experience</h2>
    <p className="experience-text">{form.experience}</p>
  </section>
)}


          {customSections.map(
            (sec, i) =>
              sec.description && (
                <section key={i}>
                  <h2>{sec.title}</h2>
                  <p>{sec.description}</p>
                </section>
              )
          )}

          {hasEducation && (
            <section>
              <h2>Education</h2>
              {education.map(
                (edu, i) =>
                  (edu.qualification || edu.year || edu.score) && (
                    <p key={i}>
                      <strong>{edu.qualification}</strong>
                      {edu.year && ` (${edu.year})`}
                      {edu.score && ` - ${edu.score}`}
                    </p>
                  )
              )}
            </section>
          )}

          {form.certifications && (
            <section>
              <h2>Certifications</h2>
              <p>{form.certifications}</p>
            </section>
          )}

          {form.declaration && (
            <section>
              <h2>Declaration</h2>
              <p>{form.declaration}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
