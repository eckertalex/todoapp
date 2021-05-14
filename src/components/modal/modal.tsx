import React from 'react'
import {
  Modal as CuiModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  ModalProps,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'

function callAll<Args extends readonly unknown[]>(...fns: readonly (((...args: Args) => void) | undefined)[]) {
  return (...args: Args): void => fns.forEach((fn) => fn?.(...args))
}

type ModalContextType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const ModalContext = React.createContext<ModalContextType>({isOpen: false, onOpen: () => {}, onClose: () => {}})

function Modal(props: {children: React.ReactNode}) {
  const disclosure = useDisclosure()

  return <ModalContext.Provider value={disclosure}>{props.children}</ModalContext.Provider>
}

function ModalOpenButton({children: child}: {children: React.ReactNode}) {
  const {onOpen} = React.useContext(ModalContext)

  return React.isValidElement(child) ? (
    React.cloneElement<{children: React.ReactNode; onClick: () => void}>(child, {
      onClick: callAll(() => onOpen(), child.props.onClick),
    })
  ) : (
    <>child</>
  )
}

function ModalContentsBase(props: Partial<ModalProps>) {
  const {isOpen, onClose} = React.useContext(ModalContext)

  return (
    <CuiModal isOpen={isOpen} onClose={onClose} {...props}>
      {props.children}
    </CuiModal>
  )
}

function ModalContents({title, children, ...props}: Partial<ModalProps> & {title: string}) {
  return (
    <ModalContentsBase {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </ModalContentsBase>
  )
}

export {Modal, ModalOpenButton, ModalContents, ModalBody, ModalFooter}
