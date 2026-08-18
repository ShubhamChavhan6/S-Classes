// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { FiUser, FiBookOpen, FiUsers, FiCheckCircle, FiArrowRight, FiArrowLeft, FiShield } from 'react-icons/fi';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Basic & Account Type
  const [accountType, setAccountType] = useState('STUDENT'); // 'STUDENT' or 'PARENT'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Qualification & Academic Details
  const [qualification, setQualification] = useState('Senior Secondary (Class 11 - 12)');
  const [institution, setInstitution] = useState('');
  const [stream, setStream] = useState('Computer Science / IT');
  const [gradeLevel, setGradeLevel] = useState('Class 12');
  const [targetGoal, setTargetGoal] = useState('Coding & Software Development');
  const [languagePref, setLanguagePref] = useState('English');
  const [skillLevel, setSkillLevel] = useState('Beginner');

  // Parent / Guardian Details
  const [parentName, setParentName] = useState('');
  const [parentRelation, setParentRelation] = useState('Father');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentOccupation, setParentOccupation] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!name || !email || !password) {
        toast.showToast('Please fill in all required account fields', 'error');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!qualification || !institution) {
        toast.showToast('Please provide qualification & school/college details', 'error');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullRegistrationData = {
        name,
        email,
        phone,
        password,
        accountType,
        qualification,
        institution,
        stream,
        gradeLevel,
        targetGoal,
        languagePref,
        skillLevel,
        parentName,
        parentRelation,
        parentPhone,
        parentEmail,
        parentOccupation,
        role: 'STUDENT',
      };

      await register(fullRegistrationData);
      toast.showToast('Account & Student Profile created successfully!', 'success');
      navigate('/client');
    } catch (err) {
      toast.showToast(err?.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '720px', 
          margin: '0 auto', 
          padding: '2.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          background: 'var(--bg-secondary, #121218)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Join S-Classes
          </h2>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.925rem' }}>
            Complete student qualification and parent profile for customized learning tracks
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.25rem', position: 'relative' }}>
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '10%', 
              right: '10%', 
              height: '2px', 
              background: 'var(--glass-border, rgba(255,255,255,0.1))', 
              zIndex: 0,
              transform: 'translateY(-50%)'
            }} 
          />
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '10%', 
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '40%' : '80%', 
              height: '2px', 
              background: 'var(--accent, #6c63ff)', 
              zIndex: 0,
              transform: 'translateY(-50%)',
              transition: 'width 0.3s ease'
            }} 
          />

          {/* Step 1 */}
          <div 
            onClick={() => setCurrentStep(1)}
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.35rem', 
              cursor: 'pointer' 
            }}
          >
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                background: currentStep >= 1 ? 'var(--accent, #6c63ff)' : '#1e1e2d', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: currentStep === 1 ? '3px solid #818cf8' : 'none'
              }}
            >
              {currentStep > 1 ? <FiCheckCircle size={18} /> : <FiUser size={18} />}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: currentStep >= 1 ? '#fff' : '#64748b' }}>Account</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => { if(name && email && password) setCurrentStep(2); }}
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.35rem', 
              cursor: 'pointer' 
            }}
          >
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                background: currentStep >= 2 ? 'var(--accent, #6c63ff)' : '#1e1e2d', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: currentStep === 2 ? '3px solid #818cf8' : 'none'
              }}
            >
              {currentStep > 2 ? <FiCheckCircle size={18} /> : <FiBookOpen size={18} />}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: currentStep >= 2 ? '#fff' : '#64748b' }}>Qualification</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => { if(qualification && institution) setCurrentStep(3); }}
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.35rem', 
              cursor: 'pointer' 
            }}
          >
            <div 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                background: currentStep >= 3 ? 'var(--accent, #6c63ff)' : '#1e1e2d', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: currentStep === 3 ? '3px solid #818cf8' : 'none'
              }}
            >
              <FiUsers size={18} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: currentStep >= 3 ? '#fff' : '#64748b' }}>Parent Info</span>
          </div>
        </div>

        {/* Form Body */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600 }}>Who is creating this account?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${accountType === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAccountType('STUDENT')}
                  style={{ gap: '0.5rem', justifyContent: 'center' }}
                >
                  <FiUser size={16} /> Student Myself
                </button>
                <button
                  type="button"
                  className={`btn ${accountType === 'PARENT' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAccountType('PARENT')}
                  style={{ gap: '0.5rem', justifyContent: 'center' }}
                >
                  <FiUsers size={16} /> Parent for Child
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Student Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Rahul Sharma" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Student Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="student@example.com" 
                  className="form-control" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Student Mobile / WhatsApp
                </label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+91 98765 43210" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Account Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="form-control" 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', gap: '0.5rem' }}>
              Continue to Qualification <FiArrowRight size={16} />
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              Academic Qualification & Background
            </h3>

            <div>
              <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                Current Educational Level / Qualification <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select 
                value={qualification} 
                onChange={e => setQualification(e.target.value)}
                className="form-control"
                style={{ background: '#0b0b12', color: '#fff' }}
              >
                <option value="Kids Learning (Pre-school / Class 1-3)">Kids Learning (Pre-school / Class 1-3)</option>
                <option value="Middle School (Class 4 - 8)">Middle School (Class 4 - 8)</option>
                <option value="Secondary School (Class 9 - 10)">Secondary School (Class 9 - 10)</option>
                <option value="Senior Secondary (Class 11 - 12)">Senior Secondary (Class 11 - 12 Science / Commerce / Arts)</option>
                <option value="Undergraduate (B.Tech / B.E. / BCA / B.Sc / B.Com / B.A.)">Undergraduate (B.Tech / B.E. / BCA / B.Sc / B.Com / B.A.)</option>
                <option value="Postgraduate (M.Tech / M.Sc / MCA / MBA / M.A.)">Postgraduate (M.Tech / M.Sc / MCA / MBA / M.A.)</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                <option value="Working Professional / Upskilling">Working Professional / Upskilling</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  School / College / Institution Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={institution} 
                  onChange={e => setInstitution(e.target.value)} 
                  placeholder="e.g. Kendriya Vidyalaya / IIT / Delhi University" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Stream / Field of Study
                </label>
                <select 
                  value={stream} 
                  onChange={e => setStream(e.target.value)}
                  className="form-control"
                  style={{ background: '#0b0b12', color: '#fff' }}
                >
                  <option value="Computer Science / IT">Computer Science / IT</option>
                  <option value="Science - PCM (Physics, Chem, Math)">Science - PCM (Physics, Chem, Math)</option>
                  <option value="Science - PCB (Medical)">Science - PCB (Medical)</option>
                  <option value="Commerce & Accounts">Commerce & Accounts</option>
                  <option value="Arts / Humanities">Arts / Humanities</option>
                  <option value="Mechanical / Electrical / Civil">Mechanical / Electrical / Civil</option>
                  <option value="General School Subjects">General School Subjects</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Grade / Class / Passing Year
                </label>
                <input 
                  type="text" 
                  value={gradeLevel} 
                  onChange={e => setGradeLevel(e.target.value)} 
                  placeholder="e.g. Class 12, 3rd Year, 2025" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Primary Learning Goal / Exam
                </label>
                <select 
                  value={targetGoal} 
                  onChange={e => setTargetGoal(e.target.value)}
                  className="form-control"
                  style={{ background: '#0b0b12', color: '#fff' }}
                >
                  <option value="School Syllabus & NCERT Boards">School Syllabus & NCERT Boards</option>
                  <option value="Coding & Software Development">Coding & Software Development</option>
                  <option value="Competitive Exams (JEE / NEET / CET)">Competitive Exams (JEE / NEET / CET)</option>
                  <option value="AI, Data Science & Web Tech">AI, Data Science & Web Tech</option>
                  <option value="Kids Foundational Phonics & Math">Kids Foundational Phonics & Math</option>
                  <option value="Government & General Aptitude">Government & General Aptitude</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Preferred Medium Language
                </label>
                <select 
                  value={languagePref} 
                  onChange={e => setLanguagePref(e.target.value)}
                  className="form-control"
                  style={{ background: '#0b0b12', color: '#fff' }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Hinglish">Hinglish (Mix)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Coding / Tech Experience Level
                </label>
                <select 
                  value={skillLevel} 
                  onChange={e => setSkillLevel(e.target.value)}
                  className="form-control"
                  style={{ background: '#0b0b12', color: '#fff' }}
                >
                  <option value="Beginner">Beginner (Zero / Minimal prior knowledge)</option>
                  <option value="Intermediate">Intermediate (Know basics & concepts)</option>
                  <option value="Advanced">Advanced (Hands-on projects & practice)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)} 
                className="btn btn-secondary" 
                style={{ gap: '0.4rem' }}
              >
                <FiArrowLeft size={16} /> Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1, gap: '0.5rem', justifyContent: 'center' }}
              >
                Continue to Parent Info <FiArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              Parent / Guardian & Contact Details
            </h3>

            <div style={{ padding: '0.75rem 1rem', background: 'rgba(108, 99, 255, 0.1)', border: '1px solid rgba(108, 99, 255, 0.25)', borderRadius: '10px', fontSize: '0.825rem', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiShield size={18} style={{ flexShrink: 0 }} />
              Parent/guardian details help us send academic progress updates, certificates, and course notifications.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Parent / Guardian Full Name
                </label>
                <input 
                  type="text" 
                  value={parentName} 
                  onChange={e => setParentName(e.target.value)} 
                  placeholder="e.g. Suresh Sharma" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Relationship with Student
                </label>
                <select 
                  value={parentRelation} 
                  onChange={e => setParentRelation(e.target.value)}
                  className="form-control"
                  style={{ background: '#0b0b12', color: '#fff' }}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Local Guardian</option>
                  <option value="Self / Spouse">Self / Spouse</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Parent Mobile / WhatsApp Number
                </label>
                <input 
                  type="tel" 
                  value={parentPhone} 
                  onChange={e => setParentPhone(e.target.value)} 
                  placeholder="+91 98765 00000" 
                  className="form-control" 
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Parent Email Address (Optional)
                </label>
                <input 
                  type="email" 
                  value={parentEmail} 
                  onChange={e => setParentEmail(e.target.value)} 
                  placeholder="parent@example.com" 
                  className="form-control" 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#a5b4fc', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                Parent Occupation / Profession
              </label>
              <input 
                type="text" 
                value={parentOccupation} 
                onChange={e => setParentOccupation(e.target.value)} 
                placeholder="e.g. Engineer / Teacher / Business / Govt Service" 
                className="form-control" 
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="btn btn-secondary" 
                style={{ gap: '0.4rem' }}
              >
                <FiArrowLeft size={16} /> Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1, gap: '0.5rem', justifyContent: 'center', fontWeight: 700, padding: '0.85rem' }}
              >
                Complete Registration & Setup Profile <FiCheckCircle size={18} />
              </button>
            </div>
          </form>
        )}

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already registered? <Link to="/login" style={{ color: '#6c63ff', fontWeight: 600 }}>Sign In Here</Link>
        </p>
      </div>
    </div>
  );
}
