import { create } from "zustand";

export interface Friend {
  id: string;
  username: string;
  displayName?: string;
  addedVia: "username" | "contacts" | "invite";
  addedAt: string;
  lastFartAt?: string;
}

interface FriendsState {
  friends: Friend[];
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
}

export const useFriends = create<FriendsState>((set) => ({
  friends: [],
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((s) => ({ friends: [friend, ...s.friends.filter((f) => f.id !== friend.id)] })),
  removeFriend: (id) => set((s) => ({ friends: s.friends.filter((f) => f.id !== id) })),
}));
