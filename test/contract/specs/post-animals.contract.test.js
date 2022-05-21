import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Post Service", () => {
  describe("When a request to post an animal", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "Post an animal",
        state: "add an animal",
        withRequest: {
          method: "POST",
          path: "/animals",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            id: Matchers.like(69),
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });

    test("should return the right data", async () => {
      const animal = {
        name: "manchas",
        breed: "Bengali",
        gender: "Female",
        vaccinated: true,
      };
      const response = await AnimalController.register(animal);

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});