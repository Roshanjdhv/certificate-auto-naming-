import React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

function HowToUse({ onClose, theme, toggleTheme }) {
  return (
    <div className="how-to-use-overlay">
      <header>
        <h1>auto name Certificate Generator - How to Use</h1>
        <span style={{ flex: 1 }}></span>
        <a 
          href="/" 
          onClick={onClose}
          style={{
            background: 'var(--text)',
            color: 'var(--bg)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginRight: '12px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} /> Back to Editor
        </a>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />} Toggle Theme
        </button>
      </header>

      <div className="how-to-use-body">
        <div className="container">
          <h1>How Auto naming certificate Works</h1>
          <p>WiMailer makes it easy to create personalised certificates from a single certificate design and a list of recipients. You can customise the certificate, preview each recipientâ€™s version, download them all, or send them directly by email.</p>

          <h2>1. Upload Your Certificate Design</h2>
          <p>Start by uploading your certificate template as a PNG, JPG, or WebP image.</p>
          <p>Your uploaded design becomes the background of your certificate. You can use a certificate created in Canva, Photoshop, or any other design tool.</p>

          <h2>2. Import Your Recipient List</h2>
          <p>Upload your recipient data using an Excel or CSV file.</p>
          <p>Each column in your spreadsheet becomes available as a field that you can use on your certificate and in your email.</p>
          <p>For example:</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice</td>
                <td><a href="mailto:alice@example.com">alice@example.com</a></td>
                <td>Web Development</td>
                <td>10 Sept 2026</td>
              </tr>
              <tr>
                <td>Rahul</td>
                <td><a href="mailto:rahul@example.com">rahul@example.com</a></td>
                <td>Data Science</td>
                <td>10 Sept 2026</td>
              </tr>
            </tbody>
          </table>
          <p>The Name and Email columns are used for personalising and delivering certificates. You can also use additional information such as course, date, grade, department, or any other column in your file.</p>

          <h2>3. Place Personalised Fields</h2>
          <p>Drag fields from your imported spreadsheet onto the certificate.</p>
          <p>For example, place the <strong>Name</strong> field where the recipient's name should appear.</p>
          <p>When certificates are generated, WiMailer automatically replaces the field with the correct information for each recipient.</p>

          <h2>4. Customise the Design</h2>
          <p>Select any field on the certificate and customise its appearance.</p>
          <p>You can change:</p>
          <ul>
            <li>Font style</li>
            <li>Font size</li>
            <li>Text colour</li>
            <li>Bold or italic</li>
            <li>Text alignment</li>
            <li>Uppercase or Title Case</li>
            <li>Drop shadow</li>
            <li>Position of the text</li>
          </ul>
          <p>You can adjust the design until your certificate looks exactly the way you want.</p>

          <h2>5. Preview & Customise Individual Certificates</h2>
          <p>Select any recipient from the data table to preview their personalised certificate.</p>
          <p>If a particular name is too long or needs a slightly different position, you can customise that certificate individually without changing the design for everyone else.</p>
          <p>Individual changes are saved as row-specific overrides.</p>

          <h2>6. Download Your Certificates</h2>
          <p>Once everything looks correct, you can download your certificates.</p>
          <ul>
            <li><strong>Download Preview</strong> lets you download the certificate for the currently selected recipient.</li>
            <li><strong>Download All as ZIP</strong> generates all personalised certificates and packs them into a single ZIP file.</li>
          </ul>

          <h2>7. Set Up Email Delivery</h2>
          <p>Want to send the certificates directly to your recipients?</p>
          <p>Set up your SMTP email account from <strong>Setup SMTP</strong>.</p>
          <p>You will need:</p>
          <ul>
            <li><strong>SMTP Host</strong> â€” for example, smtp.gmail.com</li>
            <li><strong>Port</strong> â€” usually 587 for TLS or 465 for SSL</li>
            <li><strong>Username</strong> â€” your email address</li>
            <li><strong>Password / App Password</strong></li>
            <li><strong>From Name</strong> â€” the name recipients will see</li>
          </ul>
          <p>You can use <strong>Test Connection</strong> to make sure your email settings are working before sending certificates.</p>
          <p><em>Gmail Users: If you use Gmail, use a Google App Password instead of your regular Gmail password.</em></p>

          <h2>8. Create Your Email</h2>
          <p>Write the email that will be sent along with each certificate.</p>
          <p>You can use information from your spreadsheet inside the email using variables such as:</p>
          <ul>
            <li><code>{"{{firstName}}"}</code></li>
            <li><code>{"{{course}}"}</code></li>
            <li><code>{"{{date}}"}</code></li>
          </ul>
          <p>For example:</p>
          <pre style={{ background: 'var(--surface2)', padding: '15px', borderRadius: '8px', fontFamily: 'inherit', overflowX: 'auto' }}>
{`Subject: Congratulations, {{firstName}}!

Message:
Hi {{firstName}},

Please find your certificate for {{course}} attached.

Best regards,
The Team`}
          </pre>
          <p>WiMailer automatically replaces these variables with the correct information for each recipient.</p>
          <p>You can also save frequently used emails as templates and reuse them later.</p>

          <h2>9. Send Your Certificates</h2>
          <p>Once your certificate and email are ready, click <strong>Send Certificates by Email</strong>.</p>
          <p>WiMailer will:</p>
          <ol>
            <li>Create a personalised certificate for each recipient.</li>
            <li>Apply any individual customisations.</li>
            <li>Personalise the email using your spreadsheet data.</li>
            <li>Attach the correct certificate.</li>
            <li>Send it to the recipient's email address.</li>
            <li>Show the delivery status and any errors.</li>
          </ol>
          <p>Recipients without an email address are automatically skipped.</p>

          <h2>That's It!</h2>
          <p style={{ fontWeight: 600, textAlign: 'center', fontSize: '1.1em' }}>Design â†’ Import â†’ Personalise â†’ Preview â†’ Download or Email</p>
          <p>WiMailer handles the repetitive work so you can create and deliver hundreds of personalised certificates quickly and easily.</p>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;

