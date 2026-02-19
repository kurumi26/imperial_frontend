import { useEffect, useState } from "react";
import styles from "@/styles/footer.module.css";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface GlobalFooterProps {
  logo?: string;
  companyDescription?: string;
  companyAddress?: string;
  columns?: FooterColumn[];
  copyrightText?: string;
  companyName?: string;
  socialLinks?: { icon: string; url: string; label: string }[];
}

export default function GlobalFooter({
  logo = "/images/ip.png",
  companyDescription = "Premium PVC piping and solutions for industrial and residential applications.",
  companyAddress = "L24, B75 Commonwealth Ave, Quezon City, Metro Manila, Philippines 8000",
  columns = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Products", href: "#" },
        { label: "Projects", href: "#" },
        { label: "News", href: "#" },
        { label: "Testimonials", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      title: "Social Media",
      links: [
        { label: "Facebook", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "Youtube", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Pinterest", href: "#" },
      ],
    },
  ],
  copyrightText = "All rights reserved.",
  companyName = "Imperial PVC",
  socialLinks = [],
}: GlobalFooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.footerContent}>
        <div className={styles.footerColumns}>
          {/* First Column: Logo, Description, Address */}
          <div className={styles.column}>
            {logo && (
              <img src={logo} alt={companyName} className={styles.footerLogo} style={{backgroundColor: "white"}} />
            )}
            <p className={styles.companyDescription}>{companyDescription}</p>
            <div className={styles.addressSection}>
              <p className={styles.addressLabel}>Address:</p>
              <p className={styles.addressText}>{companyAddress}</p>
            </div>
          </div>

          {/* Remaining Columns */}
          {columns.map((column, index) => (
            <div key={index} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.linksList}>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links Section (Optional) */}
        {socialLinks.length > 0 && (
          <div className={styles.socialSection}>
            <h3 className={styles.columnTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copyright Banner */}
      <div className={styles.copyrightBanner}>
        <div className={styles.copyrightContent}>
          <p className={styles.copyrightText}>
            © {currentYear} {companyName}. {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
