import { Dialog as RadixDialog, Button, Flex } from '@radix-ui/themes'

const Dialog = ({
  children,
  title,
  description,
  open,
  onOpenChange,
  trigger,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  ...props
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange?.(false)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <RadixDialog.Trigger asChild>
          {trigger}
        </RadixDialog.Trigger>
      )}
      <RadixDialog.Content {...props}>
        {title && (
          <RadixDialog.Title>
            {title}
          </RadixDialog.Title>
        )}

        {description && (
          <RadixDialog.Description>
            {description}
          </RadixDialog.Description>
        )}

        <div className="mt-4">
          {children}
        </div>

        <Flex gap="3" mt="4" justify="end">
          <RadixDialog.Close>
            <Button variant="soft" color="gray" onClick={handleCancel}>
              {cancelText}
            </Button>
          </RadixDialog.Close>
          <Button
            onClick={handleConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </Button>
        </Flex>
      </RadixDialog.Content>
    </RadixDialog.Root>
  )
}

export default Dialog