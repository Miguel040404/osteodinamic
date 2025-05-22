
'use client'
import { forwardRef, useImperativeHandle, useRef } from "react";

const Modal = forwardRef(({ openElement, children }, ref) => {
    const dialogRef = useRef()

    const openModal = () => dialogRef.current?.showModal()
    const closeModal = () => dialogRef.current?.close()

    useImperativeHandle(ref, () => ({
        closeModal: closeModal
    }))

    const handleClickOutside = (e) => {
        if (dialogRef.current) {
            const rect = dialogRef.current.getBoundingClientRect()
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            )
            if (!isInDialog) {
                closeModal()
            }
        }
    }

    return (
        <>
            <div onClick={openModal}>
                {openElement}
            </div>

            <dialog 
                ref={dialogRef} 
                onMouseDown={handleClickOutside}
                className="place-self-center backdrop:bg-black/50 backdrop:backdrop-blur-none w-[90%] lg:w-[60%] py-12 px-8 rounded-md outline-none"
            >
                <div onClick={closeModal} className="absolute top-4 right-4 cursor-pointer">
                    ❌
                </div>
                {children}
            </dialog>
        </>
    )
})

export default Modal