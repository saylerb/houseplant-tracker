import { render, fireEvent } from "@testing-library/svelte";
import Index from "./index.svelte";
import { getPlants } from "../api";

jest.mock("../api");

test("app loads list of plants on mount", async () => {
  getPlants.mockResolvedValue([
    { name: "plant one", lastWateredAt: "2020-10-13T00:04:20.386Z" }
  ]);

  const { findByText } = render(Index);

  expect(await findByText("plant one - 2020-10-13")).toBeInTheDocument();
});
