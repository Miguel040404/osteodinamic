'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";

const Modal = forwardRef(({ openElement, children, title }, ref) => {
    const modalRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    useImperativeHandle(ref, () => ({
        closeModal: closeModal,
        openModal: openModal
    }));

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
        }
    };

    // Cerrar con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        };
        
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            {openElement && (
                <div 
                    onClick={openModal} 
                    className="cursor-pointer"
                >
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
                                {/* <h2 className="text-2xl font-bold text-gray-800">{title || 'Título'}</h2> */}
                                <h2 className="text-2xl font-bold text-gray-800">{title || ' '}</h2>

                                <button 
                                    onClick={closeModal} 
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                                    aria-label="Cerrar modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="py-4 text-gray-600">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

Modal.displayName = "Modal";

export default Modal;

// 'use client'

// import { forwardRef, useImperativeHandle, useRef } from "react";

// const Modal = forwardRef(({ openElement, children }, ref) => {
//     const dialogRef = useRef()

//     const openModal = () => dialogRef.current?.showModal()
//     const closeModal = () => dialogRef.current?.close()

//     useImperativeHandle(ref, () => ({
//         closeModal: closeModal
//     }))

//     const handleClickOutside = (e) => {
//         if (dialogRef.current) {
//             const rect = dialogRef.current.getBoundingClientRect()
//             const isInDialog = (
//                 rect.top <= e.clientY &&
//                 e.clientY <= rect.top + rect.height &&
//                 rect.left <= e.clientX &&
//                 e.clientX <= rect.left + rect.width
//             )
//             if (!isInDialog) {
//                 closeModal()
//             }
//         }
//     }

//     return (
//         <>
//             <div onClick={openModal}>
//                 {openElement}
//             </div>

//             <dialog 
//                 ref={dialogRef} 
//                 onMouseDown={handleClickOutside}
//                 className="place-self-center backdrop:bg-black/50 backdrop:backdrop-blur-none w-[90%] lg:w-[60%] py-12 px-8 rounded-md outline-none"
//             >
//                 <div onClick={closeModal} className="absolute top-4 right-4 cursor-pointer">
//                     ❌
//                 </div>
//                 {children}
//             </dialog>
//         </>
//     )
// })

// Modal.displayName = "Modal";

// export default Modal

