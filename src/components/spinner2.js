'use client'
import { useState } from "react";
import { BarLoader } from "react-spinners";

function Spinner2() {
    let [loading, setLoading] = useState(true);

    return (
        <BarLoader
            color={'currentcolor'}
            size={10}
            loading={loading}
            // cssOverride={styles}
            aria-label="Loading Spinner1"
            data-testid="loader"
        />
    );
}

export default Spinner2;