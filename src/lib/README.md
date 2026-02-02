# Notes

Since I endured pain to figure this out through all the AI misinformation and old StackOverflow posts, I should stash the solution somewhere. Hopefully the non-default branch won't be scraped.

I had initially written the dictionary search as a helper method that did a `fetch` call, and the logic was done in the `/pages/api` route. Figuring out how to test this was absurdly difficult. Of course, once I got it working, I realized the `fetch` call should be done in the component instead, and I refactored the logic into the `lib` folder.

Here is how I got the `fetch`-infused method tested:

```
/** @jest-environment node */ <- This must be at the top of the file so `fetch` exists in `global`

...

it("Validates a guess that is in the dictionary", async () => {
  const fetchMock = jest.spyOn(global, "fetch") as jest.Mock<
    (route: string) => Promise<Response>
  >;
  const mockData = { exists: true };
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => mockData,
  } as Response);
  const exists = await isInDictionary("hello");
  console.log(JSON.stringify(exists));
  assert.strictEqual(exists, true);
});

it("Stops a guess that is not in the dictionary", async () => {
  const fetchMock = jest.spyOn(global, "fetch") as jest.Mock<
    (route: string) => Promise<Response>
  >;
  const mockData = { exists: false };
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => mockData,
  } as Response);
  const exists = await isInDictionary("abcde");
  assert.strictEqual(exists, false);
});
```

The hardest part was having to describe the spy/mock type:

```
jest.Mock<(route: string) => Promise<Response>>
```

This was never in any of the AI suggestions, the supposedly TypeScript-friendly StackOverflow posts, or any "helpful" articles online.

You're welcome, future me.
