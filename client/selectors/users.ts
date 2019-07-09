import { Set, Map } from "immutable";

export const getUsers = (
  state: {
    users: Map<string, any>,
  },
  { ids }: {
    ids: Iterable<string>,
  }
) => {
  ids = Set(ids);
  return state.users.get("items").filter(
    (user: Map<string, any>) => (ids as Set<string>).has(user.get("id"))
  );
};
