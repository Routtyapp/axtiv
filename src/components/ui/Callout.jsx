import { Callout as RadixCallout } from '@radix-ui/themes'

const Callout = ({
  children,
  variant = "soft",
  color = "blue",
  size = "2",
  ...props
}) => {
  return (
    <RadixCallout.Root
      variant={variant}
      color={color}
      size={size}
      {...props}
    >
      {children}
    </RadixCallout.Root>
  )
}

const CalloutIcon = ({ children }) => {
  return (
    <RadixCallout.Icon>
      {children}
    </RadixCallout.Icon>
  )
}

const CalloutText = ({ children }) => {
  return (
    <RadixCallout.Text>
      {children}
    </RadixCallout.Text>
  )
}

Callout.Icon = CalloutIcon
Callout.Text = CalloutText

export default Callout