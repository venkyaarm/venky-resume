import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    education: '',
    skills: '',
    languages: '',
    certifications: '',
    declaration: ''
  });
  const [photo, setPhoto] = useState(null);
  const [customSections, setCustomSections] = useState([]);
  const resumeRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleCustomChange = (index, value) => {
    const updated = [...customSections];
    updated[index].content = value;
    setCustomSections(updated);
  };

  const addCustomSection = () => {
    const heading = prompt('Enter section heading:');
    if (heading) {
      setCustomSections([...customSections, { heading, content: '' }]);
    }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(resumeRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('resume.pdf');
  };

  // Helper: Converts text to lines with line breaks
  const formatMultiline = (text) =>
    text.split('\n').map((line, idx) => (
      <p key={idx} style={{ margin: 0 }}>{line}</p>
    ));

  // Helper: Converts text to bullets
  const formatBullets = (text) =>
    text.split('\n').map((line, idx) =>
      line.trim() ? <li key={idx}>{line.trim()}</li> : null
    );

  return (
    <div className="resume-builder-container">
      <div className="form-panel">
        <h2>Fill Resume Details</h2>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {Object.keys(form).map((key) => (
          <div className="input-group" key={key}>
            <label>{key.toUpperCase()}</label>
            <textarea
              name={key}
              value={form[key]}
              onChange={handleChange}
              rows={key === 'summary' || key === 'declaration' ? 4 : 2}
            />
          </div>
        ))}

        {customSections.map((sec, idx) => (
          <div className="input-group" key={idx}>
            <label>{sec.heading}</label>
            <textarea
              value={sec.content}
              onChange={(e) => handleCustomChange(idx, e.target.value)}
              rows={3}
            />
          </div>
        ))}

        <button onClick={downloadPDF}>📄 Download PDF</button>
        <button onClick={addCustomSection}>➕ Add Section</button>
      </div>

      <div className="resume-preview" ref={resumeRef}>
        <div className="resume-header">
          {photo && <img src={photo} alt="Profile" className="profile-img" />}
          <div>
            <h1 className="name">{form.name || 'Your Name'}</h1>
            <p>{form.email}</p>
            <p>{form.phone}</p>
          </div>
        </div>

        <div className="resume-section">
          <h2>Professional Summary</h2>
          {formatMultiline(form.summary)}
        </div>

        <div className="resume-section">
          <h2>Education</h2>
          {formatMultiline(form.education)}
        </div>

        <div className="resume-row">
          <div className="resume-column">
            <h2>Skills</h2>
            <ul>{formatBullets(form.skills)}</ul>
          </div>
          <div className="resume-column">
            <h2>Languages</h2>
            <ul>{formatBullets(form.languages)}</ul>
          </div>
        </div>

        <div className="resume-row">
          <div className="resume-column">
            <h2>Certifications</h2>
            {formatMultiline(form.certifications)}
          </div>
          <div className="resume-column">
            <h2>Declaration</h2>
            {formatMultiline(form.declaration)}
          </div>
        </div>

        {customSections.map((sec, idx) => (
          <div className="resume-section" key={idx}>
            <h2>{sec.heading}</h2>
            {formatMultiline(sec.content)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeBuilder;
