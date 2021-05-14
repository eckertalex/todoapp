import {Button, Text, VStack, ButtonProps} from '@chakra-ui/react'

export type LoadingButtonProps = Omit<ButtonProps, 'loadingText'> & {
  state: 'idle' | 'loading' | 'success' | 'error'
  ariaText: string
  ariaErrorAlert: string
  ariaSuccessAlert: string
  ariaLoadingAlert: string
  colorSchemeError: ButtonProps['colorScheme']
  colorSchemeSuccess: ButtonProps['colorScheme']
  icon?: React.ReactNode
  iconError?: React.ReactNode
  iconSuccess?: React.ReactNode
  text: string
  textError?: string
  textLoading: string
}

let LoadingButton: React.FC<LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ariaErrorAlert,
  ariaLoadingAlert,
  ariaSuccessAlert,
  ariaText,
  colorScheme,
  colorSchemeError,
  colorSchemeSuccess,
  icon,
  iconError,
  iconSuccess,
  state,
  text,
  textError = 'There was an error, please try again.',
  textLoading,
  ...props
}) => {
  const currentIcon = state === 'error' ? iconError : state === 'success' ? iconSuccess : icon
  const currentColorScheme =
    state === 'error' ? colorSchemeError : state === 'success' ? colorSchemeSuccess : colorScheme
  const label =
    state === 'loading'
      ? ariaLoadingAlert
      : state === 'error'
      ? ariaErrorAlert
      : state === 'success'
      ? ariaSuccessAlert
      : ariaText

  return (
    <VStack alignItems="flex-end">
      <Button
        aria-label={label}
        isLoading={state === 'loading'}
        loadingText={textLoading}
        leftIcon={<>{currentIcon}</>}
        colorScheme={currentColorScheme}
        {...props}
      >
        {text}
      </Button>
      {state === 'error' ? (
        <Text role="alert" color="red.300">
          {textError}
        </Text>
      ) : null}
    </VStack>
  )
}

export {LoadingButton}
