import fetchMock from "fetch-mock";

export function mockAPI(){
  fetchMock.mock("http://localhost:9000/");
}