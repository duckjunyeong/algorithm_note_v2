import React from 'react'
import { SignInWithGoogleButtonView } from './SignInWithGoogleButton.view'

interface SignInWithGoogleButtonViewProps {
  isLoading: boolean
  onClick: () => void
}

export default {
  title: 'Components/SignInWithGoogleButton',
  component: SignInWithGoogleButtonView,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
  },
}

const Template = (args: SignInWithGoogleButtonViewProps) => <SignInWithGoogleButtonView {...args} />

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  onClick: () => console.log('Sign in clicked'),
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
  onClick: () => console.log('Sign in clicked'),
}

export const Interactive = Template.bind({})
Interactive.args = {
  isLoading: false,
  onClick: () => console.log('Interactive sign in clicked'),
}