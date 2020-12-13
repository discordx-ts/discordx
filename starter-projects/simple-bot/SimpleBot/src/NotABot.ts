import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = async (
  [message],
  next
) => {
  if (!message.author.bot) {
    await next();
  }
};
