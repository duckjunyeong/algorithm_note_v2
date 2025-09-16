import React from 'react';
import { useComponents } from './useComponents';
import { Button, Card, Footer, Input, Spinner, Typography } from 'ui-components/src/components';

export const ComponentsView = () => {
  const { selectedComponent, components, handleComponentSelect } = useComponents();

  const renderButtonDemo = () => (
    <Card className="space-y-6">
      <Typography variant="h4">Button Examples</Typography>

      <div className="space-y-4">
        <div>
          <Typography variant="h6" className="mb-3">Variants</Typography>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">Sizes</Typography>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">States</Typography>
          <div className="flex flex-wrap gap-3">
            <Button>Normal</Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCardDemo = () => (
    <div className="space-y-6">
      <Typography variant="h4">Card Examples</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="default">
          <Typography variant="h6" className="mb-2">Default Card</Typography>
          <Typography variant="body2" color="secondary">
            This is a default card with standard styling and shadow.
          </Typography>
        </Card>

        <Card variant="elevated" padding="lg">
          <Typography variant="h6" className="mb-2">Elevated Card</Typography>
          <Typography variant="body2" color="secondary">
            This card has an elevated appearance with more shadow depth and larger padding.
          </Typography>
        </Card>

        <Card variant="outlined" padding="sm">
          <Typography variant="h6" className="mb-2">Outlined Card</Typography>
          <Typography variant="body2" color="secondary">
            This card uses an outlined style with smaller padding.
          </Typography>
        </Card>
      </div>
    </div>
  );

  const renderInputDemo = () => (
    <Card className="space-y-6">
      <Typography variant="h4">Input Examples</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Basic Input"
            placeholder="Enter some text..."
            helperText="This is helper text"
          />

          <Input
            label="Email Input"
            type="email"
            placeholder="your@email.com"
          />

          <Input
            label="Password Input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Input with Error"
            placeholder="Enter value"
            error="This field is required"
          />

          <Input
            label="Disabled Input"
            placeholder="Can't edit this"
            disabled
          />

          <Input
            label="Search Input"
            placeholder="Search..."
            leftIcon={<span>🔍</span>}
          />
        </div>
      </div>
    </Card>
  );

  const renderTypographyDemo = () => (
    <Card className="space-y-6">
      <Typography variant="h4">Typography Examples</Typography>

      <div className="space-y-4">
        <div>
          <Typography variant="h6" className="mb-3">Headings</Typography>
          <div className="space-y-2">
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">Body Text</Typography>
          <div className="space-y-2">
            <Typography variant="body1">Body 1 - Regular paragraph text for main content</Typography>
            <Typography variant="body2">Body 2 - Smaller text for secondary content</Typography>
            <Typography variant="caption">Caption - Very small text for labels and metadata</Typography>
            <Typography variant="overline">Overline - Small caps text</Typography>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">Colors</Typography>
          <div className="space-y-2">
            <Typography color="primary">Primary text color</Typography>
            <Typography color="secondary">Secondary text color</Typography>
            <Typography color="tertiary">Tertiary text color</Typography>
            <Typography color="success">Success text color</Typography>
            <Typography color="warning">Warning text color</Typography>
            <Typography color="error">Error text color</Typography>
            <Typography color="info">Info text color</Typography>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderFooterDemo = () => (
    <div className="space-y-6">
      <Typography variant="h4">Footer Examples</Typography>

      <div className="space-y-8">
        <div>
          <Typography variant="h6" className="mb-4">Basic Footer</Typography>
          <Footer />
        </div>

        <div>
          <Typography variant="h6" className="mb-4">Footer with Links</Typography>
          <Footer
            links={[
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' }
            ]}
            socialLinks={[
              { label: 'GitHub', href: 'https://github.com', icon: '🐙' },
              { label: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
              { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' }
            ]}
          />
        </div>

        <div>
          <Typography variant="h6" className="mb-4">Custom Company Footer</Typography>
          <Footer
            companyName="Custom Company"
            copyrightYear={2024}
            links={[
              { label: 'Documentation', href: '/docs' },
              { label: 'API', href: '/api' },
              { label: 'Support', href: '/support' }
            ]}
          />
        </div>
      </div>
    </div>
  );

  const renderSpinnerDemo = () => (
    <Card className="space-y-6">
      <Typography variant="h4">Spinner Examples</Typography>
      <div className="space-y-6">
        <div>
          <Typography variant="h6" className="mb-3">Sizes</Typography>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Spinner size="sm" />
              <Typography variant="caption" className="block mt-2">Small</Typography>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <Typography variant="caption" className="block mt-2">Medium</Typography>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <Typography variant="caption" className="block mt-2">Large</Typography>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <Typography variant="caption" className="block mt-2">Extra Large</Typography>
            </div>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">Colors</Typography>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Spinner color="brand" />
              <Typography variant="caption" className="block mt-2">Brand</Typography>
            </div>
            <div className="text-center">
              <Spinner color="neutral" />
              <Typography variant="caption" className="block mt-2">Neutral</Typography>
            </div>
            <div className="text-center bg-neutral-800 p-4 rounded">
              <Spinner color="white" />
              <Typography variant="caption" className="block mt-2 text-white">White</Typography>
            </div>
          </div>
        </div>

        <div>
          <Typography variant="h6" className="mb-3">Usage Examples</Typography>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Typography variant="body2">Loading content...</Typography>
            </div>

            <Button isLoading disabled>
              Submit Form
            </Button>

            <div className="flex items-center justify-center p-8 bg-background-secondary rounded-lg">
              <div className="text-center">
                <Spinner size="lg" className="mb-3" />
                <Typography variant="body1">Processing your request</Typography>
                <Typography variant="body2" color="secondary">Please wait a moment</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderSelectedDemo = () => {
    switch (selectedComponent) {
      case 'button':
        return renderButtonDemo();
      case 'card':
        return renderCardDemo();
      case 'footer':
        return renderFooterDemo();
      case 'input':
        return renderInputDemo();
      case 'spinner':
        return renderSpinnerDemo();
      case 'typography':
        return renderTypographyDemo();
      default:
        return renderButtonDemo();
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Typography variant="h2" className="mb-2">Component Library</Typography>
          <Typography variant="body1" color="secondary">
            Explore and test the reusable UI components built with Linear design system
          </Typography>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Component Navigation */}
          <aside className="lg:w-64 shrink-0">
            <Card padding="sm">
              <Typography variant="h6" className="mb-4">Components</Typography>
              <nav className="space-y-2">
                {components.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentSelect(component.id)}
                    className={`w-full text-left p-3 rounded-md text-sm font-medium transition-colors ${
                      selectedComponent === component.id
                        ? 'bg-brand text-white'
                        : 'text-text-primary hover:bg-background-tertiary'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{component.name}</div>
                      <div className={`text-xs mt-1 ${
                        selectedComponent === component.id ? 'text-white/80' : 'text-text-tertiary'
                      }`}>
                        {component.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Component Demo */}
          <main className="flex-1">
            {renderSelectedDemo()}
          </main>
        </div>
      </div>
    </div>
  );
};