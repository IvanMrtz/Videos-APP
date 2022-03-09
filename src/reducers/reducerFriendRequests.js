import { Icon } from "@iconify/react";

export default function reducerFriendRequests(state, action) {
  switch (action.type) {
    case "add":
      return {
        text: "Add Friend",
        color: "var(--color-grey-lower)",
        icon: <Icon icon="akar-icons:person-add" />,
      };
    case "cancel":
      return {
        text: "Cancel",
        color: "var(--color-linked)",
        icon: <Icon icon="ic:baseline-cancel-schedule-send" />,
      };
    default:
      throw new Error();
  }
}
