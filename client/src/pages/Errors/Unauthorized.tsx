import { getAssetUrl } from "@core/utils";
import { Image } from "@heroui/react";

export default function Unauthorized() {

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="gap-2 mt-5 flex items-center justify-center">
                <Image width={40} radius="none" src={getAssetUrl("images/unauthorized.png")} />
                <h3 className="text-lg">You are unauthorized to view this page</h3>
            </div>
        </div>
    )
}