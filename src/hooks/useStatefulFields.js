//take input and put it in state

import React, { useState } from "react";

export function useStatefulFields() {
    const [values, setValues] = useState({});

    const handleChange = ({ target }) => {
        setValues({
            ...values,
            [target.name]: target.value,
        });
    };
    return { values, handleChange };
}
