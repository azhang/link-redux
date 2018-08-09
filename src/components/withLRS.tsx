import * as React from "react";

import { LinkedRenderStoreContext, Omit } from "../types";

import { Consumer } from "./withLinkCtx";

export function withLRS<P extends LinkedRenderStoreContext>(Component: React.ComponentType<P>):
    React.SFC<Omit<P, keyof LinkedRenderStoreContext>> {

    return (props) => (
        <Consumer>
            {({ lrs }) => {
                if (!lrs) {
                    throw new Error("No LinkedRenderStore provided");
                }

                return <Component {...props} lrs={lrs} />;
            }}
        </Consumer>
    );
}