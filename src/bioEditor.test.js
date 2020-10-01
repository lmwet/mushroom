import React from "react";
import BioEditor from "./bioEditor";
import axios from "./axios";
import { render, waitForElement, fireEvent } from "@testing-library/react";

jest.mock("./axios");

test("When no bio is passed to it, an 'Add' button is rendered.", async () => {
    axios.get.mockResolvedValue({
        data: [null, { success: true }],
    });

    const { container } = render(<BioEditor />); //this must be called container, props too must have same name,
    //its value will be the the same as the actual DOM, like "document" in vanilla JS

    const elem = await waitForElement(() => container.querySelector("span"));
    expect(elem.innerHTML).toBe("Add bio");
});

test("When a bio is passed to it, an 'Edit' button is rendered", async () => {
    axios.get.mockResolvedValue({
        data: ["whatever string", { success: true }],
    });

    const { container } = render(<BioEditor />); //this must be called container, props too must have same name,
    //its value will be the the same as the actual DOM, like "document" in vanilla JS

    const elem = await waitForElement(() => container.querySelector("span"));
    expect(elem.innerHTML).toBe("Edit");
});

test("Clicking either the add or edit button causes a textarea and a Save button to be rendered", async () => {
    axios.get.mockResolvedValue({
        data: ["whatever string", { success: true }],
    });

    const { container } = render(<BioEditor currentBio="bla" />);
    const elem = await waitForElement(() => container.querySelector("span"));
    fireEvent.click(elem);

    expect(container.querySelector("div").innerHTML).toContain("textarea");
    expect(container.querySelector("button").innerHTML).toBe("Save");
});

// test("Clicking the Save button causes an ajax request.", async () => {
//     axios.get.mockResolvedValue({
//         data: ["bla", { success: true }],
//     });

//     const { container } = render(<BioEditor currentBio="bla" />);
//     const elem = await waitForElement(() => container.querySelector("span"));
//     fireEvent.click(elem);

//     fireEvent.click(container.querySelector("button"));

//     axios.post.mockResolvedValue({
//         data: [{ success: true }],
//     });
//     return axios.post().then((data) => expect(data.data.success).toBe(true));
// });

///last ex

// test("onClick prop gets called when img is clicked", () => {
//     const myMockOnClick = jest.fn();
//     const { container } = render(<ProfilePic onClick={myMockOnClick} />);
//     fireEvent.click(container.querySelector("img"));
//     expect(myMockOnClick.mock.calls.length).toBe(1);
// });
