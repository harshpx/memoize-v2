"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import avatar from "animal-avatar-generator";
import Image from "next/image";

const page = () => {
    const [img, setImg] = useState(`data:image/svg+xml;base64,${btoa(avatar("",{size:400}))}`);
    const handleSeedInputChange = (e) => {
        setImg(`data:image/svg+xml;base64,${btoa(avatar(e.target.value,{size:400}))}`);
        console.log(img);
    }
    return (
    <div className="min-h-screen min-w-full flex flex-col gap-y-4 justify-center items-center">
        <Card className=" aspect-video p-10 flex flex-col gap-y-4 justify-center items-center">
            <p className="text-4xl my-2">Avatar Generator</p>
            <Image src={img} alt="Avatar" width={200} height={200}/>
            <Input className="w-fit" placeholder="Seed" onInput={handleSeedInputChange}></Input>
        </Card>
    </div>
    )
}

export default page;