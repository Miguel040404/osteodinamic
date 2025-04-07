function Check({ id, label, defaultChecked, className }) {
    return (
        <label className={className} >
            <input
                type="checkbox"
                id={id}
                name={id}
                value={id}
                defaultChecked={defaultChecked}
                className='hidden' />
            {label}
        </label >
    );
}

export default Check;