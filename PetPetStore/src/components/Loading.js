import React from "react";

import {FaBone} from "react-icons/fa"

export default function Loading() {
    return <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 'x-large',
        marginTop: '5%'
    }}>
        <FaBone className="fa fa-spinner fa-spin fa-3x fa-fw" size={450} width="100%"/>
    </div>
}
