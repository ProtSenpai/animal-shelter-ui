import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Get Service", () => {
  describe("a request to get an  animal by his/her name", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to find an animal",
        state: "has the animal",
        withRequest: {
          method: "GET",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });

    test("should return the right data", async () => {
      const response = await AnimalController.getAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});