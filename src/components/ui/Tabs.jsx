import { Tabs as RadixTabs } from '@radix-ui/themes'

const Tabs = ({ children, defaultValue, value, onValueChange, ...props }) => {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      {children}
    </RadixTabs.Root>
  )
}

const TabsList = ({ children, ...props }) => {
  return (
    <RadixTabs.List {...props}>
      {children}
    </RadixTabs.List>
  )
}

const TabsTrigger = ({ children, value, ...props }) => {
  return (
    <RadixTabs.Trigger value={value} {...props}>
      {children}
    </RadixTabs.Trigger>
  )
}

const TabsContent = ({ children, value, ...props }) => {
  return (
    <RadixTabs.Content value={value} {...props}>
      {children}
    </RadixTabs.Content>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export default Tabs