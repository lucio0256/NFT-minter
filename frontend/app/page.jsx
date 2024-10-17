"use client"
import { useEffect, useState, useContext } from "react";
import Upload from "./_components/Upload";
import { useClient } from "./providers";


export default function Home() {

    const {client, setClient} = useClient()
    

    useEffect(() => {

    }, [client])


    return (    

        <div className="App">
            <Upload />
        </div>
    )
}

