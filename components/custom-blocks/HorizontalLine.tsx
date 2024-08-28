import { createReactBlockSpec } from "@blocknote/react";
import { Separator } from "../ui/separator";

export const HRTYPE = "horizontalLine";

export const HorizontalLine = createReactBlockSpec(
    {
        type: HRTYPE,
        content: "none",
        propSchema: {}
    },
    {
        render: ({ block }) => {
            return (
                <div className="flex flex-col items-center align-middle h-[2px] w-full my-4">
                    <Separator className="w-full h-full" />   
                </div>

            )
        },
        toExternalHTML: ({ block }) => {
            return <hr />;
        }
    },
)