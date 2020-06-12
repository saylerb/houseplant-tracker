import { render, fireEvent } from "@testing-library/svelte";
import App from "./App.svelte";

test("app says hello", () => {
  const { getByText } = render(App, { name: "World" });

  expect(getByText("Hello World!")).toBeInTheDocument();
});

test("count is initially 0", () => {
  const { getByTestId } = render(App, { name: "World" });

  expect(getByTestId("count")).toHaveTextContent("0");
});

// Note: This is as an async test since we are using `fireEvent`
test("count increments when button is clicked", async () => {
  const { getByText, getByTestId } = render(App, { name: "World" });

  const button = getByText("+");

  await fireEvent.click(button);

  const count = getByTestId("count");

  expect(count).toHaveTextContent("1");
});
