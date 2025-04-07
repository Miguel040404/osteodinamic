'use client'
import { useRef } from "react";

function Modal({ openElement, children }) {
    const refModal = useRef()

    const openModal = () => refModal.current?.showModal()
    const closeModal = () => refModal.current?.close()

    const handleClickOutside = (e) => {
        if (refModal.current) {
            const rect = refModal.current.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY
                && e.clientY <= rect.top + rect.height
                && rect.left <= e.clientX
                && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                refModal.current.close();
            }
        }
    }

    return (
        <>
            <div onClick={openModal} >
                {openElement}
            </div >

            <dialog ref={refModal} onMouseDown={handleClickOutside}
                className="place-self-center backdrop:bg-black/50 backdrop:backdrop-blur-none w-[90%] lg:w-[60%] py-12 px-8 rounded-md outline-none">

                <div onClick={closeModal} className="absolute top-4 right-4 cursor-pointer" >
                    ❌
                </div>

                {children}
            </dialog>
        </>
    );
}

export default Modal;