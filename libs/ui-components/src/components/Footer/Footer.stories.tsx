import React from 'react'
import { FooterView } from './Footer.view'
import type { FooterProps } from './useFooter'

export default {
  title: 'Components/Footer',
  component: FooterView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    companyName: {
      control: 'text',
      description: 'Company name displayed in footer',
    },
    showCopyright: {
      control: 'boolean',
      description: 'Whether to show copyright section',
    },
    copyrightYear: {
      control: 'number',
      description: 'Copyright year',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

const Template = (args: FooterProps) => <FooterView {...args} />

export const Default = Template.bind({})
Default.args = {
  companyName: 'AlgoRevise',
  showCopyright: true,
  copyrightYear: 2024,
}

export const WithLinks = Template.bind({})
WithLinks.args = {
  companyName: 'AlgoRevise',
  showCopyright: true,
  copyrightYear: 2024,
  links: [
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
}

export const WithSocialLinks = Template.bind({})
WithSocialLinks.args = {
  companyName: 'AlgoRevise',
  showCopyright: true,
  copyrightYear: 2024,
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com', icon: '🐙' },
    { label: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
  ],
}

export const Complete = Template.bind({})
Complete.args = {
  companyName: 'AlgoRevise',
  showCopyright: true,
  copyrightYear: 2024,
  links: [
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com', icon: '🐙' },
    { label: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
    { label: 'Discord', href: 'https://discord.com', icon: '💬' },
  ],
}

export const Minimal = Template.bind({})
Minimal.args = {
  companyName: 'AlgoRevise',
  showCopyright: false,
}

export const CustomCompany = Template.bind({})
CustomCompany.args = {
  companyName: 'Custom Tech Company',
  showCopyright: true,
  copyrightYear: 2023,
  links: [
    { label: 'Products', href: '/products' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Support', href: '/support' },
  ],
  socialLinks: [
    { label: 'Website', href: 'https://example.com', icon: '🌐' },
    { label: 'Email', href: 'mailto:contact@example.com', icon: '✉️' },
  ],
}