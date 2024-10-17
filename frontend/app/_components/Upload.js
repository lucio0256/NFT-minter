"use client";

import { useForm, Controller } from 'react-hook-form';
import {useState, useEffect} from "react"
import {loadContract, connectMetamask, addNetwork, checkNetwork} from "../utils/interact"
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import {Tabs, Tab} from "@nextui-org/tabs";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiRobot3Line } from "react-icons/ri";
import {Image} from "@nextui-org/image";
import { ethers } from 'ethers';
import FormInput from "./FormInput";
import { useClient } from '../providers';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Upload() {

    const {client, setClient} = useClient()
    const [isMinting, setIsMinting] = useState(false)
    const [imageUrl, setImageUrl] = useState("no-image-icon-6.png")

    const {
        control,
        handleSubmit,
        formState,
        register,
        getValues,
        reset,
        formState: { errors, isValid, isSubmitSuccessful },
    } = useForm();



  const minttx = async (hash) => {

    try {

        await checkNetwork()

        setIsMinting(true)

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = loadContract(signer)

        const tx = await contract.safeMint(hash)
        console.log("tx executing")

        await tx.wait()

        reset();
        setImageUrl("no-image-icon-6.png");
        setIsMinting(false)

        console.log("minted")

    } catch (error) {
        toast.error(error.code)
        setIsMinting(false)
    }
}


  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("picture", data.picture)
    formData.append("name", data.name)
    formData.append("description", data.description)

    formData.append("client", client)

    try {
        const req = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const response = await req.json()

        minttx(response.hash)


    } catch (error) {
        console.error(error)
    }

  };


    return (

        <div className='flex justify-center items-center h-full p-4'>

            <Card className='flex flex-col md:flex-row p-4 h-full w-full max-w-4xl mx-auto'>
                <div className="flex-none w-full md:w-1/2 h-64 md:h-auto mt-4">
                    <Image
                        width="100%"
                        height="100%"
                        alt="NFT Preview"
                        src={imageUrl}
                        className="rounded-t-md md:rounded-l-md md:rounded-tr-none object-cover"
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/2 p-4">
                
                    <Tabs
                        variant=""
                        classNames={{
                            tabList: "w-full mx-auto",
                        }}
                    >

                    <Tab
                        key="custom"
                        title={
                            <div className="flex items-center space-x-2">
                                <IoCloudUploadOutline />
                                <span>Upload</span>
                            </div>
                        }
                    >

                        <form onSubmit={handleSubmit(onSubmit)}>

                        <Controller
                            control={control}
                            name={"picture"}
                            rules={{ required: "Picture is required" }}
                            render={({ field: { value, onChange, ...field } }) => {
                            return (
                                <Input
                                    {...field}
                                    type="file"
                                    className='px-2 py-2'
                                    label={"Picture"}
                                    value={value?.fileName}
                                    onChange={(event) => {
                                        onChange(event.target.files[0]);
                                        setImageUrl(URL.createObjectURL(event.target.files[0]))
                                    }}
                                    isInvalid={!!formState.errors?.["picture"]?.message}
                                    errorMessage={formState.errors?.["picture"]?.message?.toString()}  
                                />
                            );
                            }}
                        />


                        <FormInput 
                            className="px-2 py-2"
                            type={"text"}
                            name={"name"}
                            label={"Name"}
                            placeholder='Enter name of your NFT'
                            control={control}
                            rules={{ required: "Name is required" }}
                        />


                        <FormInput
                            className="px-2 py-2" 
                            type={"text"}
                            name={"description"}
                            label={"Description"}
                            placeholder='Enter description of your NFT'
                            control={control}
                            rules={{ required: "Description is required" }}
                        />


                        
                        <div className="flex justify-center pt-10">
                            <Button
                                isDisabled={client ? false : true}
                                isLoading={!isMinting ? false : true}
                                color={client ? 'primary' : "secondary"}
                                type='submit'
                                className="px-3 py-2 ms-2"
                            >
                                {client ? "Mint" : "Connect wallet" }
                            </Button>
                        </div>

                        </form>


                    </Tab>

                    <Tab
                        key="ai"
                        title={
                            <div className="flex items-center space-x-2">
                                <RiRobot3Line />
                                <span>AI Generated</span>
                            </div>
                        }
                    >
                        <span>Coming soon</span>
                    </Tab>
                
                </Tabs>
                </div>

            </Card>
            <ToastContainer />
        </div>
    );
}
