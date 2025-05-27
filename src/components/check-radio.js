function CheckRadio({ name, defaultValue, defaultChecked = false, className, children }) {
    return (
        <label className={className} >
            <input
                type='radio'
                name={name}
                defaultValue={defaultValue}
                defaultChecked={defaultChecked}
                className='hidden' />
            {children}
        </label >
    );
}

export default CheckRadio;