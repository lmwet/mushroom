//make ajax req and redirect after input

import React, { useState } from "react";
import axios from "../axios";

export function useAuthSubmit(url, values) {
    const [error, setError] = useState(false);

    const submit = () => {
        async () => {
            const { data } = await axios.post(url, values);
            if (data.success) {
                location.pathname("/");
            } else {
                setError(true);
            }
        };
    };

    return [submit, error];
}
