'use client'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react'


const Modal = forwardRef(({ openElement, children, title }, ref) => {
  const modalRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  // Garantiza restaurar el scroll cuando el modal se cierra o desmonta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Permite acceder desde fuera a las funciones closeModal y openModal
  useImperativeHandle(ref, () => ({
    closeModal: closeModal,
    openModal: openModal,
  }))

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal()
    }
  }

  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {openElement && (
        <div onClick={openModal} className="cursor-pointer">
          {openElement}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="flex items-center justify-center min-h-screen w-full p-4">
            <div
              ref={modalRef}
              className="relative bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto z-10 animate-scaleIn"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  {title || ' '}
                </h2>

                <button
                  onClick={closeModal}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4d4037e2] rounded-full p-1"
                  aria-label="Cerrar modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="py-4 text-gray-600">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

Modal.displayName = 'Modal'

export default Modal