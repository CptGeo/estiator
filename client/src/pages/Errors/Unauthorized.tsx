import { getAssetUrl } from "@core/utils";
import { Image } from "@nextui-org/react";

export default function Unauthorized() {

    return (
        <div className="flex items-center justify-center gap-2 mt-5">
            <Image width={40} radius="none" src={getAssetUrl("images/unauthorized.png")} />
            <h3 className="text-lg underline">You are unauthorized to view this page</h3>
        </div>
    )
}