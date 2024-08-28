import dynamic from 'next/dynamic'
import React from 'react' 
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const NoSSRWrapper = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined }) => ( 
    // biome-ignore lint/complexity/noUselessFragments: <explanation>
    <React.Fragment>{props.children}</React.Fragment> 
) 
export default dynamic(() => Promise.resolve(NoSSRWrapper), { 
    ssr: false 
})