import { Loader2Icon } from "lucide-react";

export default function Loading(){
    return(
        <div className="h-max flex justify-center items-end">
            <Loader2Icon className="animate-spin" size={40}/>
        </div>
    )
}