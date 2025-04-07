'use client'
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";


const styles = {
    display: "block",
    margin: "0 auto",
};

function Spinner1() {
    let [loading, setLoading] = useState(true);

    return (
        <PulseLoader
            color={'currentcolor'}
            size={10}
            loading={loading}
            cssOverride={styles}
            aria-label="Loading Spinner1"
            data-testid="loader"
        />
    );
}

export default Spinner1;