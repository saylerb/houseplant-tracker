import { render, fireEvent } from "@testing-library/svelte";
import Index from "./index.svelte";
import { getPlants } from "../api";

jest.mock("../api");

test("app loads list of plants on mount", async () => {
  getPlants.mockResolvedValue([{ name: "plant one" }]);

  const { findByText } = render(Index);

  expect(await findByText("plant one")).toBeInTheDocument();
});
