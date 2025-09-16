import React from 'react';
import { useFooter } from './useFooter';
import type { FooterProps } from './useFooter';

export const FooterView = (props: FooterProps) => {
  const {
    footerClasses,
    companyName,
    links,
    socialLinks,
    showCopyright,
    copyrightYear,
  } = useFooter(props);

  return (
    <footer className={footerClasses}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-white">
              {companyName}
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              AI-powered algorithm problem management platform for enhanced learning and practice.
            </p>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-medium text-neutral-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-neutral-300 hover:text-neutral-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-medium text-neutral-white">
                Connect
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-neutral-300 hover:text-neutral-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon || social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        {showCopyright && (
          <div className="mt-8 pt-8 border-t border-neutral-700">
            <p className="text-center text-neutral-400 text-sm">
              © {copyrightYear} {companyName}. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};