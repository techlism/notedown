import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function ErrorScreen({errorMessage} : {errorMessage : string}){
    return(
        <div className="h-max flex justify-center items-center">
            <div>
                <TriangleAlert/>
                <p>
                    {errorMessage}
                </p>
                <Link
                href={'/'}
                className="hover:underline"
                >
                Go back to home
                </Link>
                
            </div>
        </div>
    )
}