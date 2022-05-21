import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Put Service", () => {
  describe("A request to edit an animal is called", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to edit an animal",
        state: "edit an animal",
        withRequest: {
          method: "PUT",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            id: Matchers.like(69),
            name: Matchers.like("manchas"),
            breed: Matchers.like("Pitbull"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });

    test("should return the right data", async () => {
      const response = await AnimalController.updateAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});