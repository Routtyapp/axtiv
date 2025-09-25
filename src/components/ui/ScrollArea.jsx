import { ScrollArea as RadixScrollArea } from '@radix-ui/themes'

const ScrollArea = ({ children, ...props }) => {
  return (
    <RadixScrollArea
      {...props}
    >
      {children}
    </RadixScrollArea>
  )
}

export default ScrollArea