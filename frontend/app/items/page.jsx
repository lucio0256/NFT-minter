"use client"

import { useClient } from "@/app/providers";
import { loadContract, checkBalance, listTokens } from "../utils/interact"
import { useEffect, useState } from "react";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { checkNetwork } from "../utils/interact";

export default function Items() {

    const {client, setClient} = useClient()
    const [balance, setBalance] = useState()
    const [nftList, setNftList] = useState([])

    

    useEffect(()=> {
        const fetchBalance = async () => {
            const bal = await checkBalance(client)
            setBalance(bal)

            if (bal > 0) {
                await listTokens(client, (nft) => {
                    setNftList((prevList) => [...prevList, nft])
                })
                
            }
        }
        
        if (client) {
            fetchBalance()
        }

    }, [client])


    if (!client) {
        return (
            <h1 className="flex justify-center">
                Please, connect wallet
            </h1>
        )
    }

    return (
        <>
        {balance ? (
            <>
                <h1>
                    You have {balance.toString()} NFT: 
                </h1>
                {nftList && 
                    <div className="pt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {nftList.map((item, i) => (
                            <Card key={i} className="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center">
                                <CardHeader className="flex flex-col items-center pb-0 pt-2 w-full">
                                    <p className="text-xs uppercase font-bold text-center w-full">{item.name}</p>
                                </CardHeader>
                                <CardBody className="py-2 flex justify-center w-full">
                                <Image
                                    alt={`${item.name} image`}
                                    className="object-cover rounded-lg"
                                    src={item.image}
                                    width={180}
                                    height={180}
                                    />
                                </CardBody>
                                <CardFooter className="text-center w-ful">
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                                </CardFooter>
                            </Card>
                            
                        ))}
                    </div>
                }
            </>
            ) : (
            <h1>
                You don´t have any NFT yet
            </h1>
        )
        }
        </>
    )
}