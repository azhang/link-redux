/* eslint no-magic-numbers: 0 */
import { mount } from "enzyme";
import { defaultNS, LinkedRenderStore } from "link-lib";
import * as React from "react";

import * as ctx from "../../../../test/fixtures";
import { linkedModelTouch } from "../../../redux/linkedObjects/actions";
import { PropertyComp as Property } from "../Property";

const subject = defaultNS.example("41");

describe("Property component", () => {
    it("renders null when label is not present", () => {
        const elem = mount(ctx.empty().wrapComponent(React.createElement(Property, { subject })));
        expect(elem.find(Property).children()).toHaveLength(0);
    });

    it("renders null when the given property is not present", () => {
        const opts = ctx.fullCW(subject);

        const comp = React.createElement(
            Property,
            { label: defaultNS.schema("title"), subject },
        );
        const elem = mount(opts.wrapComponent(comp));

        expect(elem.find(Property).children()).toHaveLength(0);
    });

    it("renders the value when no view is registered", () => {
        const title = "The title";
        const opts = ctx.name(subject, title);

        const comp = React.createElement(
            Property,
            { label: defaultNS.schema("name"), subject },
        );
        const elem = mount(opts.wrapComponent(comp));

        expect(elem.find("div").last()).toHaveText(title);
    });

    it("renders the view", () => {
        const title = "The title";
        const opts = ctx.name(subject, title);
        opts.lrs.registerAll(LinkedRenderStore.registerRenderer(
            () => React.createElement("div", { className: "nameProp" }),
            defaultNS.schema("Thing"),
            defaultNS.schema("name"),
        ));

        const comp = React.createElement(
            Property,
            { label: defaultNS.schema("name"), subject },
        );
        const elem = mount(opts.wrapComponent(comp));

        expect(elem.find(Property).children()).toHaveLength(1);
        expect(elem.find(".nameProp")).toBePresent();
    });

    it("renders a LRC when rendering a NamedNode", () => {
        const opts = ctx.fullCW(subject);
        const action = linkedModelTouch([subject]);
        opts.reduxStore.dispatch(action);
        opts.lrs.loadingComp = () => React.createElement("p", null, "loading");

        const comp = React.createElement(
            Property,
            { label: defaultNS.schema("author"), subject },
        );
        const elem = mount(opts.wrapComponent(comp));

        expect(elem.find(Property)).toHaveText("loading");
    });
});