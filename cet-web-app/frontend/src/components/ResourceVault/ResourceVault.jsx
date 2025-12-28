// frontend/src/components/ResourceVault/ResourceVault.jsx
import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  ExternalLink, 
  Calendar, 
  Phone,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Mail,
  MapPin,
  Lightbulb,
  Image,
  ChevronRight,
  Filter
} from 'lucide-react';
import './ResourceVault.css';
import { 
  documentsData, 
  scholarshipsData, 
  importantLinks, 
  contactsData,
  importantDates,
  tipsData 
} from '../../data/resourceVaultData';

const ResourceVault = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedDocs, setCheckedDocs] = useState({});

  // Toggle document checkbox
  const toggleDocument = (id) => {
    setCheckedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate document completion percentage
  const getCompletionPercentage = () => {
    const totalDocs = documentsData.application.items.length + documentsData.counselling.items.length;
    const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
    return Math.round((checkedCount / totalDocs) * 100);
  };

  // Filter documents by search
  const filterDocuments = (items) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filter scholarships by search
  const filterScholarships = () => {
    return scholarshipsData.filter(scholarship =>
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.authority.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Render Documents Tab
  const renderDocuments = () => (
    <div className="documents-section">
      <div className="section-header">
        <div className="header-left">
          <FileText className="section-icon" size={28} />
          <div>
            <h2>Important Documents Checklist</h2>
            <p>Keep these documents ready for smooth admission process</p>
          </div>
        </div>
        <div className="completion-badge">
          <CheckCircle size={20} />
          <span>{getCompletionPercentage()}% Complete</span>
        </div>
      </div>

      {/* Application Documents */}
      <div className="document-category">
        <h3 className="category-title">
          <span className="title-icon">📋</span>
          {documentsData.application.title}
        </h3>
        <div className="documents-grid">
          {filterDocuments(documentsData.application.items).map(doc => (
            <div key={doc.id} className={`document-card ${checkedDocs[doc.id] ? 'checked' : ''}`}>
              <div className="document-header">
                <input
                  type="checkbox"
                  id={`doc-${doc.id}`}
                  checked={checkedDocs[doc.id] || false}
                  onChange={() => toggleDocument(doc.id)}
                  className="doc-checkbox"
                />
                <label htmlFor={`doc-${doc.id}`} className="doc-name">
                  {doc.name}
                </label>
                {doc.required && <span className="required-badge">Required</span>}
              </div>
              <p className="doc-description">{doc.description}</p>
              <div className="doc-meta">
                <span className="doc-format">
                  <FileText size={14} />
                  {doc.format}
                </span>
                <span className="doc-deadline">
                  <Clock size={14} />
                  {doc.deadline}
                </span>
              </div>
              {doc.notes && (
                <div className="doc-notes">
                  <AlertCircle size={14} />
                  <span>{doc.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Counselling Documents */}
      <div className="document-category">
        <h3 className="category-title">
          <span className="title-icon">🎓</span>
          {documentsData.counselling.title}
        </h3>
        <div className="documents-grid">
          {filterDocuments(documentsData.counselling.items).map(doc => (
            <div key={doc.id} className={`document-card ${checkedDocs[doc.id] ? 'checked' : ''}`}>
              <div className="document-header">
                <input
                  type="checkbox"
                  id={`doc-${doc.id}`}
                  checked={checkedDocs[doc.id] || false}
                  onChange={() => toggleDocument(doc.id)}
                  className="doc-checkbox"
                />
                <label htmlFor={`doc-${doc.id}`} className="doc-name">
                  {doc.name}
                </label>
                {doc.required && <span className="required-badge">Required</span>}
              </div>
              <p className="doc-description">{doc.description}</p>
              <div className="doc-meta">
                <span className="doc-format">
                  <FileText size={14} />
                  {doc.format}
                </span>
                <span className="doc-deadline">
                  <Clock size={14} />
                  {doc.deadline}
                </span>
              </div>
              {doc.notes && (
                <div className="doc-notes">
                  <AlertCircle size={14} />
                  <span>{doc.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Scholarships Tab
  const renderScholarships = () => (
    <div className="scholarships-section">
      <div className="section-header">
        <div className="header-left">
          <DollarSign className="section-icon" size={28} />
          <div>
            <h2>Available Scholarships</h2>
            <p>Financial assistance programs for eligible students</p>
          </div>
        </div>
      </div>

      <div className="scholarships-grid">
        {filterScholarships().map(scholarship => (
          <div key={scholarship.id} className="scholarship-card">
            <div className="scholarship-header">
              <h3>{scholarship.name}</h3>
              <span className="scholarship-authority">{scholarship.authority}</span>
            </div>

            <div className="scholarship-amount">
              <DollarSign size={20} />
              <span>{scholarship.amount}</span>
            </div>

            <div className="scholarship-section">
              <h4>Eligibility</h4>
              <ul>
                {scholarship.eligibility.map((item, index) => (
                  <li key={index}>
                    <CheckCircle size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="scholarship-section">
              <h4>Benefits</h4>
              <ul>
                {scholarship.benefits.map((item, index) => (
                  <li key={index}>
                    <CheckCircle size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="scholarship-section">
              <h4>Required Documents</h4>
              <ul>
                {scholarship.documents.map((item, index) => (
                  <li key={index}>
                    <FileText size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="scholarship-footer">
              <span className="deadline">
                <Clock size={14} />
                Deadline: {scholarship.deadline}
              </span>
              <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="apply-link">
                Apply Now
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Links Tab
  const renderLinks = () => (
    <div className="links-section">
      <div className="section-header">
        <div className="header-left">
          <ExternalLink className="section-icon" size={28} />
          <div>
            <h2>Important Links</h2>
            <p>Quick access to official portals and resources</p>
          </div>
        </div>
      </div>

      {Object.entries(importantLinks).map(([category, links]) => (
        <div key={category} className="links-category">
          <h3 className="category-title">
            <span className="title-icon">🔗</span>
            {category.charAt(0).toUpperCase() + category.slice(1)} Links
          </h3>
          <div className="links-grid">
            {links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card"
              >
                <div className="link-content">
                  <h4>{link.title}</h4>
                  <p>{link.description}</p>
                  <span className="link-category">{link.category}</span>
                </div>
                <ChevronRight className="link-icon" size={20} />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Render Timeline Tab
  const renderTimeline = () => (
    <div className="timeline-section">
      <div className="section-header">
        <div className="header-left">
          <Image className="section-icon" size={28} />
          <div>
            <h2>Admission Process Timeline</h2>
            <p>Visual guide to the complete admission journey</p>
          </div>
        </div>
      </div>

      <div className="timeline-image-container">
        <img 
          src="/images/admission-process.png" 
          alt="Maharashtra CET Admission Process Timeline" 
          className="timeline-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="image-placeholder" style={{display: 'none'}}>
          <Image size={48} />
          <p>Timeline image will be displayed here</p>
          <span>Place your admission-process.png in /public/images/</span>
        </div>
      </div>
    </div>
  );

  // Render Important Dates Tab
  const renderDates = () => (
    <div className="dates-section">
      <div className="section-header">
        <div className="header-left">
          <Calendar className="section-icon" size={28} />
          <div>
            <h2>Important Dates</h2>
            <p>Mark your calendar with these crucial deadlines</p>
          </div>
        </div>
      </div>

      {Object.entries(importantDates).map(([phase, dates]) => (
        <div key={phase} className="dates-category">
          <h3 className="category-title">
            <span className="title-icon">📅</span>
            {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
          </h3>
          <div className="dates-timeline">
            {dates.map(item => (
              <div key={item.id} className={`date-card ${item.status}`}>
                <div className="date-indicator">
                  {item.status === 'completed' && <CheckCircle size={20} />}
                  {item.status === 'ongoing' && <Clock size={20} />}
                  {item.status === 'upcoming' && <AlertCircle size={20} />}
                </div>
                <div className="date-content">
                  <h4>{item.event}</h4>
                  <p className="date-value">{item.date}</p>
                  <p className="date-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Render Contacts Tab
  const renderContacts = () => (
    <div className="contacts-section">
      <div className="section-header">
        <div className="header-left">
          <Phone className="section-icon" size={28} />
          <div>
            <h2>Helpline & Contacts</h2>
            <p>Get help when you need it</p>
          </div>
        </div>
      </div>

      <div className="contacts-category">
        <h3 className="category-title">
          <span className="title-icon">📞</span>
          Helpline Numbers
        </h3>
        <div className="contacts-grid">
          {contactsData.helplines.map(contact => (
            <div key={contact.id} className="contact-card">
              <h4>{contact.title}</h4>
              <div className="contact-info">
                <div className="info-row">
                  <Phone size={16} />
                  <div className="phone-numbers">
                    {contact.phones.map((phone, index) => (
                      <a key={index} href={`tel:${phone}`}>{phone}</a>
                    ))}
                  </div>
                </div>
                <div className="info-row">
                  <Mail size={16} />
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="info-row">
                  <Clock size={16} />
                  <span>{contact.timings}</span>
                </div>
              </div>
              <p className="contact-purpose">{contact.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="contacts-category">
        <h3 className="category-title">
          <span className="title-icon">🏢</span>
          Office Address
        </h3>
        <div className="contacts-grid">
          {contactsData.offices.map(office => (
            <div key={office.id} className="contact-card office-card">
              <h4>{office.title}</h4>
              <div className="contact-info">
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{office.address}</span>
                </div>
                <div className="info-row">
                  <Phone size={16} />
                  <a href={`tel:${office.phone}`}>{office.phone}</a>
                </div>
                <div className="info-row">
                  <Mail size={16} />
                  <a href={`mailto:${office.email}`}>{office.email}</a>
                </div>
              </div>
              {office.mapLink && (
                <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                  <MapPin size={14} />
                  View on Map
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Tips Tab
  const renderTips = () => (
    <div className="tips-section">
      <div className="section-header">
        <div className="header-left">
          <Lightbulb className="section-icon" size={28} />
          <div>
            <h2>Useful Tips & Guidelines</h2>
            <p>Pro tips to make your admission journey smooth</p>
          </div>
        </div>
      </div>

      {['Application', 'Documents', 'Counselling', 'Fees', 'General'].map(category => (
        <div key={category} className="tips-category">
          <h3 className="category-title">
            <span className="title-icon">💡</span>
            {category} Tips
          </h3>
          <div className="tips-grid">
            {tipsData
              .filter(tip => tip.category === category)
              .map(tip => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-icon">
                    <Lightbulb size={24} />
                  </div>
                  <div className="tip-content">
                    <h4>{tip.title}</h4>
                    <p>{tip.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="resource-vault-container">
      {/* Header */}
      <div className="vault-header">
        <div className="header-content">
          <h1>📚 Resource Vault</h1>
          <p>Your complete guide to Maharashtra CET admission process</p>
        </div>
        
        {/* Search Bar */}
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search documents, scholarships, links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={20} />
          <span>Documents</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'scholarships' ? 'active' : ''}`}
          onClick={() => setActiveTab('scholarships')}
        >
          <DollarSign size={20} />
          <span>Scholarships</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          <ExternalLink size={20} />
          <span>Important Links</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Image size={20} />
          <span>Process Timeline</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'dates' ? 'active' : ''}`}
          onClick={() => setActiveTab('dates')}
        >
          <Calendar size={20} />
          <span>Important Dates</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <Phone size={20} />
          <span>Contacts</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          <Lightbulb size={20} />
          <span>Tips</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'scholarships' && renderScholarships()}
        {activeTab === 'links' && renderLinks()}
        {activeTab === 'timeline' && renderTimeline()}
        {activeTab === 'dates' && renderDates()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'tips' && renderTips()}
      </div>
    </div>
  );
};

export default ResourceVault;