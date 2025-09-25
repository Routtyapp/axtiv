import { Spinner as RadixSpinner, Flex, Text } from '@radix-ui/themes'

const Spinner = ({
  size = "2",
  loading = true,
  children,
  text,
  ...props
}) => {
  if (!loading) {
    return children || null
  }

  return (
    <Flex direction="column" align="center" gap="2" {...props}>
      <RadixSpinner size={size} />
      {text && (
        <Text size="2" color="gray">
          {text}
        </Text>
      )}
    </Flex>
  )
}

export default Spinner